# TECH-016: Implement lazy loading for game components

Split games into separate bundles and load on-demand.

## Summary

Currently all game components are loaded upfront, increasing initial bundle size. Since users typically play one game at a time, lazy loading games will improve initial load performance.

## Acceptance Criteria

- [ ] Convert game imports to dynamic imports in App.svelte
- [ ] Games load only when selected
- [ ] Show loading indicator while game loads
- [ ] Bundle size analysis shows improvement
- [ ] No regressions in game functionality
- [ ] TypeScript types preserved
- [ ] No TypeScript errors

## References

**Related Tasks:**
- [TECH-017](TECH-017-bundle-analysis.md) - Bundle analysis

**External:**
- [Vite code splitting](https://vitejs.dev/guide/features.html#async-chunk-loading-optimization)

## Notes

Pattern:
```typescript
const Klondike = await import('./games/klondike/Klondike.svelte');
```
