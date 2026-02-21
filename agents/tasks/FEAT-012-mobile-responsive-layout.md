# FEAT-012: Mobile responsive layout

Make the UI responsive and touch-friendly so the games are playable on phones.

## Summary

The current layout targets desktop screens and does not adapt to narrow viewports.
On phones, game areas overflow, cards are too large, and controls are hard to use.

This feature will introduce responsive layout rules for the app shell, game screens,
and shared components so that all games remain playable on small screens without
horizontal scrolling. It will also improve touch target sizes and spacing to
reduce mis-taps.

## Acceptance Criteria

- [ ] No horizontal scrolling on phones at 360px width
- [ ] Core game UI fits within the viewport without clipping
- [ ] Card sizing and spacing scale down for small screens
- [ ] Primary controls meet a 44px minimum touch target
- [ ] Layout remains functional in landscape and portrait modes
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

Focus on CSS and layout changes first. Avoid changing game rules or logic.