# TECH-027: Extract shared timer utility

Timer logic is duplicated across all 4 games (~80 lines total).

## Summary

Identical timer logic (~20 lines per game) is repeated in Klondike, Napoleon, AcesUp, and Clock:
- State variables: `startTime`, `elapsedTime`, `displayTime`, `isPaused`, `pauseStartTime`
- `$effect` for timer updates (setInterval with cleanup)
- `togglePause()` function for pause/resume logic

This violates DRY principle and makes timer behavior changes require updates in 4 places.

Creating a shared `gameTimer` utility will:
- Reduce code by ~60+ lines
- Centralize timer logic
- Make timer behavior consistent
- Simplify game components

## Acceptance Criteria

- [ ] Create `src/lib/gameTimer.svelte.ts`
- [ ] Implement `createGameTimer()` factory function using Svelte 5 runes
- [ ] Returns object with:
  - `time` ($derived) - elapsed seconds
  - `isPaused` ($state) - pause state
  - `start()` - start/resume timer
  - `togglePause()` - pause/resume
  - `reset()` - reset timer to 0
- [ ] Uses `$state`, `$effect`, `$derived` (per ADR-002)
- [ ] Refactor Klondike to use timer utility
- [ ] Refactor Napoleon to use timer utility
- [ ] Refactor AcesUp to use timer utility
- [ ] Refactor Clock to use timer utility
- [ ] Tests for gameTimer utility (start, pause, resume, reset)
- [ ] All games' timer functionality works identically
- [ ] Net code reduction ~60+ lines
- [ ] No TypeScript errors

## References

**Related Tasks:**
- Related to TECH-010 (undo manager) - similar pattern of extracting duplicated logic

**Related ADRs:**
- [ADR-002](../adrs/ADR-002-svelte-5-runes-only.md) - Svelte 5 runes-only approach
- [ADR-000](../adrs/ADR-000-agent-guidance.md) - DRY principle

## Notes

Example API:
```typescript
// In game component
import { createGameTimer } from '../../lib/gameTimer.svelte';

const timer = createGameTimer();

// Start timer on first action
if (timer.time === 0) timer.start();

// Pause/resume
timer.togglePause();

// Reset on new game
timer.reset();

// Use in template
{timer.time}  // Display elapsed seconds
{timer.isPaused}  // Check pause state
```

Implementation considerations:
- Use `$state.raw()` if proxy causes issues with Date.now() calculations
- Cleanup interval on component unmount via `$effect` return
- Pause logic: track pause duration and adjust startTime on resume
- Consider exposing `displayTime` as formatted string or keep as seconds

Priority: High - affects all 4 games, significant code savings.
