# TECH-024: Icon-only action buttons

Allow action buttons to show icons by default and expand to text on hover/focus to save horizontal space.

## Summary

The action button row in the header takes a lot of horizontal space because each button always shows text. This reduces room for settings controls.

We want the action buttons to display only icons by default, and reveal their text labels on hover/focus (and equivalent access for keyboard/touch). This should reduce the row width while keeping the labels discoverable.

## Acceptance Criteria

- [ ] Action buttons show only icons by default.
- [ ] Button labels appear on hover and keyboard focus.
- [ ] Touch users can still access labels (e.g., long-press or tap-to-reveal).
- [ ] Layout width is reduced compared to current header.
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

Ensure labels remain accessible for screen readers.
