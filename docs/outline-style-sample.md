# Outline, Style, and Sample

This document preserves the useful planning and style-selection discipline from the upstream `codex-ppt-skill`, adapted for ordinary ChatGPT Chat.

## Outline

Transform source material into a presentation narrative rather than copying the document structure.

For source-driven decks, read `docs/source-grounding.md` before drafting the outline.

For each slide define:

- slide number;
- slide role and intent;
- proposed title;
- 2–4 core messages;
- **locked text / exact names / numbers that must not drift**;
- source anchors for important claims when source material exists;
- intended visual structure;
- required source assets, if any, with role and fidelity level.

Useful slide roles include cover, context/problem, research question, concept explanation, process, comparison, timeline, architecture, evidence/results, case study, summary, and closing.

### Saved outline must be generation-ready

The user-facing outline can be compact, but the saved approved `outline.md` must contain enough information to generate and audit every slide.

Do **not** reduce a source-heavy deck to a titles-only outline.

A useful slide entry looks like:

```markdown
### Slide N — <title>
Role / intent: …
Core messages:
- …
Locked text:
- [verbatim] …
- [semantic] …
Source anchors:
- …
Visual structure:
- …
Required assets:
- …
```

If a slide requires a source image, record that mapping clearly enough for the user to verify it before generation.

Present the outline to the user and wait for approval.

## Visual direction

### When the user already supplied a style reference

Do not force a built-in style choice.

For an image reference, inspect the image itself.

For a PDF/PPT/PPTX style reference, inspect/render representative visible pages/slides. Do not infer the visual system from file structure, XML, metadata, object hierarchy, or text alone.

Inspect enough pages to capture the shared system. Prefer, when available:

- a cover/opener;
- an ordinary content slide;
- a process/diagram/data slide;
- a summary/closing slide.

Separate **style reuse** from **content reuse**. Unless explicitly requested, extract palette, typography mood, spacing, density, layout logic, diagram language, image treatment, and recurring motifs without carrying over the original deck's topic, names, data, logos, or wording.

### When no style reference is supplied

Read `references/style-catalog.md`.

Shortlist only 2–3 styles that fit the audience, topic, evidence density, and communication goal. Before presenting the shortlist, read the full detailed `references/<style>.md` files for those candidates.

Each option should be described concretely in terms of:

- palette;
- layout system;
- typography direction;
- illustration/image treatment;
- decorative elements;
- density and whitespace.

Recommend one and explain why.

After the user chooses, load the selected detailed style reference and create `visual_spec.md`.

## Visual spec

The approved `visual_spec.md` should explicitly capture:

- style source and selected reference file;
- style intent;
- palette and semantic color rules;
- typography character and hierarchy;
- spacing, density, and whitespace;
- diagram/illustration language;
- chart/figure/image treatment;
- recurring motifs;
- **motif reuse rule** — recurring scenery/icons/decor should be selective, not mandatory furniture on most slides;
- source-asset treatment;
- text repairability;
- hard constraints;
- negative constraints.

Treat the selected detailed reference as a **style system**, not a rigid template. Keep visual identity stable while varying composition according to slide role.

A sample may establish a scenic footer, robot icon, colored header bar, or other motif, but later pages should inherit the visual grammar rather than mechanically repeating that motif on every page.

## Representative sample

Choose a content-rich middle slide that stress-tests the intended visual system.

Avoid using a title slide as the default sample because it does not sufficiently test:

- body text;
- diagrams;
- labels;
- evidence density;
- source-asset integration;
- text repairability.

Generate exactly one sample after outline and visual direction approval.

Save it directly as the intended final page, e.g. `origin_image/slide_04.png`, rather than creating a disposable sample filename.

### Sample preflight before showing the user

Before presenting the sample for approval, inspect it against the same hard constraints that will govern the deck:

- exact locked text and factual content;
- no invented names/numbers/citations;
- correct slide identity;
- no page number unless explicitly requested;
- text-repairability, including title/header bands;
- no prohibited imagery;
- no obvious layout failure.

If the sample fails a hard constraint, repair/regenerate it before asking the user to approve the visual direction.

Style approval does not silently convert a known hard-constraint failure into an accepted exception.

Ask the user to judge:

- overall visual identity;
- typography and text quality;
- density and whitespace;
- diagram/illustration language;
- text repairability;
- whether the sample feels appropriate for the audience.

If revisions are requested, revise/regenerate the same sample page until approved.

Once approved, the sample becomes the single primary visual anchor for the rest of the deck. Later pages should inherit its palette, typography mood, density, spacing rhythm, illustration/diagram style, and finish **without copying its exact layout, content, or decorative footer mechanically**.
