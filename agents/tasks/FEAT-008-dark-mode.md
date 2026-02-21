# FEAT-008: Implement dark mode theme

Add dark mode theme with toggle in settings.

## Summary

Many users prefer dark mode for reduced eye strain. Add optional dark theme that affects table color, card backgrounds, and UI elements.

Theme should:
- Reduce brightness
- Maintain sufficient contrast
- Preserve card readability
- Be toggleable via settings

## Acceptance Criteria

- [ ] Define dark mode color palette
- [ ] Implement dark mode CSS variables
- [ ] Add theme toggle to settings
- [ ] Save theme preference to LocalStorage
- [ ] Apply theme on app load
- [ ] Dark table background (darker green or navy)
- [ ] Card readability maintained
- [ ] UI buttons/text adjust for dark bg
- [ ] Smooth theme transition
- [ ] No TypeScript errors

## References

**Related ADRs:**
- [ADR-006](../../docs/adrs/ADR-006-localstorage-for-game-statistics.md) - LocalStorage for preferences

**External:**
- [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

## Notes

Consider respecting `prefers-color-scheme` media query as default.

Example dark palette:
- Table: `#1a3a1a` (dark green) or `#1a1a2e` (navy)
- Cards: Keep white or slight off-white
- Text: Lighter shades
