# QA and Assembly

## Slide QA

Check every accepted slide for:

- factual correctness;
- title/label/name/number accuracy;
- missing or hallucinated content;
- malformed or unreadable text;
- clipping or truncation;
- hierarchy and density;
- style consistency with the approved sample;
- faithful use of required source assets;
- compliance with hard and negative constraints;
- repair-safe text zones;
- no graphic/text overlap;
- no connectors crossing behind text;
- accidental page numbers, watermarks, or irrelevant logos.

## Text repairability QA

Apply the overlay test to each text block:

> If a flat rectangle about 20% larger than the visible text were placed over the text, would it damage nearby graphics, borders, arrows, icons, or neighboring text?

If yes, the text region is not repair-safe and the slide needs editing/regeneration.

## Repair vs regenerate

Use ImageGen editing for localized defects.

Regenerate for structural problems, major constraint violations, failed hierarchy, or broad text-layout failure.

## Assembly

Final PPTX assembly must not alter accepted artwork.

The assembler should:

- place one accepted slide image edge-to-edge on each 16:9 slide;
- preserve slide order;
- embed speaker notes when available;
- avoid adding visible elements over the slide image.

Validate slide count, image coverage, notes, and file readability before completion.
