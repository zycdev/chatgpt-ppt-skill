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
    else if (a === '--help' || a === '-h') out.help = true;
    else throw new Error(`Unknown argument: ${a}`);
  }
  return out;
}

function usage() {
  console.log('Usage: node scripts/assemble_ppt.cjs --project /path/to/project --output /path/to/output.pptx');
}

function naturalSlideNumber(filename) {
  const m = filename.match(/slide_(\d+)/i);
  return m ? Number(m[1]) : Number.MAX_SAFE_INTEGER;
}

function parseSpeech(md) {
  const notes = new Map();
  if (!md || !md.trim()) return notes;
  const re = /^##\s+Slide\s+(\d+)(?::[^\n]*)?\s*$\n([\s\S]*?)(?=^##\s+Slide\s+\d+|\s*$)/gmi;
  let m;
  while ((m = re.exec(md)) !== null) {
    notes.set(Number(m[1]), m[2].trim());
  }
  return notes;
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.project || !args.output) {
    usage();
    if (!args.help) process.exitCode = 2;
    return;
  }

  const project = path.resolve(args.project);
  const output = path.resolve(args.output);
  const imgDir = path.join(project, 'origin_image');
  if (!fs.existsSync(imgDir)) throw new Error(`Missing origin_image directory: ${imgDir}`);

  const images = fs.readdirSync(imgDir)
    .filter(f => /^slide_\d+\.(png|jpe?g|webp)$/i.test(f))
    .sort((a, b) => naturalSlideNumber(a) - naturalSlideNumber(b));

  if (!images.length) throw new Error(`No slide images found in ${imgDir}`);

  const speechPath = path.join(project, 'speech.md');
  const speech = fs.existsSync(speechPath) ? fs.readFileSync(speechPath, 'utf8') : '';
  const notes = parseSpeech(speech);

  const PptxGenJS = loadPptxGenJS();
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'ChatGPT PPT Skill';
  pptx.subject = 'Image-based presentation visual draft';
  pptx.title = path.basename(output, path.extname(output));
  pptx.company = 'OpenAI';
  pptx.lang = 'zh-CN';

  images.forEach((filename, idx) => {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };
    slide.addImage({ path: path.join(imgDir, filename), x: 0, y: 0, w: 13.333, h: 7.5 });
    const slideNo = idx + 1;
    if (notes.has(slideNo)) slide.addNotes(notes.get(slideNo));
  });

  fs.mkdirSync(path.dirname(output), { recursive: true });
  await pptx.writeFile({ fileName: output });
  console.log(JSON.stringify({ output, slide_count: images.length, notes_count: [...notes.keys()].filter(n => n >= 1 && n <= images.length).length }));
}

main().catch(err => {
  console.error(err.stack || String(err));
  process.exit(1);
});
