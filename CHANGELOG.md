# Changelog

## v0.4.1

### First cold-start dogfood hardening

This release incorporates findings from the first complete ordinary-Chat cold-start run using the GitHub transient loader and a 12-slide source-grounded research-proposal deck.

- Added `docs/source-grounding.md` with verbatim/semantic content locks and source anchors so formal names, research-content titles, numbers, metrics, formulas, and scope do not drift during slide compression.
- Made saved `outline.md` generation-ready instead of allowing titles-only outlines for source-heavy decks.
- Made `prompts/slide_XX.md` true **pre-generation execution briefs**; retrospective three-line summaries are no longer valid prompts.
- Added a strict slide-identity guard and one-slide-per-ImageGen-call rule to reduce accidental cover-page generation and batch-prompt leakage.
- Preserved selected-style avoid/rendering constraints in the normalized visual spec; intentional exceptions must be explicit user-approved overrides.
- Added explicit placeholder/invention guards for `XXX`, `TBD`, fake citations, fake institutions, unsupported numbers, and other template filler.
- Clarified that the approved sample is a **style reference only** for later pages: inherit visual grammar, not sample text, exact layout, scenic footer, or page-specific decoration.
- Added a default retry budget (initial attempt + up to two corrective attempts), then `needs_user_decision` instead of open-ended retry loops.
- Added `accepted_with_waiver` semantics so known minor exceptions are not mislabeled as clean `accepted` slides.
- Strengthened sample preflight and deck-level QA, including repeated-motif/template checks, slide identity, factual/source fidelity, and accidental page-number/footer checks.
- Tightened text repairability for titles and colored header bands: even subtle gradients behind text fail the contract.
- Extended `deck_state.json` with resolved commit, QA/retry policy, content-lock state, sample preflight, per-slide attempts/issues/waivers/source refs, and final validation state.
- Strengthened `scripts/validate_project.cjs` to reject incomplete prompt stubs, placeholders, inconsistent waivers, unresolved accepted-slide issues, invalid PNGs/aspect ratios, and missing source-grounding markers.

## v0.4.0

### Chat-only transient GitHub loading

- Repositioned the skill specifically for ordinary ChatGPT Chat.
- Added repository-root `CHATGPT.md` as the bootstrap entrypoint.
- Added `skill-manifest.json` for version verification and phase-based progressive loading.
- Added `docs/transient-loading.md` with GitHub ref, session-freeze, relative-path, and failure semantics.
- Added bootstrap prompt examples.

### Version and drift control

- Added a session-snapshot freeze rule: mutable refs such as `main` are read at task start and are not silently refreshed midway through a deck.
- Prefer tag/commit-pinned refs for reproducible work.
- Require all supporting skill files to resolve from the same repository ref.
- Added fail-closed behavior for manifest/SKILL version mismatch or missing required phase files.

### Lightweight state binding

- Extended `deck_state.json` with a small `skill_binding` object recording load mode, entrypoint, declared version, requested ref, and session-snapshot policy.
- Kept PPT orchestration itself unchanged: no workers, subagents, queues, or backend state were reintroduced.

### Core PPT behavior retained

- Preserved full-slide native ImageGen, three approval gates, single approved sample anchor, repair-safe text zones, QA/edit/regenerate, speaker notes, and image-based PPTX assembly from v0.3.

### Upstream knowledge restoration

- Restored all 12 detailed built-in visual style briefs from the upstream `codex-ppt-skill` instead of keeping only a shallow one-line catalog.
- Added upstream preview links to the style catalog and made detailed style files load on demand during style selection.
- Added `docs/prompting.md`, preserving the useful self-contained prompt anatomy and strict input-image handling from upstream `prepare_slide_prompts.py` without reintroducing Codex worker/job state.
- Replaced the weak slide prompt example with a content-rich research mechanism example and added a strict source-figure example.
- Expanded source-asset fidelity, style extraction, and sample-selection guidance from upstream docs.
- Strengthened `scripts/assemble_ppt.cjs` with contiguous slide validation and broader speaker-note heading support; added `scripts/validate_project.cjs` for lightweight final-state validation.
- Added `docs/upstream-adaptation.md` to document which upstream scripts were retained, adapted, or intentionally omitted.

## v0.3.0

### Full-slide ImageGen execution contract

- Strengthened native ImageGen/image editing as the only permitted final-slide artwork path.
- Explicitly prohibited deterministic slide-artwork recreation with PptxGenJS, python-pptx, Pillow, SVG, HTML/CSS screenshots, Canvas, or chart renderers.
- Limited programmatic tools to source inspection, asset extraction, workflow state, validation, notes, and final image-based PPTX assembly.
- Added fail-closed behavior when native ImageGen is unavailable instead of silently switching renderers/backends.

### Approval semantics

- Formalized `interactive` vs `auto_test` approval modes.
- Interactive mode requires actual user approval for outline, visual direction, and representative sample.
- Auto-test mode is allowed only when explicitly requested as end-to-end dogfood/testing and must not be reported as human approval.

### Single visual anchor

- Made the approved representative sample the single primary visual anchor for all remaining slides.
- Disallowed competing independent style anchors after sample approval unless the user explicitly changes direction.
- Required every post-sample slide prompt to inherit the visual spec's hard and negative constraints.

### Text repairability

- Added a global Text Repairability Contract.
- Required all text to sit on uniform solid-color local backgrounds with no gradients, texture, photography, illustration detail, connectors, chart marks, or decoration behind text.
- Added generous-margin and no-overlap requirements.
- Added the ~20%-larger overlay test so future editors can cover ImageGen text and replace it with editable text boxes.
- Clarified that repair-safe text does not require visible cards around every text block.

### QA

- Added explicit text-repairability QA and deck-level style-drift checks.
- Clarified edit-vs-regenerate policy for localized versus structural failures.

### Packaging completeness

- Added the `docs/`, `examples/`, `references/style-catalog.md`, and `scripts/` files referenced by `SKILL.md`/README so the package is self-contained.

## v0.2.0

- Simplified orchestration to one Chat conversation and one `deck_state.json`.
- Removed subagent/worker/dispatch concepts.
- Removed external image backend/fallback logic.
- Made native ImageGen the intended final-slide artwork backend.
- Introduced `visual_spec.md` and a primary sample-slide style anchor.
