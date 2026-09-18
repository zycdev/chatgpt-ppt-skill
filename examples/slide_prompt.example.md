# Example — Post-sample mechanism slide

This is a **quality reference for post-sample prompt structure**, not a fixed template. It demonstrates how to inherit an approved sample while changing the composition to fit a different technical mechanism.

---

# Slide 7 — 查询改写机制｜让检索随证据逐步收敛

## Canvas
- One complete 16:9 PowerPoint slide image.
- Language: Simplified Chinese.
- Do not render a slide number, watermark, fake citation, or unrelated logo.

## Deck goal and audience
Formal technical/research presentation for an expert audience. The deck explains an iterative information-seeking system. This slide focuses on how evidence from one retrieval round changes the next query.

## Slide role and intent
This is a core mechanism slide. It should answer:

**系统如何根据已获得证据识别尚未解决的信息缺口，并生成下一轮更有针对性的查询？**

The audience should understand the mechanism in about 10 seconds, then inspect the four stages.

## Primary visual anchor
Use **Image 1: the approved sample slide** as the primary style reference.

Match its:
- palette and contrast;
- typography mood;
- illustration/diagram language;
- line weight;
- spacing rhythm;
- information density;
- overall finish.

Do **not** copy the sample's exact layout. This slide needs a mechanism-focused composition.

## Selected style
Use the approved `visual_spec.md`, derived from `references/科研答辩风.md`.

Maintain the same formal academic-defense visual system established by the sample.

## Exact visible text

**Title**
查询改写机制｜让检索随证据逐步收敛

**Four stages**
1. 已获证据汇总
2. 信息缺口识别
3. 下一查询生成
4. 新证据验证

**Decision labels**
继续检索
证据充分，停止

**Bottom takeaway**
查询不是预先固定，而是由当前证据状态动态决定

Do not add invented technical terms or filler copy.

## Semantic relationships
The visual must communicate:

- the current evidence set is summarized first;
- unresolved entities, relations, contradictions, or missing facts become explicit information gaps;
- those gaps drive a targeted next query;
- new evidence is checked against the current gap;
- sufficient evidence exits the loop; insufficient evidence triggers another reformulation.

## Composition
Create one dominant **mechanism loop with a decision branch**:
- left-center: evidence summary;
- center: information-gap diagnosis;
- right-center: next-query generation and retrieval;
- far right or lower-right: evidence validation;
- a clean branch shows “证据充分，停止” versus “继续检索”;
- the continue branch loops back toward gap identification.

Use visual grouping and arrows to explain the mechanism. Avoid four unrelated cards.

## Text repairability
- Place all text on white or flat solid-color local backgrounds.
- No gradient, texture, illustration detail, diagram line, arrow, icon, or connector may pass behind text.
- Keep generous padding around the title, stage labels, and decision labels.
- Apply the overlay test: a rectangle roughly 20% larger than each text block should not damage nearby graphics or another text block.
- Open white space is preferred over boxing every label.

## Hard constraints
- Full-slide native ImageGen artwork.
- Exact terminology above.
- The four stages must read as one mechanism.
- Preserve generous whitespace despite technical density.
- Use no more visible text than specified above unless a tiny functional label is essential.
- Maintain style consistency with the approved sample.

## Negative constraints
- No generic AI robot hero image.
- No glossy 3D icon set.
- No neon/cyberpunk effects.
- No decorative microtext.
- No random equations or fake metrics.
- No fake institutional logos.
- No repeated four-card dashboard composition.
- No arrows crossing text.
- No gradient/texture/photo behind any text.

## Acceptance criteria
Accept only if:
- all required Chinese text is correct and readable;
- the feedback-and-stop logic is understandable without speaker notes;
- the page clearly belongs to the same deck as the approved sample;
- all text regions pass the overlay-repair test;
- no required relationship is missing;
- no forbidden element appears.
