# Slide Prompting Contract

This document preserves the strongest prompt-construction ideas from the upstream `prepare_slide_prompts.py`, adapted for ordinary ChatGPT Chat and native ImageGen.

A slide prompt should be **self-contained enough to regenerate one slide correctly** without relying on vague conversation memory. It should separate factual content, visual intent, references, and non-negotiable constraints.

## Prompt persistence is part of execution

`prompts/slide_XX.md` is not a retrospective summary.

Create or update the full generation brief **before the ImageGen call** and use that brief as the immediate instruction for the slide-generation step.

Do not backfill a three-line note such as “generated with the approved sample and style” after the image already exists. That is not a valid saved prompt.

If a slide is retried, keep the final effective brief and append a short attempt log describing why earlier attempts were rejected.

## Slide identity guard

Every generation brief must make the target page unambiguous.

Include wording equivalent to:

> This call generates Slide N only: “<exact title>”. Do not generate the cover, another slide, a multi-slide sheet, or a generic presentation.

For Slide 1, explicitly say that it is the cover. For all other slides, explicitly say that it is **not** the cover.

A request from the user such as “generate the remaining deck” must be expanded by the orchestrator into separate single-slide generation calls. Do not pass the batch instruction itself to ImageGen as if it were a slide prompt.

## Prompt anatomy

Use the following sections when relevant:

1. **Canvas / slide identity** — 16:9 full-slide image, deck language, slide number/title, and whether a page number should be rendered.
2. **Deck goal / audience** — what the overall deck is trying to achieve and for whom.
3. **Slide role and intent** — what this page must accomplish in the narrative.
4. **Required background/context** — only the context needed to interpret this slide.
5. **Source anchors / content locks** — verbatim-locked strings and semantic-locked claims from `docs/source-grounding.md`.
6. **Primary visual anchor** — the approved sample slide; post-sample slides must explicitly inherit its visual language.
7. **Selected style brief** — the chosen detailed reference file and the deck-specific `visual_spec.md`.
8. **Exact visible text** — title and the small amount of wording that must appear exactly.
9. **Semantic relationships** — what the visual must communicate: sequence, causality, comparison, feedback, hierarchy, evidence, etc.
10. **Composition** — spatial logic and dominant visual story, described semantically rather than as a rigid template.
11. **Reference role map / strict assets** — identify each visible image by role and fidelity requirement.
12. **Text repairability** — solid local background, margin, no crossings, overlay test.
13. **Hard constraints** — requirements that must not be weakened.
14. **Negative constraints** — elements that must not appear.
15. **Acceptance criteria / QA** — what must be true for the slide to be accepted.

## Exact text discipline

Do not ask ImageGen to render long paragraphs. Prefer:

- one concise title;
- 3–6 short labels;
- at most one concise takeaway sentence;
- numeric values only when important.

Keep detailed explanation in speaker notes.

When the source contains a long technical term that must be exact, keep its local background simple and give it extra margin so later textbox overlay correction remains easy.

Never use placeholders such as `XXX`, `TBD`, fake names, fake institutions, fake citations, or invented page numbers. If exact content is not known, omit it or ask for confirmation.

## Style reference rule

For post-sample slides, explicitly say:

> Image 1 is the approved sample slide and is a **style reference only**. Match its palette, typography mood, line/illustration language, density, spacing rhythm, and finish. Do not copy its title, factual content, exact layout, scenic footer, or page-specific decorations unless this slide independently calls for them.

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

> Create one dominant left-to-right mechanism flow with a feedback loop returning from evidence to the initial gap.

over:

> Put box A at x=120, box B at x=420...

Use semantic layout constraints plus strong content hierarchy.

## Attempt log

After generation, append only a compact audit trail to the same prompt file, for example:

```markdown
## Attempt log
- Attempt 1 — rejected: wrong slide identity; generated a cover.
- Attempt 2 — rejected: `XXX` placeholder and forbidden imagery.
- Attempt 3 — accepted.
```

The attempt log supplements the prompt; it never replaces the pre-generation brief.

## Global constraints always inherited

Every slide prompt must inherit:

- native full-slide ImageGen;
- approved sample as primary visual anchor after sample approval;
- selected detailed style brief;
- deck `visual_spec.md`;
- source-grounding/content locks;
- text repairability;
- required-asset fidelity;
- no fake citations/logos/page numbers/microtext;
- no irrelevant decorative content.

See `examples/sample_slide_prompt.example.md` for the pre-sample stage, `examples/slide_prompt.example.md` for a post-sample mechanism slide, and `examples/slide_prompt_with_asset.example.md` for a strict source-figure slide.
