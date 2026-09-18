# QA and Assembly

## QA is two-layered

Perform both:

1. **slide-level QA** immediately after each generation/edit;
2. **deck-level QA** after all candidate slides exist.

A user request for “light QA” may reduce retry depth, but it does not remove factual/source checks, slide-identity checks, or the requirement to disclose known violations.

## Slide-level QA

Check every candidate slide for:

### 1. Source fidelity
- verbatim-locked names, titles, numbers, dates, metrics, formulas, and formal terms match the source/approved outline;
- semantic-locked claims have not been broadened, narrowed, or changed;
- no unsupported detail has been invented.

See `docs/source-grounding.md`.

### 2. Slide identity
- correct slide number/title/role;
- non-cover slides do not accidentally become cover pages;
- no multi-slide contact sheet or unrelated page.

### 3. Visible text
- no `XXX`, `TBD`, placeholder, pseudo-citation, or random microtext;
- critical text is readable;
- no clipping or truncation;
- no accidental page number/footer unless requested.

### 4. Visual / asset correctness
- hierarchy and density are usable;
- required source assets are present and faithful;
- no forbidden imagery;
- no graphic/text overlap or connector crossing;
- all hard/negative constraints are respected.

### 5. Text repairability
Apply `docs/text-repairability.md`, including titles and colored header bands.

### 6. Style consistency
- coherent with the approved sample;
- composition still fits the current slide role;
- sample content/layout has not been copied mechanically.

## Critical vs waivable issues

Treat these as **critical** by default:

- wrong proper name or formal title;
- wrong number/threshold/date/metric;
- wrong slide identity;
- missing required evidence/content;
- unreadable critical text;
- invented citation/logo/institution;
- strict source asset materially altered.

Critical issues must be fixed unless the user explicitly acknowledges that exact issue and asks to proceed.

Minor visual issues may be waived after the retry budget when the user has explicitly authorized proceeding. Examples include a small decorative motif, a slightly imperfect icon, or modest non-critical style drift.

## State semantics

Use:

- `accepted` — no known material issue remains;
- `accepted_with_waiver` — user explicitly authorized proceeding with recorded minor issue(s);
- `needs_repair` — localized edit is appropriate;
- `needs_regeneration` — structural/factual re-generation is required;
- `needs_user_decision` — retry budget exhausted or a tradeoff needs user choice.

Every `accepted_with_waiver` slide must record non-empty `waivers` in `deck_state.json`.

Do not mark a slide simply `accepted` while simultaneously recording a known hard-constraint violation in notes.

## Text repairability QA

Apply the overlay test to each text block:

> If a flat rectangle about 20% larger than the visible text were placed over the text, would it damage nearby graphics, borders, arrows, icons, or neighboring text?

The local background under the entire expanded overlay zone must be visually uniform. A subtle gradient in a title/header bar still fails the contract.

## Deck-level QA

After all candidate slides exist, review the deck as a sequence:

- style drift from the approved sample;
- repeated-layout monotony;
- overuse of one decorative motif/scenic footer;
- inconsistent density;
- inconsistent title placement/scale;
- accidental page numbers or footers;
- repeated hallucinated regional/cultural decoration;
- content duplication or missing narrative step;
- exact names/numbers that differ across slides.

A deck can be individually attractive page-by-page and still fail because it looks like a mechanically repeated template.

## Repair vs regenerate

Use ImageGen editing for localized defects.

Regenerate for structural problems, wrong slide identity, major source/content errors, major constraint violations, failed hierarchy, or broad text-layout failure.

Respect the retry budget in `docs/image-generation.md`.

## Assembly

Final PPTX assembly must not alter accepted artwork.

Assembly may proceed only when every slide is either:

- `accepted`; or
- `accepted_with_waiver` with a recorded user-authorized waiver.

The assembler should:

- place one accepted slide image edge-to-edge on each 16:9 slide;
- preserve slide order;
- embed speaker notes when available;
- avoid adding visible elements over the slide image.

Before completion, run the project validator when available and validate:

- slide count;
- image integrity/aspect ratio;
- prompt presence/completeness;
- waiver consistency;
- notes;
- output file readability.

The final response must disclose any accepted-with-waiver slides and the specific unresolved issues.
