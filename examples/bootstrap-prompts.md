# Bootstrap prompt examples

## Preferred: GitHub connector

### English

> @GitHub Load `zycdev/chatgpt-ppt-skill` from `main`, read `CHATGPT.md`, and follow that skill for the current PPT task. Then create a presentation from the attached material.

### 中文

> @GitHub 从 `main` 加载 `zycdev/chatgpt-ppt-skill`，读取 `CHATGPT.md`，并在当前 PPT 任务中严格按照该 Skill 执行。然后基于我提供的材料制作演示文稿。

## Reproducible commit-pinned run

### English

> @GitHub Load `zycdev/chatgpt-ppt-skill` at commit `<COMMIT_SHA>`, read `CHATGPT.md`, and use that exact snapshot for every skill file in this deck. Then create a presentation from the attached proposal.

### 中文

> @GitHub 加载 `zycdev/chatgpt-ppt-skill` 的 commit `<COMMIT_SHA>`，读取 `CHATGPT.md`，并在本次 PPT 任务中始终使用该提交对应的同一 Skill 快照，不要中途切换版本。然后基于我提供的申报书制作演示文稿。

## Public raw URL fallback

### English

> Load and follow this ChatGPT PPT skill for the current task: `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/CHATGPT.md`. Then make a PPT from the attached material.

### 中文

> 请加载并在当前任务中严格遵循这个 ChatGPT PPT Skill：`https://raw.githubusercontent.com/<owner>/<repo>/<ref>/CHATGPT.md`。然后基于我提供的材料制作 PPT。

## Reload during a later task

### English

> Reload the PPT skill from `<repo/ref>` and use the newly loaded version for a new deck. Do not modify the workflow of the deck already created under the previous snapshot.

### 中文

> 请从 `<repo/ref>` 重新加载 PPT Skill，并仅将新加载的版本用于新的演示文稿任务。不要改变此前已经按照旧 Skill 快照创建的演示文稿流程。
