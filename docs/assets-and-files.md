# Assets and File Fidelity

## Source hierarchy

Prefer, in order:

1. user-supplied figures/screenshots/charts/logos that are explicitly required;
2. source-document assets extracted from supplied files;
3. user-approved reusable style/reference assets;
4. newly generated supporting visuals.

Do not redraw or semantically alter a required source figure merely to make it “prettier.”

## Asset fidelity

When a source asset must be used:

- preserve labels, axes, legends, ordering, and factual relationships;
- do not invent missing labels or data;
- do not crop away semantically important content;
- do not add branding or decorative overlays that obscure the asset;
- keep the asset visually integrated with the slide while preserving its meaning.

## File handling

Maintain:

- `source_assets/` for extracted or supplied assets used by the deck;
- `prompts/` for per-slide generation prompts when useful;
- `origin_image/` for accepted full-slide images.

Do not introduce extra worker-state, queue-state, backend-state, or dispatch files.
