# Bootstrap prompt examples

## Preferred: GitHub connector

> @GitHub Load `zycdev/chatgpt-ppt-skill` from `main`, read `CHATGPT.md`, and follow that skill for the current PPT task. Then create a presentation from the attached material.

## Reproducible commit-pinned run

> @GitHub Load `zycdev/chatgpt-ppt-skill` at commit `<COMMIT_SHA>`, read `CHATGPT.md`, and use that exact snapshot for every skill file in this deck. Then create a presentation from the attached proposal.

## Public raw URL fallback

> Load and follow this ChatGPT PPT skill for the current task: `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/CHATGPT.md`. Then make a PPT from the attached material.

## Reload during a later task

> Reload the PPT skill from `<repo/ref>` and use the newly loaded version for a new deck. Do not modify the workflow of the deck already created under the previous snapshot.
