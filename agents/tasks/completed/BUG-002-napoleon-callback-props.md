# BUG-002: Fix Napoleon to use callback props

Napoleon uses deprecated `createEventDispatcher`, violating ADR-003.

## Summary

[Napoleon.svelte](../../src/games/napoleon/Napoleon.svelte) currently imports and uses `createEventDispatcher` from Svelte, which violates [ADR-003 Callback Props Over Event Dispatchers](../../docs/adrs/ADR-003-callback-props-over-event-dispatchers.md).

All other game components (Klondike, AcesUp, Clock) correctly use callback props. Napoleon must be updated for consistency and ADR compliance.

## Acceptance Criteria

- [ ] Remove `createEventDispatcher` import from Napoleon.svelte
- [ ] Add `onback` callback prop using `$props()`
- [ ] Update App.svelte to pass callback instead of listening to event
- [ ] All navigation works identically (back to game selector)
- [ ] No TypeScript errors
- [ ] ADR-003 compliance verified

## References

**Related ADRs:**
- [ADR-003](../../docs/adrs/ADR-003-callback-props-over-event-dispatchers.md) - Callback props over event dispatchers
- [ADR-002](../../docs/adrs/ADR-002-svelte-5-runes-only.md) - Svelte 5 runes patterns

## Notes

Expected changes:
```typescript
// ❌ Current (wrong)
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
// ...
dispatch('back');

// ✅ Should be (correct)
let { onback }: { onback: () => void } = $props();
// ...
onback();
```

This is a quick fix with high impact on architectural consistency.
