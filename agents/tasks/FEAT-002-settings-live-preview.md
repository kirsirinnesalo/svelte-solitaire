# FEAT-002: Add live preview to card back settings modal

Show card back preview while selecting in settings modal.

## Summary

Currently users select card back from dropdown without seeing what it looks like until they close the modal. Adding live preview improves UX.

Show sample card with selected back design in the settings modal.

## Acceptance Criteria

- [ ] Add CardComponent to settings modal
- [ ] Preview updates immediately when selection changes
- [ ] Preview shows actual card back (not just name)
- [ ] Preview includes face-up card showing suits
- [ ] Responsive layout (preview doesn't break mobile)
- [ ] No performance issues
- [ ] No TypeScript errors

## References

**Related Tasks:**
- [BUG-001](BUG-001-cardback-persistence.md) - Card back storage

**External:**
- Example: Solitaire apps with theme previews

## Notes

Modal already has settings form.
Add preview card next to dropdown.
