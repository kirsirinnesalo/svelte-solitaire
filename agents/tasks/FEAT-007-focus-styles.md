# FEAT-007: Add visible focus styles for keyboard navigation

Add clear, visible focus indicators for keyboard users.

## Summary

After FEAT-005 adds keyboard navigation, this task ensures focus is clearly visible. Default browser focus outlines are often too subtle or ugly.

Custom focus styles should:
- Be highly visible
- Not obscure content
- Match game's visual design
- Work on all backgrounds

## Acceptance Criteria

- [ ] Define focus style in shared.css
- [ ] Visible on cards (e.g., 2px solid outline)
- [ ] Visible on buttons
- [ ] Sufficient color contrast (WCAG AA)
- [ ] Works on green table background
- [ ] Works on all card designs
- [ ] Doesn't interfere with drag & drop
- [ ] Tested with keyboard navigation
- [ ] No TypeScript errors

## References

**Related Tasks:**
- [FEAT-005](FEAT-005-keyboard-navigation.md) - Keyboard navigation

**External:**
- [WCAG Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)

## Notes

Use `:focus-visible` to only show focus for keyboard (not mouse clicks).

Example:
```css
.card:focus-visible {
  outline: 2px solid #ffeb3b;
  outline-offset: 2px;
}
```
