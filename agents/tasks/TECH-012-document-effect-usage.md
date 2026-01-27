# TECH-012: Add documentation for $effect usage in Klondike

Add inline comment explaining $effect usage for drawCount → maxRecycles synchronization.

## Summary

Klondike uses `$effect()` to synchronize maxRecycles when drawCount changes. This is correct usage of $effect for side effects, but needs documentation explaining why $effect is used instead of $derived.

## Acceptance Criteria

- [ ] Add comment above $effect in Klondike.svelte
- [ ] Explain this is side effect (mutating other state)
- [ ] Explain why not $derived (changes different state variable)
- [ ] Reference Svelte 5 runes documentation
- [ ] No functionality changes
- [ ] No TypeScript errors

## References

**Related ADRs:**
- [ADR-002](../adrs/ADR-002-svelte-5-runes-only.md) - Runes patterns

**External:**
- [Svelte 5 $effect](https://svelte.dev/docs/svelte/$effect)

## Notes

Example comment:
```typescript
// Use $effect (not $derived) because this is a side effect:
// changing drawCount mutates maxRecycles state.
// $derived is only for computing values from other state.
$effect(() => {
  if (drawCount === 1) maxRecycles = 3;
  else maxRecycles = 'unlimited';
});
```
