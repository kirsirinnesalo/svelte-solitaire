# TECH-021: Conditional recycle counter

Only show recycle counters when the recycle limit is finite and greater than 1.

## Summary

Napoleon and Klondike render a draw/recycle counter near the stock pile even when the limit is 1. This adds visual noise without adding useful information, because a single allowed recycle is already implied by the settings.

We want the counter to appear only when the recycle limit is finite and greater than 1, while keeping the existing recycle setting in the settings panel unchanged.

## Acceptance Criteria

- [ ] Napoleon shows the draw/recycle counter only when the recycle limit is finite and greater than 1.
- [ ] Klondike shows the recycle counter only when the recycle limit is finite and greater than 1.
- [ ] Recycle settings remain visible and functional.
- [ ] Tests written and passing (TDD)
- [ ] No TypeScript errors
- [ ] No console warnings

## References

**Related Tasks:**
- None

**Related ADRs:**
- None

**External:**
- None

## Notes

This should only remove the on-table counter UI, not the underlying recycle logic.
