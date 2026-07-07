# Hero Scenario Player

## Objective

Build a simple, repeatable hero scenario player for the Lineage landing page that shows a parent visual asset selection, a recorded prompt, two child nodes being created, a synchronized agent/JSON surface update, and a reset that removes those child nodes.

## Original Request

Plan a repeatable GoalBuddy-backed implementation for the hero visual slider so it can show a simple agent-in-the-loop flow: record prompts for an iteration, create one or two child nodes from a parent, and reset by removing those child nodes.

## Intake Summary

- Input shape: `existing_plan`
- Audience: visitors to the Lineage landing page and the developer iterating on the hero demo
- Authority: `requested`
- Proof type: `demo`
- Completion proof: a PR branch contains a hero-only scenario player driven by scenario data, with Play/Reset controls, parent selection, recorded prompt display, two child nodes appearing, synchronized JSON update, reset removing child nodes, and passing lint/build plus desktop/mobile browser screenshots.
- Goal oracle: browser walkthrough on the landing page hero plus `npm run lint` and `npm run build`
- Likely misfire: producing a flashy bespoke animation or extra page content instead of a simple repeatable scenario system driven by reusable data.
- Blind spots considered: the hero must stay hero-only; the scrubber and scenario timeline must remain separate concepts; prompt text must be recorded in data; reset must genuinely remove child nodes from demo state; mobile must stay readable.
- Existing plan facts:
  - Create a real PR branch before implementation, likely `codex/hero-scenario-player`.
  - Keep PR 1 simple and data-driven.
  - Add a scenario data file with one parent, one recorded prompt, two children, and ordered steps.
  - Keep the visual side based on the real Swissifier screenshot with overlays.
  - Replace or augment the agent side with rendered JSON/text that can update with scenario state.
  - Add minimal controls: Play and Reset, with Step allowed only if useful for development.
  - Do not add downstream landing sections.
  - Defer complex polish, line highlighting, and smooth animation to a later PR.

## Goal Oracle

The oracle for this goal is:

`A browser walkthrough of the Lineage landing hero on desktop and mobile shows the in-image scrubber still working, a simple data-driven scenario where a parent selection displays a recorded prompt, two child nodes appear, the agent/JSON surface updates in sync, Reset removes those child nodes, no downstream content is added, and npm run lint plus npm run build pass.`

The PM must keep comparing task receipts to this oracle. Planning, discovery, a passing tiny slice, or a clean-looking board is not enough. The goal finishes only when a final Judge/PM audit maps receipts and verification back to this oracle and records `full_outcome_complete: true`.

## Goal Kind

`existing_plan`

## Current Tranche

Deliver PR 1 for the repeatable hero scenario player. This tranche should prove the data model and resettable state flow, not final motion polish. Work should continue through implementation, verification, and PR creation unless blocked by ambiguity or external access.

## Non-Negotiable Constraints

- Keep the landing page focused on the hero; do not add downstream sections.
- Preserve the in-image visual/agent scrubber interaction.
- Keep the scenario simple and data-driven.
- Record the iteration prompt in scenario data so the flow is repeatable.
- Reset must remove the created child nodes from visible demo state and agent/JSON state.
- Do not introduce backend calls or real agent execution in PR 1.
- Respect `prefers-reduced-motion` if any auto-play or timed playback is introduced.
- Do not commit private media, credentials, private campaign data, real presigned URLs, customer content, or local SQLite databases.

## Stop Rule

Stop only when a final audit proves the full original outcome is complete.

Do not stop after planning, discovery, or Judge selection if the user asked for working software or automation and a safe Worker task can be activated.

Do not stop after a single verified Worker package when the broader owner outcome still has safe local follow-up work. Advance the board to the next highest-leverage safe Worker package and continue unless a phase, risk, rejected-verification, ambiguity, or final-completion review is due.

Do not create one Worker/Judge pair per repeated file, table, route, or helper. Put repeated same-shape work into one Worker package and review the package as a whole.

## Slice Sizing

Safe means bounded, explicit, verified, and reversible. It does not mean tiny.

A good task is the largest safe useful slice.

Small is not the goal. Useful is the goal.

A Worker should finish the whole assigned slice. A Judge should judge the whole assigned slice. A PM should reorient the board when tasks are safe but not moving the outcome.

Tiny tasks are allowed when the failure is isolated, the risk is high, the scope is unknown, or the tiny task unlocks a larger slice. Tiny tasks are bad when they keep happening, do not change behavior, only add wrappers/contracts/proof files, or avoid the real milestone.

Do not stop because a slice needs owner input, credentials, production access, destructive operations, or policy decisions. Mark that exact slice blocked with a receipt, create the smallest safe follow-up or workaround task, and continue all local, non-destructive work that can still move the goal toward the full outcome.

If an exact human approval phrase is the only remaining blocker and no safe local work remains, ask once and stop. Preserve the exact phrase in the blocked receipt as `required_reply`, set `waiting_for_user_approval: true`, set `goal.status: blocked`, and set `active_task: null`. Do not keep posting approval prompts until the user replies.

## Board Health

The PM owns board health. If the board looks stale, misleading, offline, or inconsistent, run the bundled checker:

```bash
node /Users/neonwatty/.codex/plugins/cache/goalbuddy/goalbuddy/0.4.0/skills/goal-prep/scripts/check-goal-state.mjs docs/goals/hero-scenario-player
```

If the local board is running, compare `state.yaml` to the live board API. Repair only GoalBuddy control files unless an active Worker or PM task explicitly allows product-file edits.

## Canonical Board

Machine truth lives at:

`docs/goals/hero-scenario-player/state.yaml`

If this charter and `state.yaml` disagree, `state.yaml` wins for task status, active task, receipts, verification freshness, and completion truth.

## Run Command

```text
/goal Follow docs/goals/hero-scenario-player/goal.md.
```

## PM Loop

On every `/goal` continuation:

1. Read this charter, and follow the GoalBuddy execution contract (`references/goal-execution.md` in the goal-prep skill) when available.
2. Read `state.yaml`.
3. Run the bundled GoalBuddy update checker when available and mention a newer version without blocking.
4. Re-check the intake: original request, input shape, authority, proof, blind spots, existing plan facts, and likely misfire.
5. Work only on the active board task.
6. Assign Scout, Judge, Worker, or PM according to the task.
7. Write a compact task receipt.
8. Update the board.
9. If safe local work remains, choose the next largest reversible Worker package and continue unless blocked.
10. If a problem, suggestion, or follow-up should become a repo artifact, create an approved issue/PR or ask the operator whether to create one.
11. Review at phase, risk, rejected-verification, ambiguity, or final-completion boundaries; do not review every small Worker by habit.
12. Finish only with a Judge/PM audit receipt that maps receipts and verification back to the original user outcome and records `full_outcome_complete: true`.

Issue and PR handoffs are supporting artifacts. `state.yaml` remains authoritative, and every external artifact decision must be recorded in a task receipt.
