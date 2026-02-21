# TECH-022: Counter settings

Make counter settings reusable so any game can opt-in to show or hide corner counters.

## Summary

Some games display corner counters (stock, waste, or pile badges) and others do not. Currently the counters toggle is implemented only in specific games, which makes it hard to standardize behavior.

We want a general counter setting pattern that any game can use to show or hide corner counters. The label text should be "Laskurit" and it should be possible to apply the setting in any game that displays corner counters.

## Acceptance Criteria

- [ ] Provide a reusable counter setting that any game can use.
- [ ] The counter control uses the label "Laskurit".
- [ ] Games can opt-in to hide/show corner counters using this setting.
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

This refers to the corner badge counters (e.g., stock/waste counts), not the recycle count setting.
