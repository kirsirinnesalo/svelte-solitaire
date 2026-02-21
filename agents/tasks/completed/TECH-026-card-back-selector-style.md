# TECH-026: Card back selector styling

Align the card back selector styling with the rest of the homepage controls.

## Summary

The card back selector on the home screen has a persistent green border, while other controls use green only on hover. This makes the selector stand out more than intended and breaks visual consistency.

We want the selector to follow the same hover-driven green accent pattern as other controls on the homepage.

## Acceptance Criteria

- [ ] The card back selector no longer has a permanent green border.
- [ ] The selector uses the same green accent behavior as other homepage controls (hover-driven).
- [ ] Visual consistency on the home header is improved.
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

Selector styles live in App.svelte under .card-back-selector.
