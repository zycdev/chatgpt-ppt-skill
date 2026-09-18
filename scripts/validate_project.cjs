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

  const count = Number(state?.deck?.target_slide_count || 0);
  if (!Number.isInteger(count) || count < 1) errors.push('Invalid deck.target_slide_count');

  if (state?.deck?.approval_mode === 'interactive') {
    if (!state?.outline?.approved) errors.push('Outline is not approved');
    if (!state?.style?.approved) errors.push('Visual direction is not approved');
    if (!state?.sample?.approved) errors.push('Representative sample is not approved');
  }

  if (state?.sample?.approved && !state?.sample?.primary_visual_anchor) {
    errors.push('Approved sample is not marked as primary_visual_anchor');
  }

  for (let n = 1; n <= count; n++) {
    const key = String(n);
    const slide = state?.slides?.[key];
    const expected = path.join(imageDir, `slide_${String(n).padStart(2, '0')}.png`);

    if (!slide) errors.push(`Missing state entry for slide ${n}`);
    else if (slide.status !== 'accepted') errors.push(`Slide ${n} status is ${slide.status}, not accepted`);

    if (!fs.existsSync(expected)) {
      errors.push(`Missing final image: ${path.relative(project, expected)}`);
    } else {
      const stat = fs.statSync(expected);
      if (stat.size === 0) {
        errors.push(`Empty final image: ${path.relative(project, expected)}`);
      } else {
        const size = readPngSize(expected);
        if (!size || !size.width || !size.height) {
          errors.push(`Invalid PNG final image: ${path.relative(project, expected)}`);
        } else {
          const ratio = size.width / size.height;
          const target = 16 / 9;
          if (Math.abs(ratio - target) > 0.02) {
            errors.push(`Slide ${n} is not 16:9: ${size.width}x${size.height}`);
          }
        }
      }
    }

    const promptPath = path.join(project, 'prompts', `slide_${String(n).padStart(2, '0')}.md`);
    if (!fs.existsSync(promptPath)) warnings.push(`Missing saved prompt for slide ${n}`);
  }

  const stray = fs.readdirSync(imageDir)
    .filter(f => !/^slide_\d+\.(png|jpe?g|webp)$/i.test(f));
  if (stray.length) warnings.push(`Non-final files in origin_image: ${stray.join(', ')}`);

  const result = {
    ok: errors.length === 0,
    target_slide_count: count,
    errors,
    warnings
  };
  console.log(JSON.stringify(result, null, 2));
  if (errors.length) process.exit(1);
}

main();
