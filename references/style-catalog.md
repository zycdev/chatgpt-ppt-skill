# Built-in Style Library

The detailed built-in style references in this directory are inherited and adapted from the upstream `ningzimu/codex-ppt-skill`. They are intentionally kept as **rich style briefs**, not compressed into one-line labels.

Use them as visual systems, not rigid templates. Palette, typography mood, texture, icon/illustration language, density, and report discipline should remain coherent; page composition should vary with slide role.

All built-in style files are subordinate to:

- `SKILL.md`;
- `docs/text-repairability.md`;
- the current deck's explicit `visual_spec.md`;
- the user's current instructions.

In particular, if a style uses texture, gradients, collage, photography, linework, or rich decoration, keep those treatments **outside text-bearing zones**. Text zones must remain flat, solid-color, spacious, and overlay-repairable.

## Built-in styles

| Style | Best suited to | Detailed reference | Upstream preview |
|---|---|---|---|
| 清爽专业风 | 工作汇报、技术分享、毕业答辩、项目复盘 | `references/清爽专业风.md` | https://raw.githubusercontent.com/ningzimu/codex-ppt-skill/main/assets/style-previews/clean-professional.png |
| 创意杂志风 | 创意提案、品牌展示、作品集、传播型分享 | `references/创意杂志风.md` | https://raw.githubusercontent.com/ningzimu/codex-ppt-skill/main/assets/style-previews/creative-magazine.png |
| 电子墨水杂志风 | 阅读型分享、知识型内容、克制编辑设计 | `references/电子墨水杂志风.md` | https://raw.githubusercontent.com/ningzimu/codex-ppt-skill/main/assets/style-previews/e-ink-magazine.png |
| 数据仪表盘风 | 数据密集型报告、经营分析、指标追踪 | `references/数据仪表盘风.md` | https://raw.githubusercontent.com/ningzimu/codex-ppt-skill/main/assets/style-previews/data-dashboard.png |
| 科研答辩风 | 基金/项目申报、科研答辩、中期/结题、论文答辩 | `references/科研答辩风.md` | https://raw.githubusercontent.com/ningzimu/codex-ppt-skill/main/assets/style-previews/scientific-defense.png |
| 复古扁平插画风 | 文化、历史、生活方式、故事化表达 | `references/复古扁平插画风.md` | https://raw.githubusercontent.com/ningzimu/codex-ppt-skill/main/assets/style-previews/retro-flat-illustration.png |
| 手绘技术解释风 | AI/软件工程/技术概念解释、知识卡片、课程分享 | `references/手绘技术解释风.md` | https://raw.githubusercontent.com/ningzimu/codex-ppt-skill/main/assets/style-previews/handdrawn-technical.png |
| 手绘白板风 | 头脑风暴、机制梳理、流程解释、工作坊 | `references/手绘白板风.md` | https://raw.githubusercontent.com/ningzimu/codex-ppt-skill/main/assets/style-previews/handdrawn-whiteboard.png |
| 温暖手工风 | 人文、教育、公益、生活方式、温和叙事 | `references/温暖手工风.md` | https://raw.githubusercontent.com/ningzimu/codex-ppt-skill/main/assets/style-previews/warm-handmade.png |
| 麦肯锡风格 | 咨询分析、战略框架、管理汇报、路线图 | `references/麦肯锡风格.md` | https://raw.githubusercontent.com/ningzimu/codex-ppt-skill/main/assets/style-previews/mckinsey-style.png |
| 党政红风格 | 正式政务、政策宣讲、组织汇报 | `references/党政红风格.md` | https://raw.githubusercontent.com/ningzimu/codex-ppt-skill/main/assets/style-previews/party-government-red.png |
| 教学课件风 | 高校课程、专题讲座、培训、知识科普 | `references/教学课件风.md` | https://raw.githubusercontent.com/ningzimu/codex-ppt-skill/main/assets/style-previews/teaching-courseware.png |

## Selection rule

When the user has not already specified a visual direction:

1. infer the audience, topic, evidence density, and communication goal;
2. shortlist **2–3** styles only;
3. load the full detailed reference files for those shortlisted styles before describing them;
4. recommend one with a concrete reason;
5. after the user chooses, load that selected detailed style reference and use it to build `visual_spec.md`.

Do not offer only shallow labels such as “academic / corporate / creative.” The detailed style brief is part of the generation contract.

If the user supplies a PPT/PDF/image as a style reference, that supplied reference takes priority over the built-in library; do not force a built-in style choice.
