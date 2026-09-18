# Example — Post-sample slide with a strict source figure

This example demonstrates how to integrate an original technical figure without asking ImageGen to redraw or reinterpret it.

---

# Slide 8 — 模型架构｜以原始结构图作为核心证据

## Canvas
- One complete 16:9 PowerPoint slide image.
- Simplified Chinese.
- **This call generates Slide 8 only: “模型架构｜以原始结构图作为核心证据”.**
- This is not the cover and not a multi-slide sheet.
- No slide number, watermark, placeholder, or invented citation.

## Slide intent
Use the supplied model-architecture figure as the main evidence. The surrounding slide should help the audience read the original figure without changing its internal semantics.

## Source anchors / content locks
- [strict asset] The original source figure is authoritative for internal labels, equations, module ordering, connectivity, and visual evidence.
- [verbatim] Preserve the approved title/callout/takeaway wording below.
- [semantic] Surrounding annotations may explain the reading order but must not reinterpret the architecture.

## Input images
- **Image 1 — approved sample slide; style reference only.** Match visual identity, not layout, factual content, scenic footer, or page-specific decoration.
- **Image 2 — original model-architecture figure; strict input asset.** It must appear visibly and remain semantically unchanged.

## Strict asset fidelity for Image 2
Preserve Image 2's:
- internal labels;
- arrows and connectivity;
- module ordering;
- relative geometry;
- color coding when it carries meaning;
- any equations or symbols already present.

Do not redraw, reinterpret, relabel, “clean up,” translate, or synthesize a replacement diagram. Compose the surrounding title, callouts, background, and explanatory structure around the supplied figure.

## Exact visible text

**Title**
模型架构｜以原始结构图作为核心证据

**Callout 1**
先读整体信息流，再看局部模块

**Callout 2**
所有结构关系以原图为准

**Takeaway**
原始技术图负责证据，PPT 负责建立阅读层次

## Composition
Make Image 2 the dominant evidence panel, using roughly half to two-thirds of the usable content area.

Place two concise callouts beside the figure. If leader lines are needed, terminate them outside important figure content and keep them away from all text. Add the takeaway in a clean flat-color/open-space region near the bottom.

Do not shrink the source figure merely to make room for decoration.

## Text repairability
All newly rendered text, including title/header areas, must sit on uniform solid-color local backgrounds with generous clear space. No leader line, source-figure mark, gradient, texture, or decoration may pass behind text. Ensure each new text block could later be covered by a flat rectangle about 20% larger without obscuring Image 2 or damaging nearby graphics.

## Hard constraints
- Image 2 is evidence, not style inspiration.
- Maintain the approved sample's visual language without copying its page-specific content/layout.
- Do not modify the source figure's semantic content.
- Keep surrounding explanation visually subordinate to the original evidence.
- No placeholders such as XXX/TBD and no page number.

## Negative constraints
- No recreated diagram.
- No invented module labels.
- No decorative pseudo-statistics.
- No unrelated icons.
- No gradient or textured text background.
- No line crossing any text.

## Acceptance criteria
Accept only if:
- the source figure remains recognizable and faithful;
- all newly rendered text is correct;
- the surrounding callouts clarify rather than obscure the evidence;
- all newly rendered text regions pass the repairability overlay test;
- no placeholder, page number, unsupported fact, or forbidden element appears.
