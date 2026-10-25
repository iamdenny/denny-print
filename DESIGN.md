---
title: "Denny Print design system"
summary: "Implemented visual tokens, responsive rules and interaction acceptance criteria"
read_when:
  - Maintaining this service or reviewing its implementation
---

# Design System: Denny Print

Project ID: `denny-print`. Reviewed against the source on 2026-10-25.
This describes the implemented design and future acceptance criteria; it is not a claim that every viewport passed a new visual audit.

## 1. Visual Theme & Atmosphere

Use a light, readable tool workspace with a clear primary task, generous separation between controls and results, and a recognizable service accent. Discovery and promotion should remain secondary to completing the tool task.

## 2. Color Palette & Roles

Paper `#f6f5f0`, ink `#252821`, muted text `#61645e`, borders `#dcded5`; service accent `#bd492d`.
Tokens live in `src/style.css`; preserve the service-specific body override where present. The Print accent was darkened for contrast. Validate contrast after color edits rather than assuming an accent works for every text size.

## 3. Typography Rules

DM Sans for body copy (16px, line height 1.6) and Manrope for headings, currently loaded through Google Fonts. Preserve system sans fallbacks and the connection disclosure in the privacy page.
Keep meaningful heading order, readable line lengths, visible field labels and flexible text wrapping across locales. Preserve responsive heading sizes. Supporting labels currently use smaller sizes; do not describe all existing text as 16px or larger.

## 4. Component Stylings

Primary controls use a 10px radius and at least 48px height. The consent panel uses a 14px radius and 20px padding; consent actions keep a minimum 44px height.
The initial consent view shows immediate allow/reject actions plus customization. Its checkbox group and save action stay hidden until customization. Long copy scrolls inside `.privacy-content`; `.privacy-actions` remains outside that scrolling region. Each purpose keeps its own labeled checkbox and description.

The panel is currently non-modal; do not assume native-dialog focus trapping or Escape dismissal. Preserve visible keyboard focus and accessible names when changing controls.

## 5. Layout Principles

Owned-service artwork promotes Games, Everyday Tools and MODU TT. Interactive content precedes the paid ad placement on narrow screens.
Use existing breakpoint rules in `src/style.css` as the implementation reference. At 320px and 390px, require visible primary controls, no page-wide horizontal overflow and reachable consent actions. Horizontal scrolling is intentional only inside the mobile promotion row or another explicitly scrollable region.

Keep paid placements out of the tool's control area. Hide promotion and consent UI from printed results. Localized text must wrap without clipping buttons. Ads that do not fit their issued dimensions must not be squeezed over controls.

## 6. Motion & Interaction

Honor existing reduced-motion styles and avoid motion that shifts controls during input. Reserve stable space while interactive content initializes; Daily uses a loading layout that matches the quiz.

Printable bingo, mazes, English word searches and arithmetic worksheets. Editions generate reproducible questions and answers; users can customize and print separate puzzle/answer sheets. Word searches remain English; localized controls do not imply localized word-search puzzles.

## 7. Anti-Patterns (Banned)

- Sequential prompts for the same two optional purposes, or mandatory checkbox interactions before an all-or-nothing choice.
- Loading optional providers before the relevant choice or presenting the custom panel as a certified AdSense CMP.
- Ad overlays covering inputs, intercepted clicks or remote replacements for the approved artwork kits.
- Counting language variants as unique activities, invented usage metrics or promises of first-place search ranking.
- Translating only labels while claiming the underlying practice material is translated.
- Declaring mobile, keyboard or contrast acceptance from a build result alone.

## References

- [Operations and QA](docs/operations.md)
- [Consent decision](docs/adr/0001-shared-privacy-choices.md)
- [Source map](docs/codemap.md)
