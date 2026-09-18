# Upstream Adaptation Audit

This repository is derived from `ningzimu/codex-ppt-skill`, but targets ordinary ChatGPT Chat rather than Codex/OpenClaw-style local execution.

The adaptation principle is:

> **Remove runtime machinery that does not apply to Chat, but preserve useful design knowledge, prompting discipline, asset-fidelity rules, style references, QA logic, and assembly behavior.**

## References

The upstream skill ships 12 detailed visual style references. Earlier Chat drafts over-compressed these into a shallow one-line catalog. That was too aggressive.

The current repository restores all 12 detailed style files under `references/` and keeps a catalog/index in `references/style-catalog.md`.

Each restored style is subject to Chat-specific global text-repairability rules.

## Script mapping

### Retained / adapted

- Upstream `assemble_ppt.py` → Chat `scripts/assemble_ppt.cjs`
  - keeps strict `slide_XX` discovery and numeric ordering;
  - preserves speaker notes;
  - accepts Chinese or English note headings;
  - validates missing/duplicate slide numbers;
  - assembles accepted full-slide images without recreating artwork.

- Upstream `prepare_slide_prompts.py` → absorbed into:
  - `docs/prompting.md`;
  - `examples/slide_prompt.example.md`;
  - `examples/slide_prompt_with_asset.example.md`.
  The useful part was the **prompt schema and input-image discipline**, not its Codex worker/job-state machinery.

- Upstream run-state/result-validation ideas → simplified into:
  - `deck_state.json`;
  - `references/deck_state.schema.json`;
  - `scripts/validate_project.cjs`.

### Intentionally not ported

- `image_gen.py` and `scripts/image_providers/*`
  - external/API image backends are intentionally excluded; this Chat skill uses native ImageGen only.

- `codex_ppt_runtime.py`
  - local virtualenv/runtime bootstrap is not part of the transient Chat workflow.

- `record_slide_dispatch.py`, `record_slide_blocker.py`, `record_slide_result.py`, `slide_job_status.py`, `slide_run_state.py`
  - these exist to coordinate Codex subagents/workers and dispatch state; this Chat edition deliberately removed that architecture.

- `remove_chroma_key.py`
  - useful for local asset compositing workflows, but not required by the default full-slide ImageGen pipeline. It can be restored later if a concrete Chat workflow needs chroma-key preprocessing.

## Documentation knowledge retained

The current docs intentionally preserve/adapt upstream guidance on:

- outline-first narrative planning;
- style extraction from visible rendered slides rather than metadata/XML;
- style system vs rigid template;
- strict user/source asset fidelity;
- sample-slide anchoring;
- per-slide self-contained prompt construction;
- edit vs regenerate QA;
- final image-based PPTX assembly.

When future upstream updates add useful design/prompt/QA knowledge, prefer absorbing that knowledge even when the corresponding Codex runtime implementation is not portable.
