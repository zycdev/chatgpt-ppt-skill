#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const errors = [];
const warnings = [];

function read(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    errors.push('Missing file: ' + rel);
    return null;
  }
  return fs.readFileSync(p, 'utf8');
}

function parseJson(rel) {
  const text = read(rel);
  if (text === null) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    errors.push('Invalid JSON in ' + rel + ': ' + e.message);
    return null;
  }
}

function checkRequired(obj, required, label) {
  if (!obj || !Array.isArray(required)) return;
  for (const key of required) {
    if (!(key in obj)) errors.push(label + ' missing required field: ' + key);
  }
}

const manifest = parseJson('skill-manifest.json');
const skill = read('SKILL.md');
const schema = parseJson('references/deck_state.schema.json');
const example = parseJson('examples/deck_state.example.json');

let skillVersion = null;
if (skill) {
  const m = skill.match(/^version:\s*(.+)$/m);
  skillVersion = m ? m[1].trim() : null;
  if (!skillVersion) errors.push('SKILL.md frontmatter version not found');
}

if (manifest && skillVersion && manifest.version !== skillVersion) {
  errors.push('Version mismatch: manifest=' + manifest.version + ' SKILL=' + skillVersion);
}

if (manifest) {
  const requiredFiles = new Set(manifest.core_files || []);
  for (const list of Object.values(manifest.progressive_load || {})) {
    for (const rel of list) requiredFiles.add(rel);
  }
  for (const rel of manifest.style_library || []) requiredFiles.add(rel);
  for (const rel of Object.values(manifest.optional_resources || {})) {
    if (!fs.existsSync(path.join(root, rel))) warnings.push('Missing optional resource: ' + rel);
  }
  for (const rel of requiredFiles) {
    if (!fs.existsSync(path.join(root, rel))) errors.push('Manifest references missing file: ' + rel);
  }
}

if (schema && manifest) {
  const schemaVersion = schema?.properties?.schema_version?.const;
  const declaredVersion = schema?.properties?.skill_binding?.properties?.declared_version?.const;
  if (schemaVersion !== manifest.version) errors.push('Schema version does not match manifest');
  if (declaredVersion !== manifest.version) errors.push('Schema declared_version does not match manifest');
}

if (example && manifest) {
  if (example.schema_version !== manifest.version) errors.push('Example schema_version does not match manifest');
  if (example?.skill_binding?.declared_version !== manifest.version) {
    errors.push('Example declared_version does not match manifest');
  }
}

if (schema && example) {
  checkRequired(example, schema.required, 'example root');
  checkRequired(example.skill_binding, schema?.properties?.skill_binding?.required, 'example skill_binding');
  checkRequired(example.deck, schema?.properties?.deck?.required, 'example deck');
  checkRequired(example.outline, schema?.properties?.outline?.required, 'example outline');
  checkRequired(example.style, schema?.properties?.style?.required, 'example style');
  checkRequired(example.sample, schema?.properties?.sample?.required, 'example sample');
  checkRequired(example.output, schema?.properties?.output?.required, 'example output');

  const slideSchema = schema?.properties?.slides?.patternProperties?.['^[1-9][0-9]*$'];
  const firstSlide = example?.slides?.['1'];
  checkRequired(firstSlide, slideSchema?.required, 'example slide 1');
}

for (const rel of ['scripts/validate_project.cjs', 'scripts/assemble_ppt.cjs']) {
  const js = read(rel);
  if (js !== null) {
    try {
      new Function(js.replace(/^#!.*\n/, ''));
    } catch (e) {
      errors.push('Syntax error in ' + rel + ': ' + e.message);
    }
  }
}

const result = {
  ok: errors.length === 0,
  version: manifest?.version || null,
  style_count: Array.isArray(manifest?.style_library) ? manifest.style_library.length : 0,
  errors,
  warnings
};

console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exit(1);
