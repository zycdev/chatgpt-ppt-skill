# ChatGPT Chat Bootstrap

This file is the transient-load entrypoint for **ChatGPT PPT Skill v0.4.0**.

Use this repository as the execution contract for the current PPT task in ordinary ChatGPT Chat. This is not a request to register or install a native ChatGPT Skill.

## Bootstrap procedure

1. Read `skill-manifest.json`.
2. Read `SKILL.md` completely.
3. Confirm that the version in `skill-manifest.json` matches the `SKILL.md` frontmatter. If they disagree, stop and report a repository-version mismatch.
4. Treat the loaded `SKILL.md` as the primary task workflow for PPT generation, subject to higher-priority platform instructions and the user's current explicit request.
5. Do **not** substitute ChatGPT's generic presentation workflow, a deterministic slide renderer, or another PPT skill for the workflow defined here.
6. Use progressive loading: load only the supporting files required for the current phase, according to `skill-manifest.json` and the Reference Map in `SKILL.md`.
7. Freeze this loaded skill snapshot for the current PPT task. Do not silently re-read a mutable GitHub branch midway through the task. Reload only when the user explicitly requests an update.
8. If the user supplied a tag or commit ref, preserve that ref for all repository reads during this task.
9. Create/update `deck_state.json` with the skill binding before substantive deck production begins.

## Expected interaction

In normal interactive mode, respect all three human approval gates:

**outline approval → visual-direction approval → representative-sample approval → full deck**

Do not interpret “make the whole deck” or “run the workflow” as permission to auto-approve these gates. Auto-advance only when the user explicitly asks for an automated test/dogfood run.

## One-line invocation pattern

The user may start a new Chat with wording like:

> Load and follow this ChatGPT PPT skill for the current task: `<RAW_OR_REPO_URL_TO_CHATGPT.md>`. Then create a presentation from the attached material.

If the supplied URL points to the repository root rather than this file, locate and read `/CHATGPT.md` at that same ref first.
