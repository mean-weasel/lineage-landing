# Hero Surface Viewport Rework

## Objective

Revise the Lineage landing hero scenario animation so the visual/agent slider behaves like two inspectable surfaces rather than a cramped cropped screenshot. The demo should make the selected parent, queued JSON patch, and created child nodes feel spatially correct and easy to understand.

## Original Request

Create a detailed GoalBuddy prep board for fixing the current hero scenario animation issues: pointers do not point to the right things, the 16:9 crop hides too much of the app canvas, and the slider may need scrollable or auto-panned surfaces so users can inspect more of the visual canvas and agent JSON.

## Intake Summary

- Input shape: `existing_plan`
- Audience: Lineage landing page visitors and reviewers of PR #2.
- Authority: `requested`
- Proof type: `demo`
- Completion proof: PR #2, or its successor if Judge requires, contains a verified hero rework where desktop and mobile browser walkthroughs show spatially correct visual markers, a clear patch-to-canvas animation, usable scrubber behavior, reset, no downstream content, and passing lint/build.
- Goal oracle: a desktop and mobile browser walkthrough of the hero on the active branch proves the slider exposes enough of both surfaces to make the scenario legible, markers align to real screenshot/canvas targets, JSON highlights are synchronized with visual action, Play/Reset works, no overflow/framework errors occur, and `npm run lint` plus `npm run build` pass.
- Likely misfire: only nudging marker percentages or making the frame taller without solving the underlying coordinate/crop model.
- Blind spots considered:
  - The real app screenshot is taller than the current 16:9 hero frame.
  - Marker coordinates must map to the underlying screenshot/canvas coordinate system, not the cropped frame.
  - Auto-pan may be better than asking users to manually scroll during playback.
  - The slider must still feel like a hero visual, not a tiny embedded app that demands work.
  - Play/Reset controls should not cover important screenshot or JSON content.
  - Mobile must remain readable without horizontal overflow.
  - PR #2 is already open and should be revised in place unless Judge finds branch replacement safer.
- Existing plan facts:
  - Keep the landing page hero-only.
  - Preserve the in-image visual/agent scrubber.
  - Keep the scenario data-driven and resettable.
  - Keep recorded prompts and child creation as the repeatable demo pattern.
  - Current PR #2 adds a `write-json` patch phase, JSON line highlighting, queued connectors, preview children, and reduced-motion CSS.
  - Independent review found the current visual model not good enough: the 16:9 frame shows only about 62% of the real source screenshot height, and markers are mapped to the visible crop instead of the true screenshot/canvas geography.

## Current Tranche

Repair the hero surface model for PR #2. This tranche should validate the interaction model first, then implement the smallest coherent rework that makes the visual pointers and agent JSON synchronization credible on desktop and mobile.

## Non-Negotiable Constraints

- Do not add downstream landing-page sections.
- Do not introduce backend calls or real agent execution.
- Preserve the comparison slider as a first-viewport interaction.
- Preserve the recorded prompt and child-node reset semantics.
- Prefer auto-pan/center behavior during playback over requiring users to manually scroll to understand the demo.
- Allow manual inspection only if it does not fight the scrubber interaction.
- Move controls out of the content area if they obscure the target surfaces.
- Respect `prefers-reduced-motion`.
- Do not commit private media, credentials, private campaign data, real presigned URLs, customer content, or local SQLite databases.

## Goal Oracle

The oracle for this goal is:

`A browser walkthrough of the Lineage landing hero on desktop and mobile shows a larger or scrollable/auto-panned visual surface and synchronized agent surface where parent selection, JSON patch queueing, and child creation are spatially credible; marker overlays align to real screenshot/canvas targets; Play and Reset work; the scrubber still reveals visual versus agent surfaces; no downstream content is added; no horizontal overflow or visible framework errors occur; and npm run lint plus npm run build pass.`

The final audit must explicitly compare the implemented behavior against the known failure modes: wrong pointer targets, over-cropped source screenshots, obscuring controls, unreadable JSON, broken slider, and mobile overflow.

## Canonical Board

Machine truth lives at:

`docs/goals/hero-surface-viewport-rework/state.yaml`

If this charter and `state.yaml` disagree, `state.yaml` wins for task status, active task, receipts, verification freshness, and completion truth.

## Run Command

```text
/goal Follow docs/goals/hero-surface-viewport-rework/goal.md.
```

## PM Loop

On every `/goal` continuation:

1. Read this charter and `state.yaml`.
2. Follow the GoalBuddy execution contract when available.
3. Work only on the active task.
4. Keep Scout and Judge tasks read-only.
5. Worker tasks may edit only their `allowed_files`.
6. Record receipts for every completed, blocked, or escalated task.
7. Finish only with a final Judge/PM audit that maps verification back to the oracle and records `full_outcome_complete: true`.
