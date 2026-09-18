# Transient GitHub Loading

This edition is intended for ordinary ChatGPT Chat sessions that cannot reliably invoke a user-installed Skill from the native Skill registry.

## Preferred loading path

When the GitHub connector is available, use it to read the private/public repository directly.

Bootstrap order:

1. `CHATGPT.md`
2. `skill-manifest.json`
3. `SKILL.md`

Then progressively load only the phase-specific files listed by the manifest.

## Ref pinning

For reproducible work, prefer a Git tag or commit SHA.

If the user loads from a mutable branch such as `main`, treat the initially loaded repository snapshot as frozen for the current deck.

Do not silently refresh skill files in the middle of a deck.

## Relative-path rule

All supporting files for a task must be read from the same repository ref/snapshot that supplied `CHATGPT.md` and `SKILL.md`.

Do not mix:

- `main` for one document;
- a release tag for another;
- a newer commit for a third.

## Failure behavior

Fail closed when:

- `CHATGPT.md` cannot be read;
- `skill-manifest.json` is missing;
- manifest version and `SKILL.md` version disagree;
- a required phase file listed in the manifest is missing;
- native ImageGen is unavailable for slide artwork.

Do not substitute another presentation workflow without explicit user permission.

## Reloading

Reload the skill only when the user explicitly requests an update/reload, or when starting a new deck/task that intentionally targets a different ref.
