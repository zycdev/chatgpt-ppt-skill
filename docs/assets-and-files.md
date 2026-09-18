# Assets and File Fidelity

This document preserves the strict source-asset handling rules from the upstream skill while removing backend-specific CLI assumptions.

## Source hierarchy

Prefer, in order:

1. user-supplied figures/screenshots/charts/logos that are explicitly required;
2. source-document assets extracted from supplied files;
3. user-approved style/reference assets;
4. newly generated supporting visuals.

Required source assets are **inputs**, not loose inspiration.

## Project-local assets

Maintain source assets outside `origin_image/`.

Recommended structure:

```text
source_assets/
├── figures/
├── screenshots/
├── logos/
└── style_refs/
```

`origin_image/` is reserved for final `slide_XX.png` artwork.

## Outline mapping

For every slide that must include a source asset:

- record the exact attachment/file/reference in the slide's outline entry;
- describe its role;
- mark it as **strict input asset** when its content must remain unchanged;
- ask the user to verify ambiguous mappings before generation.

## Make the asset visible before generation

Before generating a slide that depends on a source image, inspect that image in the current conversation/runtime so the model has actual visual access to it.

In the generation prompt, label each visible reference by role, for example:

- Image 1 — approved sample; style reference only.
- Image 2 — experiment figure; strict input asset.
- Image 3 — logo; strict identity asset.

Do not rely on a local filename alone as if ImageGen can infer its pixels.

## Strict fidelity

For a strict source figure/chart/screenshot:

- preserve labels, axes, legends, numerical values, ordering, colors that encode meaning, arrows, curves, bars, and factual relationships;
- do not invent missing labels or data;
- do not redraw, recreate, reinterpret, or synthesize a “similar” replacement unless the user explicitly requests a stylized redraw;
- do not crop away semantically important content;
- do not add decorative overlays that obscure the evidence;
- compose title, callouts, background, and supporting visual structure around the asset.

For logos or identity marks, use only user-provided/authorized assets. Never invent a real institution/company logo.

## Style reference vs source asset

Keep these roles distinct:

- **strict input asset**: content must be preserved;
- **style reference only**: visual language may be inherited, but source content should not be copied;
- **supporting visual reference**: may guide composition but need not appear verbatim.

The approved sample is a style reference, not a source asset.

## QA

After generation, explicitly inspect whether each required source asset:

- is present;
- is recognizable;
- remains semantically faithful;
- was not occluded by new text or decoration;
- still passes the intended reading order.

If not, edit/regenerate before acceptance.
