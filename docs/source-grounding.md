# Source Grounding and Content Locks

Use this document for decks based on user files, reports, papers, proposals, spreadsheets, or other source material.

The goal is to make the deck concise **without silently changing the source**.

## Three lock levels

Classify important slide content before generation:

1. **verbatim_locked**
   - project / paper / product titles;
   - institution, laboratory, person, program, policy, dataset, or method names;
   - formal research-content names;
   - dates, quantities, thresholds, percentages, counts, equations, symbols, and metric names;
   - quotations or wording the user explicitly requires.

   These must appear exactly as approved. Do not reorder characters in proper names, shorten formal names into a different term, or invent missing values.

2. **semantic_locked**
   - scientific claims;
   - causal or procedural relationships;
   - method scope;
   - what an algorithm/configuration can and cannot modify;
   - evaluation meaning and applicability conditions.

   These may be compressed for a slide, but the compression must not broaden, narrow, reverse, or otherwise change the source meaning.

3. **free_summary**
   - transitions;
   - rhetorical framing;
   - non-critical connective wording.

   These may be rewritten freely as long as they do not introduce unsupported facts.

## Source anchors in the outline

For a source-driven deck, each slide entry in `outline.md` should record the source basis for its important content.

Prefer section/page anchors when available, for example:

```markdown
### Slide 6 — 研究内容一：……
Role / intent: …
Core messages:
- …
Locked text:
- [verbatim] 新疆民族语音语言信息处理重点实验室
- [verbatim] 历史能力保持率 ≥ 90%
Source anchors:
- 申报书 §3.4, pp. 53–63
- 申报书 §3.6, pp. 83–84
Visual structure:
- …
Required assets:
- none
```

Do not create a titles-only `outline.md` for a source-heavy deck.

The user-facing outline may be compact, but the saved approved outline must contain enough content and source anchors to drive later generation and QA.

## Formal terminology

When a formal section, research-content name, metric, institution, or program name is important, keep the exact formal wording at least once in the deck. A shorter display label may be used elsewhere only if it is clearly a shorthand rather than a replacement definition.

## No unsupported filling

If the source does not support a detail:

- omit it;
- mark it for user confirmation; or
- keep the wording generic.

Do not fill gaps with plausible-looking names, numbers, affiliations, claims, or examples.

Do not use placeholders such as `XXX`, `TBD`, `Lorem ipsum`, or invented pseudo-citations in final slide artwork.

## Pre-generation content lock

Before each slide is generated, its saved prompt must contain:

- exact visible text that is verbatim-locked;
- semantic relationships that are meaning-locked;
- source anchors for important claims;
- any explicitly allowed simplifications.

The image-generation step must use this locked content, not reconstruct it from vague memory.

## QA against the source

For every slide, compare the rendered slide against the content lock.

A mismatch in a proper name, number, threshold, formula, formal research title, or other verbatim-locked string is a **critical factual failure**, not a cosmetic typo.

Critical factual failures must be repaired/regenerated before acceptance unless the user explicitly and knowingly authorizes that exact mismatch. A broad instruction such as “minor issues can be skipped” does not automatically waive factual/source errors.
