# TECH-017: Analyze and optimize bundle size

Run bundle analysis and identify optimization opportunities.

## Summary

Understand current bundle composition and identify low-hanging fruit for size optimization. Target <200KB initial bundle for fast loading.

## Acceptance Criteria

- [ ] Run `npm run build` and analyze output
- [ ] Use vite-plugin-visualizer or similar
- [ ] Document bundle sizes in task notes
- [ ] Identify largest dependencies
- [ ] Propose optimization opportunities
- [ ] Document findings for future tasks
- [ ] No functionality changes (analysis only)

## References

**Related Tasks:**
- [TECH-016](TECH-016-lazy-loading.md) - Lazy loading implementation

**External:**
- [vite-bundle-visualizer](https://www.npmjs.com/package/vite-bundle-visualizer)

## Notes

Analysis task - no code changes.
Results inform future optimization work.
