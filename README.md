# ChatGPT PPT Skill

A presentation workflow designed specifically for **ordinary ChatGPT Chat** and inspired by `ningzimu/codex-ppt-skill`.

The recommended deployment model is **GitHub persistence + transient loading per Chat session**, rather than relying on the ChatGPT native Skill registry being exposed in ordinary Chat.

## Quick start in Chat

### Preferred: GitHub connector

When the GitHub connector is available, use the repository directly.

**English**

> @GitHub Load `zycdev/chatgpt-ppt-skill` from `main`, read `CHATGPT.md`, and follow that skill for the current PPT task. Then create a presentation from the attached material.

**中文**

> @GitHub 从 `main` 加载 `zycdev/chatgpt-ppt-skill`，读取 `CHATGPT.md`，并在当前 PPT 任务中严格按照该 Skill 执行。然后基于我提供的材料制作演示文稿。

This works for private repositories when the connector has been granted access.

For important work, pin the task to a commit SHA (or a release tag when available) instead of following a mutable `main` branch.

### Reproducible commit-pinned run

**English**

> @GitHub Load `zycdev/chatgpt-ppt-skill` at commit `<COMMIT_SHA>`, read `CHATGPT.md`, and use that exact snapshot for every skill file in this deck. Then create a presentation from the attached material.

**中文**

> @GitHub 加载 `zycdev/chatgpt-ppt-skill` 的 commit `<COMMIT_SHA>`，读取 `CHATGPT.md`，并在本次 PPT 任务中始终使用该提交对应的同一 Skill 快照，不要中途切换版本。然后基于我提供的材料制作演示文稿。

### Fallback: raw GitHub URL

For public repositories, or when connector access is unavailable, a raw URL may be used.

**English**

> Load and follow this ChatGPT PPT skill for the current task: `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/CHATGPT.md`. Then create a presentation from the attached material.

**中文**

> 请加载并在当前任务中严格遵循这个 ChatGPT PPT Skill：`https://raw.githubusercontent.com/<owner>/<repo>/<ref>/CHATGPT.md`。然后基于我提供的材料制作演示文稿。

A private repository should normally use the GitHub connector rather than a raw unauthenticated URL.

## What gets loaded

At bootstrap:

1. `CHATGPT.md`
2. `skill-manifest.json`
3. `SKILL.md`

Supporting docs are loaded progressively only when the corresponding workflow phase requires them. See `docs/transient-loading.md`.

## Core workflow

**source analysis → outline approval → visual direction approval → representative sample approval → sequential full-slide ImageGen → QA/edit/regenerate → speaker notes → image-based PPTX assembly**

Key design rules:

- native ChatGPT ImageGen/image editing only for final slide artwork;
- one lightweight `deck_state.json`;
- three explicit human approval gates in normal interactive use;
- one approved sample as the single primary visual anchor;
- global repair-safe text zones for later text-box overlay corrections;
- deterministic tooling limited to file inspection, validation, notes, and image-based PPTX assembly.

## Text repairability

Every text-bearing area must have a uniform solid-color local background and generous clear margins. No gradient, texture, image detail, arrows, connectors, icons, or chart marks may pass behind text. A future editor should be able to cover each text block with a simple flat rectangle roughly 20% larger than the visible text without damaging nearby graphics.

This does not require visible cards around every text block; clean white or flat-color open space is preferred.

## Project output

```text
DeckName/
├── source_assets/
├── prompts/
├── origin_image/slide_01.png ...
├── outline.md
├── visual_spec.md
├── speech.md
├── deck_state.json
└── DeckName.pptx
```

## Repository structure

```text
CHATGPT.md               # transient-load entrypoint
skill-manifest.json      # version + progressive-load map
SKILL.md                 # authoritative PPT workflow
README.md
CHANGELOG.md
NOTICE.md
docs/
references/
examples/
scripts/
```

## Native Skill installation

Native Skill installation is not required for this edition. If a future Chat surface exposes personal Skills reliably, the same repository may still be adapted for installation, but this repository is optimized around transient GitHub loading in ordinary Chat.

## Attribution

Inspired by: `https://github.com/ningzimu/codex-ppt-skill`

The upstream project is MIT licensed. See `NOTICE.md`.
