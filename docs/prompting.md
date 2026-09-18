# Slide Prompting Contract

This document preserves the strongest prompt-construction ideas from the upstream `prepare_slide_prompts.py`, adapted for ordinary ChatGPT Chat and native ImageGen.

A slide prompt should be **self-contained enough to regenerate one slide correctly** without relying on vague conversation memory. It should separate factual content, visual intent, references, and non-negotiable constraints.

## Prompt anatomy

Use the following sections when relevant:

1. **Canvas** — 16:9 full-slide image, deck language, no slide number unless requested.
2. **Deck goal / audience** — what the overall deck is trying to achieve and for whom.
3. **Slide role and intent** — what this page must accomplish in the narrative.
4. **Required background/context** — only the context needed to interpret this slide.
5. **Primary visual anchor** — the approved sample slide; post-sample slides must explicitly inherit its visual language.
6. **Selected style brief** — the chosen detailed reference file and the deck-specific `visual_spec.md`.
7. **Exact visible text** — title and the small amount of wording that must appear exactly.
8. **Semantic relationships** — what the visual must communicate: sequence, causality, comparison, feedback, hierarchy, evidence, etc.
9. **Composition** — spatial logic and dominant visual story, described semantically rather than as a rigid template.
10. **Input images / strict assets** — identify each image by role and fidelity requirement.
11. **Text repairability** — solid local background, margin, no crossings, overlay test.
12. **Hard constraints** — requirements that must not be weakened.
13. **Negative constraints** — elements that must not appear.
14. **Success criteria / QA** — what must be true for the slide to be accepted.

## Exact text discipline

Do not ask ImageGen to render long paragraphs. Prefer:

- one concise title;
- 3–6 short labels;
- at most one concise takeaway sentence;
- numeric values only when important.

Keep detailed explanation in speaker notes.

When the source contains a long technical term that must be exact, keep its local background simple and give it extra margin so later textbox overlay correction remains easy.

## Style reference rule

For post-sample slides, explicitly say:

> Use the approved sample slide as the primary style reference. Match its palette, typography mood, line/illustration language, density, spacing rhythm, and finish. Do not copy its exact layout; adapt composition to this slide's semantic role.

The detailed style file and `visual_spec.md` remain authoritative for constraints that are not visually obvious in the sample.

## Input image handling

For each user/source image, label its role:

- **strict input asset** — preserve content; do not redraw, replace, relabel, or alter data;
- **style reference only** — inherit visual language, not content;
- **supporting visual reference** — may guide composition but is not required to appear verbatim.

For strict figures/charts/screenshots, explicitly preserve important labels, arrows, values, axes, legends, curves, colors, and relationships.

## Avoid over-specifying geometry

Do not turn prompts into pixel-level layout code. ImageGen should retain room for visual design.

Prefer:

> Create one dominant left-to-right mechanism flow with a feedback loop returning from evidence to the initial cognitive gap.

over:

> Put box A at x=120, box B at x=420...

Use semantic layout constraints plus strong content hierarchy.

## Global constraints always inherited

Every slide prompt must inherit:

- native full-slide ImageGen;
- approved sample as primary visual anchor after sample approval;
- selected detailed style brief;
- deck `visual_spec.md`;
- text repairability;
- required-asset fidelity;
- no fake citations/logos/page numbers/microtext;
- no irrelevant decorative content.

See `examples/slide_prompt.example.md` for a strong mechanism slide and `examples/slide_prompt_with_asset.example.md` for a strict source-figure slide.
