# Style Reuse

This Chat edition does **not** automatically create or mutate a persistent personal style library. That decision remains unchanged.

However, the upstream skill's style-extraction discipline is useful and is retained here for **current-task style references** and any explicitly available reusable external style assets.

## Built-in library

The repository ships with detailed built-in style briefs under `references/*.md`. See `references/style-catalog.md`.

These are richer than labels: they define palette, typography, density, layout patterns, visual elements, image treatment, and rendering constraints.

## User-supplied style references

Use a user-supplied screenshot/image/PDF/PPT/PPTX when explicitly provided.

Inspect the **visible output**, not just document metadata or object structure.

For PDF/PPT/PPTX references, inspect representative rendered pages/slides. Prefer a cover/opener, ordinary content slide, diagram/data slide, and closing slide when available.

Extract reusable visual rules such as:

- visual direction;
- background/canvas treatment;
- palette and semantic color usage;
- typography hierarchy;
- spacing/density/whitespace;
- recurring layout patterns;
- diagram/illustration language;
- photo/screenshot/chart treatment;
- allowed/avoided decoration;
- rendering constraints.

Do not carry over private or one-off content:

- project/customer names;
- paper results;
- exact slide copy;
- business data;
- personal information;
- identifiable logos unless explicitly requested;
- topic-specific images unless needed for the current task.

## Priority

For the current deck:

1. explicit user instructions;
2. explicit user-supplied style reference;
3. approved representative sample;
4. approved `visual_spec.md`;
5. selected built-in detailed style reference.

After sample approval, the approved sample is the primary visual anchor for generation, while `visual_spec.md` and the detailed reference remain authoritative for constraints not visible in the sample.

## Long-term persistence

Do not silently write a personal style into GitHub or elsewhere.

If the user explicitly asks to preserve a custom style for future work, treat that as a separate persistence task and ask where it should be stored.
