# ChatGPT Chat Bootstrap

This file is the transient-load entrypoint for **ChatGPT PPT Skill**.

Use this repository as the execution contract for the current PPT task in ordinary ChatGPT Chat. This is not a request to register or install a native ChatGPT Skill.

## Preferred source

Prefer the **GitHub connector** when it is available, especially for private repositories.

When the user invokes the skill through a repository name such as `zycdev/chatgpt-ppt-skill`:

1. read this file from the requested repository/ref;
2. preserve that same repository/ref for all subsequent skill reads;
3. do not replace connector reads with unauthenticated raw URLs for private repositories.

Raw GitHub URLs are an acceptable fallback for public repositories.

## Bootstrap procedure

1. Read `skill-manifest.json`.
2. Read `SKILL.md` completely.
3. Confirm that the version in `skill-manifest.json` matches the `SKILL.md` frontmatter. If they disagree, stop and report a repository-version mismatch.
4. Treat the loaded `SKILL.md` as the primary task workflow for PPT generation, subject to higher-priority platform instructions and the user's current explicit request.
5. Do **not** substitute ChatGPT's generic presentation workflow, a deterministic slide renderer, or another PPT skill for the workflow defined here.
6. Use progressive loading: load only the supporting files required for the current phase, according to `skill-manifest.json` and the Reference Map in `SKILL.md`.
7. Freeze this loaded skill snapshot for the current PPT task. Do not silently re-read a mutable GitHub branch midway through the task. Reload only when the user explicitly requests an update.
8. If the user supplied a tag or commit ref, preserve that ref for all repository reads during this task.
9. If the user supplied `main` or another mutable branch, resolve/record the current commit when practical and treat that snapshot as frozen for the task.
10. Create/update `deck_state.json` with the skill binding before substantive deck production begins.

## Expected interaction

In normal interactive mode, respect all three human approval gates:

**outline approval → visual-direction approval → representative-sample approval → full deck**

Do not interpret “make the whole deck” or “run the workflow” as permission to auto-approve these gates. Auto-advance only when the user explicitly asks for an automated test/dogfood run.

## One-line invocation patterns

### GitHub connector

> @GitHub Load `zycdev/chatgpt-ppt-skill` from `main`, read `CHATGPT.md`, and follow that skill for the current PPT task. Then create a presentation from the attached material.

### Public raw URL fallback

> Load and follow this ChatGPT PPT skill for the current task: `<RAW_URL_TO_CHATGPT.md>`. Then create a presentation from the attached material.

If the supplied URL points to the repository root rather than this file, locate and read `/CHATGPT.md` at that same ref first.
