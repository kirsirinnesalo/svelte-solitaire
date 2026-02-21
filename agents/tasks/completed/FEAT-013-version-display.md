# FEAT-013: Version display

Show the current app version in the UI.

## Summary

The app currently has no visible version indicator, which makes it harder to confirm what is deployed or to ask users for the exact build they are on.

This feature will display the current app version in a subtle location (for example in the footer or game selector screen). The version should be sourced from a single canonical place and injected into the UI during build.

## Acceptance Criteria

- [ ] Version is shown in the UI in a non-intrusive location
- [ ] Version value comes from a single source of truth
- [ ] Version is included in production builds without manual edits
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

Prefer using the package.json version as the source of truth.