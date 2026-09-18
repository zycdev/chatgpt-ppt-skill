#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function loadPptxGenJS() {
  const candidates = [
    'pptxgenjs',
    '/opt/nvm/versions/node/v22.16.0/lib/node_modules/pptxgenjs',
    '/usr/local/slides_js/node_modules/pptxgenjs'
  ];
  let lastErr;
  for (const candidate of candidates) {
    try { return require(candidate); } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error('pptxgenjs not found');
}

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--project') out.project = argv[++i];
    else if (a === '--output') out.output = argv[++i];
    else if (a === '--validate-only') out.validateOnly = true;
    else if (a === '--help' || a === '-h') out.help = true;
    else throw new Error(`Unknown argument: ${a}`);
  }
  return out;
}

function usage() {
  console.log('Usage: node scripts/assemble_ppt.cjs --project /path/to/project --output /path/to/output.pptx [--validate-only]');
}

function slideNumber(filename) {
  const m = filename.match(/^slide_(\d+)\.png$/i);
  return m ? Number(m[1]) : null;
}

function getSlideImages(imgDir) {
  const items = fs.readdirSync(imgDir)
    .map(filename => ({ filename, number: slideNumber(filename) }))
    .filter(x => x.number !== null)
    .sort((a, b) => a.number - b.number || a.filename.localeCompare(b.filename));

  if (!items.length) throw new Error(`No slide images found in ${imgDir}`);

  const seen = new Set();
  for (const item of items) {
    if (seen.has(item.number)) throw new Error(`Duplicate slide number: ${item.number}`);
    seen.add(item.number);
  }

  for (let expected = 1; expected <= items.length; expected++) {
    if (!seen.has(expected)) throw new Error(`Missing slide image for slide ${expected}`);
  }
  return items;
}

function parseSpeech(md) {
  const notes = new Map();
  if (!md || !md.trim()) return notes;

  const heading = /^#{2,4}\s*(?:Slide\s*(\d+)|第\s*(\d+)\s*页)\s*(?::|：|-)?\s*.*$/i;
  let current = null;
  let buf = [];

  const flush = () => {
    if (current === null) return;
    const text = buf.join('\n').trim();
    if (text) notes.set(current, text);
  };

  for (const rawLine of md.split(/\r?\n/)) {
    const m = rawLine.trim().match(heading);
    if (m) {
      flush();
      current = Number(m[1] || m[2]);
      buf = [];
    } else if (current !== null) {
      buf.push(rawLine);
    }
  }
  flush();
  return notes;
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.project || (!args.output && !args.validateOnly)) {
    usage();
    if (!args.help) process.exitCode = 2;
    return;
  }

  const project = path.resolve(args.project);
  const imgDir = path.join(project, 'origin_image');
  if (!fs.existsSync(imgDir)) throw new Error(`Missing origin_image directory: ${imgDir}`);

  const images = getSlideImages(imgDir);
  const statePath = path.join(project, 'deck_state.json');
  if (!fs.existsSync(statePath)) throw new Error(`Missing deck_state.json: ${statePath}`);
  let deckState;
  try {
    deckState = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  } catch (e) {
    throw new Error(`Invalid deck_state.json: ${e.message}`);
  }

  const expectedCount = Number(deckState?.deck?.target_slide_count || 0);
  if (!Number.isInteger(expectedCount) || expectedCount < 1) {
    throw new Error('Invalid deck.target_slide_count in deck_state.json');
  }
  if (images.length !== expectedCount) {
    throw new Error(`Slide-image count ${images.length} does not match target_slide_count ${expectedCount}`);
  }

  const allowed = new Set(['accepted', 'accepted_with_waiver']);
  for (let n = 1; n <= expectedCount; n++) {
    const stateSlide = deckState?.slides?.[String(n)];
    if (!stateSlide || !allowed.has(stateSlide.status)) {
      throw new Error(`Slide ${n} is not accepted for assembly`);
    }
    if (stateSlide.status === 'accepted_with_waiver' &&
        (!Array.isArray(stateSlide.waivers) || stateSlide.waivers.length === 0)) {
      throw new Error(`Slide ${n} is accepted_with_waiver but has no recorded waiver`);
    }
  }

  const speechPath = path.join(project, 'speech.md');
  const speech = fs.existsSync(speechPath) ? fs.readFileSync(speechPath, 'utf8') : '';
  const notes = parseSpeech(speech);

  const validation = {
    project,
    slide_count: images.length,
    first_slide: images[0].filename,
    last_slide: images[images.length - 1].filename,
    notes_count: [...notes.keys()].filter(n => n >= 1 && n <= images.length).length
  };

  if (args.validateOnly) {
    console.log(JSON.stringify(validation, null, 2));
    return;
  }

  const output = path.resolve(args.output);
  const PptxGenJS = loadPptxGenJS();
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'ChatGPT PPT Skill';
  pptx.subject = 'Image-based presentation visual draft';
  pptx.title = path.basename(output, path.extname(output));
  pptx.lang = deckState?.deck?.language || 'zh-CN';

  for (const item of images) {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };
    slide.addImage({
      path: path.join(imgDir, item.filename),
      x: 0, y: 0, w: 13.333, h: 7.5
    });
    if (notes.has(item.number)) slide.addNotes(notes.get(item.number));
  }

  fs.mkdirSync(path.dirname(output), { recursive: true });
  await pptx.writeFile({ fileName: output });
  console.log(JSON.stringify({ output, ...validation }));
}

main().catch(err => {
  console.error(err.stack || String(err));
  process.exit(1);
});
