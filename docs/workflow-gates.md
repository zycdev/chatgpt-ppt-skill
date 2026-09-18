# Workflow Gates

## Default mode: interactive

The normal workflow has three explicit user approval gates:

1. **Outline approval**
2. **Visual-direction approval**
3. **Representative-sample approval**

Do not auto-approve them.

A user request such as “make the whole deck,” “continue,” or “run the workflow” does not automatically mean these gates can be skipped unless the user clearly requests an automated dogfood/test run.

## Auto-test mode

Use `deck.approval_mode = "auto_test"` only when the user explicitly requests end-to-end automated testing/dogfood.

In auto-test mode:

- the workflow may advance through gates without waiting;
- the final report must say that approvals were auto-test approvals, not human approvals.

Never use auto-test solely to save time.

## Resume behavior

On resume, inspect:

1. `deck_state.json`;
2. `outline.md`;
3. `visual_spec.md`;
4. existing `origin_image/` files.

Continue from the first incomplete gate or production phase.

Do not ask the user to re-approve already approved decisions unless the relevant artifact is missing, contradictory, or the user has requested a change.
