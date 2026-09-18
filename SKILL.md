---
name: chatgpt-ppt
version: 0.4.1
description: Create visually unified, image-based PowerPoint visual drafts in ordinary ChatGPT Chat from papers, reports, notes, outlines, web research, or user-supplied assets. Designed for transient loading from a GitHub-hosted skill repository. Uses explicit outline/style/sample approval gates, native ChatGPT ImageGen for every full-slide artwork, one approved sample as the primary visual anchor, repair-safe text zones, lightweight deck_state.json recovery, QA, speaker notes, and PPTX assembly.
---

# ChatGPT PPT

## Purpose

Create a visually strong, image-based PowerPoint **visual draft** entirely within ChatGPT Chat.

Use this skill when the user prioritizes visual quality, coherent art direction, and fast iteration, and accepts that each final slide is a full-slide image inside the PPTX. The output may later be rebuilt by another workflow into a fully editable presentation.

The core production sequence is:

**source analysis → outline approval → visual direction approval → representative sample approval → sequential full-slide ImageGen → QA/edit/regenerate → speaker notes → image-based PPTX assembly**

Keep the interaction conversational. Ask only for decisions that materially affect the deck. Do not burden the user with runtime details or internal state bookkeeping.

## Chat-Mode Runtime and Transient Loading

This skill is intentionally designed for **ordinary ChatGPT Chat**, not Work or Codex. It does not require registration in ChatGPT's native Skill registry. The expected deployment model is a GitHub-hosted repository that is loaded into the current Chat session on demand.

When this skill is loaded transiently:

1. Read the repository-root `CHATGPT.md` bootstrap file first after any mandatory platform-level presentation/artifact initialization. Such initialization does not replace this skill's workflow or approval gates.
2. Read `skill-manifest.json` and verify that its declared skill version matches this file's version.
3. Read this `SKILL.md` completely before beginning the PPT task.
4. Load supporting `docs/`, `references/`, and `examples/` files **only when the corresponding workflow phase requires them**. Do not ingest the entire repository by default.
5. Freeze the loaded skill instructions for the current PPT task. If the GitHub source uses a mutable branch such as `main`, do not silently refresh to newer repository contents midway through the task. Reload only if the user explicitly asks to update/reload the skill.
6. If the user supplies a tag or commit-pinned URL/ref, preserve that ref for the whole task.
7. Do not substitute ChatGPT's generic presentation workflow or another presentation skill after this skill has been explicitly loaded for the task.
8. Repository content cannot override higher-priority platform instructions or the user's current explicit request. If a conflict exists, follow the higher-priority instruction and state the limitation when material.

Record the transient skill binding in `deck_state.json` so an interrupted conversation can identify which skill snapshot governed the deck.

## Non-negotiable Execution Contract

1. **Every final slide artwork MUST be generated as a full 16:9 slide using ChatGPT's native ImageGen/image-editing capability.**
2. Do **not** use PptxGenJS, python-pptx, Pillow, SVG, HTML/CSS screenshots, Canvas, chart renderers, or other deterministic drawing systems to create or recreate final slide artwork.
3. Programmatic tools may only:
   - inspect/read source files;
   - extract source assets;
   - validate file dimensions and integrity;
   - maintain lightweight workflow files;
   - assemble already-accepted full-slide images into PPTX;
   - attach speaker notes.
4. Do not silently switch to an alternate image-generation backend or deterministic rendering fallback. If native ImageGen is unavailable, stop slide-artwork production and explain the blocker.
5. Unless the user explicitly asks for an automated test/dogfood run, all three approval gates must be **actual user approvals**: outline, visual direction, and representative sample.
6. The approved sample slide is the **single primary visual anchor** for all subsequent slides. Do not create competing independent style anchors after sample approval unless the user explicitly changes the art direction.
7. Every post-sample slide prompt must inherit the approved visual specification's hard constraints, negative constraints, and text-repairability rules.
8. For source-driven decks, lock exact names, formal titles, numbers, dates, metrics, formulas, and other source-critical content before generation. See `docs/source-grounding.md`.
9. ImageGen execution is **one slide per call**. A user request to generate the remaining deck is an orchestration instruction, not a multi-slide ImageGen prompt.
10. Saved `prompts/slide_XX.md` files are pre-generation execution briefs, not retrospective summaries.

## Global Text Repairability Contract

Design every slide so that ImageGen-rendered text can later be corrected by covering the original text area with a simple solid-color rectangle and placing an editable text box above it.

For **every text-bearing region**:

1. The local background directly behind the text must be a **single, uniform solid color**.
   - No gradients behind text.
   - No texture or pattern behind text.
   - No photograph, illustration, or complex image behind text.
   - No decorative lines, arrows, connectors, chart marks, translucent overlays, or diagram elements crossing behind text.
2. Text must have **generous clear space** around it.
   - Keep obvious internal padding between text and the boundary of its local background region.
   - Keep icons, arrows, connectors, charts, and decorative elements clearly separated from the text.
   - Text and graphical elements must never overlap or intersect.
3. Each text block should occupy a visually clean, independently replaceable region.
   - Apply the **overlay test**: imagine covering the text with a solid rectangle roughly 20% larger than the visible text bounds in every direction. That rectangle should not damage any important nearby graphic, border, connector, icon, or neighboring text block.
4. These rules apply to titles, subtitles, body text, diagram labels, callouts, numeric indicators, captions, annotations, and small tags.
5. A solid text background does **not** imply that every text block must sit inside a visible card. Clean white or flat-color open space is preferred when it suits the composition.
6. Gradients, textures, illustrations, photography, complex diagrams, and decorative treatments remain allowed elsewhere on the slide, provided they stay outside repair-safe text zones.

Treat text repairability as a global hard constraint, not an optional stylistic preference.

## Hard Constraints

1. Follow the approval gates in `docs/workflow-gates.md`.
2. Do not generate the full deck before the representative sample is approved.
3. Every final slide image must come from native ImageGen/image editing.
4. Preserve one coherent visual identity while varying composition by slide role. Do not force a repeated template layout.
5. Treat user-required figures, screenshots, charts, diagrams, and logos as strict assets. Preserve their semantic content faithfully.
6. After sample approval, keep the sample, visual specification, aspect ratio, density rules, hard constraints, and negative constraints stable unless the user explicitly changes direction.
7. Enforce the Global Text Repairability Contract on every slide.
8. QA every slide for factual accuracy, text correctness, legibility, truncation, hierarchy, asset fidelity, style consistency, repairability, and constraint violations.
9. Use ImageGen editing for localized failures; regenerate when the overall composition or content is materially wrong.
10. Do not declare completion until all expected slide images are accepted and the final PPTX has been created and validated.

## Visible Workflow

For non-trivial decks, keep the user oriented with a concise phase-level checklist:

1. Source and outline
2. Style and sample
3. Full-slide generation
4. QA and repairs
5. Speaker notes and PPTX assembly

Do not expose low-level file operations unless the user asks.

## Project Structure

Use this structure for a deck project:

```text
{deck_name}/
├── source_assets/
├── prompts/
├── origin_image/
│   ├── slide_01.png
│   ├── slide_02.png
│   └── ...
├── outline.md
├── visual_spec.md
├── speech.md
├── deck_state.json
└── {deck_name}.pptx
```

`deck_state.json` is the single workflow state file. See `references/deck_state.schema.json` and `examples/deck_state.example.json`.

## Phase 1 — Understand the source and draft the outline

Read `docs/workflow-gates.md`, `docs/source-grounding.md`, `docs/outline-style-sample.md`, and `docs/assets-and-files.md`.

Determine from the user's request and supplied materials:

- presentation goal;
- audience;
- language;
- target slide count (default 8–12 if unspecified and appropriate);
- content that must be included or excluded;
- required source assets;
- brand, tone, institutional, regional, or cultural constraints.

Draft a slide-by-slide narrative rather than transcribing the source document. Each slide should have:

- slide number;
- role;
- proposed title;
- 2–4 core messages;
- locked text / exact names / numbers that must not drift;
- source anchors for important claims when source material exists;
- intended visual structure;
- required source assets, if any.

Present the outline to the user and wait for approval.

After approval:

- save it as `outline.md`;
- before first state creation, read `references/deck_state.schema.json` and `examples/deck_state.example.json`;
- initialize/update `deck_state.json`;
- set `outline.content_lock_applied = true` for source-driven decks only after the saved outline contains the required locks/source anchors;
- mark `outline.approved = true`.

## Phase 2 — Define and approve the visual direction

Read `references/style-catalog.md`, `docs/outline-style-sample.md`, `docs/text-repairability.md`, and `docs/style-reuse.md`. If built-in styles are being considered, load the full detailed `references/<style>.md` files for the 2–3 shortlisted candidates before presenting them; after selection, keep the chosen detailed style reference as an input to `visual_spec.md` and later generation.

The visual direction may come from:

1. a built-in style direction from `references/style-catalog.md`;
2. user-supplied reference images/PPT/PDF/screenshots;
3. a previously saved style asset explicitly available in the current environment.

If no reference is supplied, offer 2–3 suitable directions and explain them concretely. Do not overwhelm the user with the entire style catalog.

Create `visual_spec.md` containing at least:

- style source and style intent;
- palette;
- typography character;
- title/body hierarchy;
- spacing and density;
- diagram/illustration language;
- chart/figure treatment;
- recurring motifs and an explicit **motif reuse rule** so sample-specific scenery/decor does not become mandatory furniture on every slide;
- source-asset treatment;
- **text-repairability rules**;
- **hard constraints**;
- **negative constraints / avoid-list**;
- **constraint inheritance / overrides** — retain relevant restrictions from the selected detailed style; record every intentional user-approved exception in `deck_state.json.style.constraint_overrides` instead of silently dropping it.

The hard and negative constraints must be written explicitly enough to be copied into every slide-generation prompt without weakening or paraphrasing them away. The selected detailed style's explicit `avoid`/rendering restrictions remain in force unless the user explicitly overrides them and that override is recorded.

Wait for visual-direction approval and record it in `deck_state.json`.

## Phase 3 — Generate and approve one representative sample

Choose a content-rich slide that stress-tests the intended visual system. Prefer a middle slide over a title slide when possible. Use `examples/sample_slide_prompt.example.md` as the quality bar for the sample-slide prompt structure; unlike post-sample prompts, it must not pretend that an approved sample anchor already exists.

Generate exactly one 16:9 sample using native ImageGen/image editing.

The sample must obey:

- the approved outline content for that slide;
- `visual_spec.md`;
- required source assets;
- concise, readable slide text;
- all hard constraints and negative constraints;
- the Global Text Repairability Contract;
- no invented citations, logos, page numbers, or decorative microtext.

Run a **sample preflight** before showing it to the user. Check exact locked text/source fidelity, slide identity, placeholders/inventions, page numbers, forbidden imagery, text repairability including title/header bands, and obvious layout failures. If it violates a hard constraint, repair/regenerate before presenting it for approval. Record `sample.preflight_passed`, attempt count, issues, and any explicit waiver in `deck_state.json`.

If the user requests changes, edit/regenerate until approved.

When approved:

- record its slide number and path in `deck_state.json`;
- promote it to the corresponding `origin_image/slide_XX.png` if needed;
- mark that slide `accepted`;
- treat it as the **single primary visual anchor** for the remaining deck.

Do not create a second independent style anchor. Additional generated assets must visually inherit the approved sample unless the user explicitly changes the art direction.

## Phase 4 — Generate the remaining slides sequentially

Read `docs/source-grounding.md`, `docs/image-generation.md`, `docs/prompting.md`, and `docs/text-repairability.md`. Use `examples/slide_prompt.example.md` as the quality bar for a mechanism/concept slide and `examples/slide_prompt_with_asset.example.md` when a strict source figure is involved.

For each remaining slide:

1. create/update a **complete pre-generation** `prompts/slide_XX.md` execution brief;
2. confirm slide identity, source/content locks, sample/reference roles, and hard constraints;
3. make exactly one native ImageGen/image-editing call for that slide;
4. inspect the result immediately;
5. classify it in `deck_state.json` as `accepted`, `accepted_with_waiver`, `needs_repair`, `needs_regeneration`, or `needs_user_decision`;
6. follow the retry budget in `docs/image-generation.md`; after the default initial attempt plus up to two corrective attempts, stop looping and ask for user direction when the same material failure persists;
7. append a compact attempt log to the prompt file; do not replace the original generation brief.

Each slide prompt must follow the self-contained structure in `docs/prompting.md`, including canvas/slide identity, deck goal/audience, slide role/intent, only the necessary background context, source anchors/content locks, approved sample anchor, selected detailed style reference, exact visible text, semantic relationships, composition, input-image roles/fidelity, text repairability, hard constraints, negative constraints, and acceptance criteria. For post-sample slides, explicitly mark the sample as **style reference only** and forbid copying its page-specific text, exact layout, or scenic footer.

### Style consistency priority

For every post-sample slide, use this priority order:

1. approved sample image;
2. `visual_spec.md`;
3. deck-wide constraints in `deck_state.json`;
4. slide-specific composition guidance.

The approved sample is authoritative for visual language. `visual_spec.md` is authoritative for explicit constraints that may not be visually obvious.

## Phase 5 — QA and repair

Read `docs/source-grounding.md`, `docs/qa-and-assembly.md`, and `docs/text-repairability.md`.

Inspect every slide for:

- correct title, labels, names, facts, and numbers;
- missing or hallucinated content;
- malformed, misspelled, or unreadable text;
- clipping or truncation;
- hierarchy and density;
- palette, illustration, and diagram consistency;
- faithful use of required source assets;
- accidental page numbers, watermarks, logos, or irrelevant decoration;
- compliance with hard and negative constraints;
- **repair-safe text backgrounds and sufficient margins**;
- **no text/graphic overlap or connector crossings**;
- alignment with the approved outline.

### Repair and acceptance policy

- Localized visual defect → use ImageGen editing first.
- Wrong slide identity, source/factual error, failed hierarchy, major constraint violation, or broadly unusable text layout → regenerate the slide.
- A generic instruction such as “skip minor issues” may reduce retry depth for minor visual defects, but does **not** waive wrong names, numbers, formal terms, source meaning, missing required content, unreadable critical text, or wrong slide identity.
- If the user explicitly accepts a specific remaining minor defect, record it in `waivers` and use `accepted_with_waiver`, not plain `accepted`.
- Run a deck-level QA pass for repeated-layout monotony, overused scenic motifs, style drift, accidental page numbers/footers, content duplication, and cross-slide name/number inconsistencies.

Do not proceed to final assembly while any expected slide is outside `accepted` / `accepted_with_waiver`.

## Phase 6 — Speaker notes and PPTX assembly

Write `speech.md` after visual content stabilizes.

Use headings exactly like:

```markdown
## Slide 1: Title
Speaker notes here.

## Slide 2: Title
Speaker notes here.
```

Speaker notes should carry nuance, transitions, interpretation, and details intentionally omitted from the visual slide. They should not merely repeat visible text.

Assemble the final deck using a presentation capability that can place accepted full-slide images and preserve notes **without altering the artwork**. Otherwise use:

```bash
node scripts/assemble_ppt.cjs --project /path/to/{deck_name} --output /path/to/{deck_name}/{deck_name}.pptx
```

Before assembly, run the project validator when the runtime can execute it. It checks state consistency, final PNG integrity/aspect ratio, prompt completeness, placeholders, source-grounding markers, and waiver semantics:

```bash
node scripts/validate_project.cjs --project /path/to/{deck_name}
```

Then validate:

- the PPTX exists and opens;
- slide count matches accepted slide images;
- slide order is correct;
- each slide image fills the 16:9 canvas without unintended crop;
- speaker notes are embedded when requested/defaulted.

Update `deck_state.json` with final output information.

## Lightweight State Model

`deck_state.json` exists only to answer:

- which transient skill snapshot governs this deck;
- what deck is being built;
- whether this is an interactive run or explicitly requested automated test run;
- which gates have been approved;
- which sample is the single primary visual anchor;
- what state each slide is in, including attempts/issues/waivers/source refs;
- whether source grounding/content locks were applied;
- the requested GitHub ref and resolved commit snapshot;
- where the final output is.

Do not use additional queue, dispatch, worker, backend, or per-tool state files.

If a conversation resumes after interruption, inspect:

1. `deck_state.json`;
2. `outline.md`;
3. `visual_spec.md`;
4. existing `origin_image/` files.

Continue from the first incomplete phase. Do not repeat approved decisions unless artifacts are missing or contradictory.

## Approval Semantics

`deck_state.json.deck.approval_mode` must be one of:

- `interactive` — default; `approved=true` means the user actually approved the gate in chat.
- `auto_test` — only when the user explicitly requests an automated end-to-end test/dogfood run; the workflow may auto-advance gates, but must not represent those gates as human approvals in its final report.

Never use `auto_test` merely to save time.

## Style Reuse Policy

This skill itself contains only static built-in style directions.

Do not automatically create or mutate a persistent personal style library. Reusable user style assets may be consumed when explicitly available, but long-term persistence is outside the core workflow.

See `docs/style-reuse.md`.

## Output Contract

A completed deck should contain:

- approved `outline.md`;
- approved `visual_spec.md`;
- final `origin_image/slide_XX.png` images;
- complete pre-generation `prompts/slide_XX.md` briefs with attempt logs;
- `deck_state.json` with every expected slide marked `accepted` or explicitly `accepted_with_waiver`;
- `speech.md` when speaker notes are included;
- final `.pptx`.

The final response should state:

- slide count;
- that the deck is image-based and generated as full-slide ImageGen artwork;
- whether speaker notes were embedded;
- whether approvals were interactive or auto-test;
- any unresolved limitations, including every accepted-with-waiver slide and its explicit waiver;
- links to the final PPTX and, when useful, the project ZIP.

## Reference Map

- `CHATGPT.md` — transient-load bootstrap entrypoint for ordinary Chat.
- `skill-manifest.json` — machine-readable version and progressive-loading map.
- `docs/transient-loading.md` — GitHub loading, session-freeze, ref-pinning, and reload behavior.
- `docs/workflow-gates.md` — approval points and resume behavior.
- `docs/source-grounding.md` — verbatim/semantic content locks, source anchors, and source-fidelity QA.
- `docs/outline-style-sample.md` — generation-ready narrative outline, style choice, sample selection/preflight.
- `docs/image-generation.md` — full-slide native ImageGen, sample anchoring, prompt inheritance, repair strategy.
- `docs/prompting.md` — self-contained slide-prompt anatomy adapted from upstream prompt-generation logic.
- `docs/upstream-adaptation.md` — audit of what was retained, adapted, or intentionally removed from the upstream Codex skill.
- `docs/text-repairability.md` — global solid-background, margin, and overlay-safe text-zone rules.
- `docs/assets-and-files.md` — source assets and fidelity rules.
- `docs/qa-and-assembly.md` — QA, notes, and image-based PPTX assembly.
- `docs/style-reuse.md` — style-source and reuse policy.
- `references/style-catalog.md` — index of the restored detailed built-in style library.
- `references/style-preview-gallery.md` — optional human-facing gallery of upstream style previews; do not load by default.
- `references/*.md` (named style files) — full built-in style briefs inherited/adapted from upstream; load selected candidates on demand.
- `references/deck_state.schema.json` — single-state-file schema.
- `examples/deck_state.example.json` — example state.
- `examples/visual_spec.example.md` — required visual-spec structure.
- `examples/sample_slide_prompt.example.md` — high-quality representative-sample prompt used before any sample anchor exists.
- `examples/slide_prompt.example.md` — high-quality post-sample mechanism-slide prompt.
- `examples/slide_prompt_with_asset.example.md` — strict source-asset prompt example.
- `examples/upstream-showcase.md` — optional documentation gallery for full-slide generation, strict source-figure integration, and single-slide revision.
- `scripts/validate_project.cjs` — lightweight final-state/image validation.
- `scripts/assemble_ppt.cjs` — image-based PPTX assembly with notes.
