#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function readPngSize(filePath) {
  const b = fs.readFileSync(filePath);
  const sig = Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);
  if (b.length < 24 || !b.subarray(0, 8).equals(sig)) return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function hasHeading(md, pattern) {
  return new RegExp('^##\\s+' + pattern + '\\s*
function validatePrompt({ promptPath, slide, slideNumber, sourceGroundingRequired, errors, warnings, project }) {
  if (!promptPath || !fs.existsSync(promptPath)) {
    errors.push(`Missing saved prompt for slide ${slideNumber}: ${path.relative(project, promptPath || '')}`);
    return;
  }

  const md = fs.readFileSync(promptPath, 'utf8');
  if (md.trim().length < 500) {
    errors.push(`Slide ${slideNumber} prompt is too short to be a self-contained generation brief`);
  }

  const requiredHeadings = [
    ['Canvas', 'Canvas(?:\\s*/\\s*slide identity)?'],
    ['Exact visible text', 'Exact visible text'],
    ['Hard constraints', 'Hard constraints'],
    ['Acceptance criteria', 'Acceptance criteria(?:\\s*/\\s*QA)?']
  ];
  for (const [label, regex] of requiredHeadings) {
    if (!hasHeading(md, regex)) {
      errors.push(`Slide ${slideNumber} prompt missing required heading: ## ${label}`);
    }
  }

  if (sourceGroundingRequired &&
      !/^##\s+Source anchors(?:\s*\/\s*content locks)?\s*$/im.test(md)) {
    errors.push(`Slide ${slideNumber} prompt missing source anchors/content locks for a source-grounded deck`);
  }

  const placeholder = /\b(?:XXX|TBD|TODO|PLACEHOLDER)\b|Lorem\s+ipsum/i;
  if (placeholder.test(md)) {
    errors.push(`Slide ${slideNumber} prompt contains placeholder text`);
  }

  if (slide?.title && !md.includes(slide.title)) {
    warnings.push(`Slide ${slideNumber} prompt does not contain the exact state title: ${slide.title}`);
  }
}

function main() {
  const args = process.argv.slice(2);
  const i = args.indexOf('--project');
  if (i < 0 || !args[i + 1]) die('Usage: node scripts/validate_project.cjs --project /path/to/project');

  const project = path.resolve(args[i + 1]);
  const statePath = path.join(project, 'deck_state.json');
  const imageDir = path.join(project, 'origin_image');

  const errors = [];
  const warnings = [];

  if (!fs.existsSync(statePath)) errors.push('Missing deck_state.json');
  if (!fs.existsSync(imageDir)) errors.push('Missing origin_image directory');
  if (errors.length) {
    console.log(JSON.stringify({ ok: false, errors, warnings }, null, 2));
    process.exit(1);
  }

  let state;
  try {
    state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  } catch (e) {
    die(`Invalid deck_state.json: ${e.message}`);
  }

  if (state?.schema_version !== '0.4.1') {
    errors.push(`Expected deck_state schema_version 0.4.1, got ${state?.schema_version ?? 'missing'}`);
  }
  if (state?.skill_binding?.declared_version !== '0.4.1') {
    errors.push(`Expected skill_binding.declared_version 0.4.1, got ${state?.skill_binding?.declared_version ?? 'missing'}`);
  }

  if (state?.skill_binding?.load_mode === 'transient_github' && !state?.skill_binding?.resolved_commit) {
    warnings.push('Transient GitHub state does not record resolved_commit; reproducibility is reduced');
  }

  const count = Number(state?.deck?.target_slide_count || 0);
  if (!Number.isInteger(count) || count < 1) errors.push('Invalid deck.target_slide_count');

  const sourceGroundingRequired = state?.deck?.source_grounding_required === true;
  if (sourceGroundingRequired && state?.outline?.content_lock_applied !== true) {
    errors.push('Source-grounded deck is missing outline.content_lock_applied=true');
  }

  if (state?.deck?.approval_mode === 'interactive') {
    if (!state?.outline?.approved) errors.push('Outline is not approved');
    if (!state?.style?.approved) errors.push('Visual direction is not approved');
    if (!state?.sample?.approved) errors.push('Representative sample is not approved');
  }

  if (state?.sample?.approved && !state?.sample?.primary_visual_anchor) {
    errors.push('Approved sample is not marked as primary_visual_anchor');
  }
  if (state?.sample?.approved && !state?.sample?.preflight_passed) {
    const waivers = Array.isArray(state?.sample?.waivers) ? state.sample.waivers : [];
    if (!waivers.length) {
      errors.push('Approved sample failed preflight and has no explicit waiver');
    } else {
      warnings.push('Representative sample was approved with an explicit preflight waiver');
    }
  }

  const acceptedStatuses = new Set(['accepted', 'accepted_with_waiver']);

  for (let n = 1; n <= count; n++) {
    const key = String(n);
    const slide = state?.slides?.[key];
    const expectedImage = path.join(imageDir, `slide_${String(n).padStart(2, '0')}.png`);

    if (!slide) {
      errors.push(`Missing state entry for slide ${n}`);
      continue;
    }

    if (!acceptedStatuses.has(slide.status)) {
      errors.push(`Slide ${n} status is ${slide.status}, not accepted/accepted_with_waiver`);
    }

    const waivers = Array.isArray(slide.waivers) ? slide.waivers : [];
    const issues = Array.isArray(slide.issues) ? slide.issues : [];

    if (slide.status === 'accepted_with_waiver' && !waivers.length) {
      errors.push(`Slide ${n} is accepted_with_waiver but has no recorded waiver`);
    }
    if (slide.status === 'accepted' && waivers.length) {
      errors.push(`Slide ${n} is accepted but still records waiver(s); use accepted_with_waiver`);
    }
    if (slide.status === 'accepted' && issues.length) {
      errors.push(`Slide ${n} is accepted but still records unresolved issue(s)`);
    }

    if (!fs.existsSync(expectedImage)) {
      errors.push(`Missing final image: ${path.relative(project, expectedImage)}`);
    } else {
      const stat = fs.statSync(expectedImage);
      if (stat.size === 0) {
        errors.push(`Empty final image: ${path.relative(project, expectedImage)}`);
      } else {
        const size = readPngSize(expectedImage);
        if (!size || !size.width || !size.height) {
          errors.push(`Invalid PNG final image: ${path.relative(project, expectedImage)}`);
        } else {
          const ratio = size.width / size.height;
          const target = 16 / 9;
          if (Math.abs(ratio - target) > 0.02) {
            errors.push(`Slide ${n} is not 16:9: ${size.width}x${size.height}`);
          }
        }
      }
    }

    const promptRel = slide.prompt_path || `prompts/slide_${String(n).padStart(2, '0')}.md`;
    const promptPath = path.resolve(project, promptRel);
    validatePrompt({
      promptPath,
      slide,
      slideNumber: n,
      sourceGroundingRequired,
      errors,
      warnings,
      project
    });

    if (sourceGroundingRequired) {
      const refs = Array.isArray(slide.source_refs) ? slide.source_refs : [];
      if (!refs.length) warnings.push(`Slide ${n} has no source_refs recorded in deck_state`);
    }
  }

  const speechRel = state?.output?.speech_path;
  if (speechRel) {
    const speechPath = path.resolve(project, speechRel);
    if (!fs.existsSync(speechPath)) {
      errors.push(`Missing speech file: ${speechRel}`);
    } else {
      const speech = fs.readFileSync(speechPath, 'utf8');
      const placeholder = /\b(?:XXX|TBD|TODO|PLACEHOLDER)\b|Lorem\s+ipsum/i;
      if (placeholder.test(speech)) errors.push('speech.md contains placeholder text');
      const speechSlides = parseSpeechSlides(speech);
      for (let n = 1; n <= count; n++) {
        if (!speechSlides.has(n)) errors.push(`speech.md missing notes for slide ${n}`);
      }
    }
  }

  if (state?.deck?.status === 'complete') {
    const pptxRel = state?.output?.pptx_path;
    if (!pptxRel) {
      errors.push('Complete deck is missing output.pptx_path');
    } else {
      const pptxPath = path.resolve(project, pptxRel);
      if (!fs.existsSync(pptxPath) || fs.statSync(pptxPath).size === 0) {
        errors.push(`Missing or empty final PPTX: ${pptxRel}`);
      }
    }
  }

  const stray = fs.readdirSync(imageDir)
    .filter(f => !/^slide_\d+\.png$/i.test(f));
  if (stray.length) warnings.push(`Non-final/non-PNG files in origin_image: ${stray.join(', ')}`);

  if (state?.output?.validation_passed !== true) {
    warnings.push('output.validation_passed is not true yet; set it only after all validation/assembly checks complete');
  }

  const result = {
    ok: errors.length === 0,
    target_slide_count: count,
    accepted_with_waiver: Object.values(state?.slides || {}).filter(s => s?.status === 'accepted_with_waiver').length,
    errors,
    warnings
  };
  console.log(JSON.stringify(result, null, 2));
  if (errors.length) process.exit(1);
}

main();
, 'im').test(md);
}

function parseSpeechSlides(md) {
  const seen = new Set();
  const re = /^#{2,4}\s*(?:Slide\s*(\d+)|第\s*(\d+)\s*页)\s*(?::|：|-)?\s*.*$/gim;
  let m;
  while ((m = re.exec(md)) !== null) seen.add(Number(m[1] || m[2]));
  return seen;
}

function validatePrompt({ promptPath, slide, slideNumber, sourceGroundingRequired, errors, warnings, project }) {
  if (!promptPath || !fs.existsSync(promptPath)) {
    errors.push(`Missing saved prompt for slide ${slideNumber}: ${path.relative(project, promptPath || '')}`);
    return;
  }

  const md = fs.readFileSync(promptPath, 'utf8');
  if (md.trim().length < 500) {
    errors.push(`Slide ${slideNumber} prompt is too short to be a self-contained generation brief`);
  }

  const requiredHeadings = [
    ['Canvas', 'Canvas(?:\\s*/\\s*slide identity)?'],
    ['Exact visible text', 'Exact visible text'],
    ['Hard constraints', 'Hard constraints'],
    ['Acceptance criteria', 'Acceptance criteria(?:\\s*/\\s*QA)?']
  ];
  for (const [label, regex] of requiredHeadings) {
    if (!hasHeading(md, regex)) {
      errors.push(`Slide ${slideNumber} prompt missing required heading: ## ${label}`);
    }
  }

  if (sourceGroundingRequired &&
      !/^##\s+Source anchors(?:\s*\/\s*content locks)?\s*$/im.test(md)) {
    errors.push(`Slide ${slideNumber} prompt missing source anchors/content locks for a source-grounded deck`);
  }

  const placeholder = /\b(?:XXX|TBD|TODO|PLACEHOLDER)\b|Lorem\s+ipsum/i;
  if (placeholder.test(md)) {
    errors.push(`Slide ${slideNumber} prompt contains placeholder text`);
  }

  if (slide?.title && !md.includes(slide.title)) {
    warnings.push(`Slide ${slideNumber} prompt does not contain the exact state title: ${slide.title}`);
  }
}

function main() {
  const args = process.argv.slice(2);
  const i = args.indexOf('--project');
  if (i < 0 || !args[i + 1]) die('Usage: node scripts/validate_project.cjs --project /path/to/project');

  const project = path.resolve(args[i + 1]);
  const statePath = path.join(project, 'deck_state.json');
  const imageDir = path.join(project, 'origin_image');

  const errors = [];
  const warnings = [];

  if (!fs.existsSync(statePath)) errors.push('Missing deck_state.json');
  if (!fs.existsSync(imageDir)) errors.push('Missing origin_image directory');
  if (errors.length) {
    console.log(JSON.stringify({ ok: false, errors, warnings }, null, 2));
    process.exit(1);
  }

  let state;
  try {
    state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  } catch (e) {
    die(`Invalid deck_state.json: ${e.message}`);
  }

  if (state?.schema_version !== '0.4.1') {
    errors.push(`Expected deck_state schema_version 0.4.1, got ${state?.schema_version ?? 'missing'}`);
  }
  if (state?.skill_binding?.declared_version !== '0.4.1') {
    errors.push(`Expected skill_binding.declared_version 0.4.1, got ${state?.skill_binding?.declared_version ?? 'missing'}`);
  }

  if (state?.skill_binding?.load_mode === 'transient_github' && !state?.skill_binding?.resolved_commit) {
    warnings.push('Transient GitHub state does not record resolved_commit; reproducibility is reduced');
  }

  const count = Number(state?.deck?.target_slide_count || 0);
  if (!Number.isInteger(count) || count < 1) errors.push('Invalid deck.target_slide_count');

  const sourceGroundingRequired = state?.deck?.source_grounding_required === true;
  if (sourceGroundingRequired && state?.outline?.content_lock_applied !== true) {
    errors.push('Source-grounded deck is missing outline.content_lock_applied=true');
  }

  if (state?.deck?.approval_mode === 'interactive') {
    if (!state?.outline?.approved) errors.push('Outline is not approved');
    if (!state?.style?.approved) errors.push('Visual direction is not approved');
    if (!state?.sample?.approved) errors.push('Representative sample is not approved');
  }

  if (state?.sample?.approved && !state?.sample?.primary_visual_anchor) {
    errors.push('Approved sample is not marked as primary_visual_anchor');
  }
  if (state?.sample?.approved && !state?.sample?.preflight_passed) {
    const waivers = Array.isArray(state?.sample?.waivers) ? state.sample.waivers : [];
    if (!waivers.length) {
      errors.push('Approved sample failed preflight and has no explicit waiver');
    } else {
      warnings.push('Representative sample was approved with an explicit preflight waiver');
    }
  }

  const acceptedStatuses = new Set(['accepted', 'accepted_with_waiver']);

  for (let n = 1; n <= count; n++) {
    const key = String(n);
    const slide = state?.slides?.[key];
    const expectedImage = path.join(imageDir, `slide_${String(n).padStart(2, '0')}.png`);

    if (!slide) {
      errors.push(`Missing state entry for slide ${n}`);
      continue;
    }

    if (!acceptedStatuses.has(slide.status)) {
      errors.push(`Slide ${n} status is ${slide.status}, not accepted/accepted_with_waiver`);
    }

    const waivers = Array.isArray(slide.waivers) ? slide.waivers : [];
    const issues = Array.isArray(slide.issues) ? slide.issues : [];

    if (slide.status === 'accepted_with_waiver' && !waivers.length) {
      errors.push(`Slide ${n} is accepted_with_waiver but has no recorded waiver`);
    }
    if (slide.status === 'accepted' && waivers.length) {
      errors.push(`Slide ${n} is accepted but still records waiver(s); use accepted_with_waiver`);
    }
    if (slide.status === 'accepted' && issues.length) {
      errors.push(`Slide ${n} is accepted but still records unresolved issue(s)`);
    }

    if (!fs.existsSync(expectedImage)) {
      errors.push(`Missing final image: ${path.relative(project, expectedImage)}`);
    } else {
      const stat = fs.statSync(expectedImage);
      if (stat.size === 0) {
        errors.push(`Empty final image: ${path.relative(project, expectedImage)}`);
      } else {
        const size = readPngSize(expectedImage);
        if (!size || !size.width || !size.height) {
          errors.push(`Invalid PNG final image: ${path.relative(project, expectedImage)}`);
        } else {
          const ratio = size.width / size.height;
          const target = 16 / 9;
          if (Math.abs(ratio - target) > 0.02) {
            errors.push(`Slide ${n} is not 16:9: ${size.width}x${size.height}`);
          }
        }
      }
    }

    const promptRel = slide.prompt_path || `prompts/slide_${String(n).padStart(2, '0')}.md`;
    const promptPath = path.resolve(project, promptRel);
    validatePrompt({
      promptPath,
      slide,
      slideNumber: n,
      sourceGroundingRequired,
      errors,
      warnings,
      project
    });

    if (sourceGroundingRequired) {
      const refs = Array.isArray(slide.source_refs) ? slide.source_refs : [];
      if (!refs.length) warnings.push(`Slide ${n} has no source_refs recorded in deck_state`);
    }
  }

  const stray = fs.readdirSync(imageDir)
    .filter(f => !/^slide_\d+\.png$/i.test(f));
  if (stray.length) warnings.push(`Non-final/non-PNG files in origin_image: ${stray.join(', ')}`);

  if (state?.output?.validation_passed !== true) {
    warnings.push('output.validation_passed is not true yet; set it only after all validation/assembly checks complete');
  }

  const result = {
    ok: errors.length === 0,
    target_slide_count: count,
    accepted_with_waiver: Object.values(state?.slides || {}).filter(s => s?.status === 'accepted_with_waiver').length,
    errors,
    warnings
  };
  console.log(JSON.stringify(result, null, 2));
  if (errors.length) process.exit(1);
}

main();
