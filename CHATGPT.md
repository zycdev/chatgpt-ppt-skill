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

If the ChatGPT platform requires an initial presentation/artifact initialization step before repository access, perform that required platform step first. Then continue this bootstrap immediately. That platform initialization does not replace this repository workflow and does not authorize skipping its approval gates.

1. Read `skill-manifest.json`.
2. Read `SKILL.md` completely.
3. Confirm that the version in `skill-manifest.json` matches the `SKILL.md` frontmatter. If they disagree, stop and report a repository-version mismatch.
4. Treat the loaded `SKILL.md` as the primary task workflow for PPT generation, subject to higher-priority platform instructions and the user's current explicit request.
5. Do **not** substitute ChatGPT's generic presentation workflow, a deterministic slide renderer, or another PPT skill for the workflow defined here.
6. Use progressive loading: load only the supporting files required for the current phase, according to `skill-manifest.json` and the Reference Map in `SKILL.md`.
7. Freeze this loaded skill snapshot for the current PPT task. Do not silently re-read a mutable GitHub branch midway through the task. Reload only when the user explicitly requests an update.
8. If the user supplied a tag or commit ref, preserve that ref for all repository reads during this task.
9. If the user supplied `main` or another mutable branch, keep that branch name in `skill_binding.requested_ref`, resolve the current commit into `skill_binding.resolved_commit` when practical, and treat that commit snapshot as frozen for the task. Do not concatenate branch and SHA into one ambiguous field.
10. Before first creating `deck_state.json`, load the manifest's `state_validation` resources. Then create/update `deck_state.json` with the skill binding before substantive deck production begins.

## Expected interaction

In normal interactive mode, respect all three human approval gates:

**outline approval → visual-direction approval → representative-sample approval → full deck**

Do not interpret “make the whole deck” or “run the workflow” as permission to auto-approve these gates. Auto-advance only when the user explicitly asks for an automated test/dogfood run.

## One-line invocation patterns

### GitHub connector

**English**

> @GitHub Load `zycdev/chatgpt-ppt-skill` from `main`, read `CHATGPT.md`, and follow that skill for the current PPT task. Then create a presentation from the attached material.

**中文**

> @GitHub 从 `main` 加载 `zycdev/chatgpt-ppt-skill`，读取 `CHATGPT.md`，并在当前 PPT 任务中严格按照该 Skill 执行。然后基于我提供的材料制作演示文稿。

### Commit-pinned GitHub connector

**English**

> @GitHub Load `zycdev/chatgpt-ppt-skill` at commit `<COMMIT_SHA>`, read `CHATGPT.md`, and use that exact snapshot for every skill file in this deck. Then create a presentation from the attached material.

**中文**

> @GitHub 加载 `zycdev/chatgpt-ppt-skill` 的 commit `<COMMIT_SHA>`，读取 `CHATGPT.md`，并在本次 PPT 任务中始终使用该提交对应的同一 Skill 快照，不要中途切换版本。然后基于我提供的材料制作演示文稿。

### Public raw URL fallback

**English**

> Load and follow this ChatGPT PPT skill for the current task: `<RAW_URL_TO_CHATGPT.md>`. Then create a presentation from the attached material.

**中文**

> 请加载并在当前任务中严格遵循这个 ChatGPT PPT Skill：`<RAW_URL_TO_CHATGPT.md>`。然后基于我提供的材料制作演示文稿。

If the supplied URL points to the repository root rather than this file, locate and read `/CHATGPT.md` at that same ref first.
