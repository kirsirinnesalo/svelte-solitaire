# TECH-023: Settings layout

Rework settings layout so each setting label sits above its control to reduce horizontal width.

## Summary

The settings row layout consumes too much horizontal space when labels and controls sit side-by-side. This is especially visible with multiple settings in the header area.

We want to stack each setting label above its control for a more compact layout. This change should apply to existing settings controls and any new settings added later.

## Acceptance Criteria

- [ ] Settings layout stacks each label above its control.
- [ ] The new layout reduces horizontal width compared to the current row layout.
- [ ] The "Laskurit" control is not checkbox-style in the new layout.
- [ ] The "Laskurit" control visually matches other settings controls.
- [ ] Existing settings remain functional after layout change.
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

Visual alignment and spacing should remain consistent across game headers.
