# Full-slide Image Generation

## Required generation mode

Every final slide artwork is a complete 16:9 slide produced with ChatGPT native ImageGen/image editing.

Do not use deterministic rendering systems to create the slide artwork itself.

## Sample anchoring

After the representative sample is approved, use it as the single primary visual anchor for all subsequent slides.

Post-sample prompts must preserve:

- visual language;
- palette;
- spacing rhythm;
- illustration/diagram style;
- density;
- text hierarchy;
- repair-safe text zones;
- visual-spec hard constraints;
- visual-spec negative constraints.

Do not create independent style anchors for later slides unless the user explicitly changes the art direction.

## Prompt inheritance

Each slide prompt should include:

1. slide role/title;
2. exact factual content to preserve;
3. composition guidance;
4. required source assets;
5. explicit reference to the approved sample's visual language;
6. 16:9 full-slide requirement;
7. text density and readability guidance;
8. text-repairability constraints;
9. hard constraints;
10. negative constraints.

## Repair strategy

Use ImageGen editing for localized failures such as:

- one malformed label;
- one misplaced icon;
- small decorative clutter;
- minor text spacing issue.

Regenerate when:

- hierarchy is wrong;
- the overall composition is weak;
- text layout is broadly unusable;
- required content is missing;
- a hard/negative constraint is materially violated;
- the slide drifts from the approved sample.

Never silently fall back to an alternate image API or deterministic renderer.
