# Full-slide Image Generation

## Required generation mode

Every final slide artwork is a complete 16:9 slide produced with ChatGPT native ImageGen/image editing.

Do not use deterministic rendering systems to create the slide artwork itself.

## One slide per call

ImageGen calls are atomic at the slide level.

Even when the user says “generate the remaining deck,” the orchestrator must iterate through slides one by one. Each call targets exactly one slide and must carry the slide-identity guard from `docs/prompting.md`.

Do not ask one ImageGen call to create multiple pages, the whole deck, or “the remaining slides.”

## Sample anchoring

After the representative sample is approved, use it as the single primary visual anchor for all subsequent slides.

The approved sample must be **visually available to the image-generation step**, not merely mentioned by filename. If the task has resumed and the sample exists only as a project file, inspect/open that image in the current conversation/runtime before generating dependent slides.

Treat the sample as a **style reference only** unless it is also intentionally a source asset.

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

Do not copy the sample's title, facts, exact layout, or recurring decorative scenery into every later page. Visual consistency means shared grammar, not a repeated template.

## Pre-call checklist

Before each generation call:

1. save the complete `prompts/slide_XX.md` generation brief;
2. confirm the slide number/title and that this call generates that slide only;
3. load/check the slide's content locks and source anchors;
4. ensure the approved sample is visually available for post-sample slides;
5. ensure required source images are visually available;
6. label reference-image roles explicitly;
7. restate hard and negative constraints that are easy for ImageGen to violate, especially page numbers, placeholders, forbidden imagery, and text-repairability.

## Placeholder and invention guard

Reject any result containing:

- `XXX`, `TBD`, `Lorem ipsum`, template filler, pseudo-citations, or invented footer text;
- an invented institution, person, project name, metric, number, or source label;
- the wrong slide identity;
- a cover layout on a non-cover slide.

These are generation failures, not acceptable minor imperfections.

## Retry budget

Avoid infinite repair loops.

Default budget per slide:

- initial generation;
- up to **two** corrective attempts, using edit for localized defects and regeneration for structural defects.

If the same material failure persists after the budget:

- set the slide to `needs_user_decision`;
- explain the specific unresolved issue;
- do not silently keep retrying.

If the user explicitly authorizes proceeding despite a persistent **minor visual** issue, record the issue/waiver and mark the slide `accepted_with_waiver`.

A general request to “skip minor issues” does not waive factual/source errors, wrong slide identity, missing required content, or unreadable critical text.

## Repair strategy

Use ImageGen editing for localized failures such as:

- one malformed non-critical label;
- one misplaced icon;
- small decorative clutter;
- a local forbidden motif;
- minor text spacing issue.

Regenerate when:

- the slide identity is wrong;
- hierarchy is wrong;
- the overall composition is weak;
- text layout is broadly unusable;
- required content is missing;
- a critical content lock is wrong;
- a hard/negative constraint is materially violated;
- the slide drifts strongly from the approved sample.

## Motif repetition check

Before accepting a page, compare it with neighboring slides.

Do not mechanically repeat:

- the same scenic footer;
- the same robot hero;
- the same card grid;
- the same regional decoration;
- the same exact diagram skeleton.

Recurring motifs should strengthen deck identity selectively, not turn the deck into a single copied template.

Never silently fall back to an alternate image API or deterministic renderer.
