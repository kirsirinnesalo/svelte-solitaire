# TECH-002: Implement game statistics with LocalStorage

Implement game statistics tracking (wins, losses, best times) using LocalStorage per ADR-006.

## Summary

Users need to track their progress across games. This task implements the statistics storage layer using LocalStorage as decided in ADR-006. This provides the foundation for FEAT-004 (statistics display).

Statistics tracked per game:
- Wins count
- Losses count  
- Games played total
- Best time (for timed games)
- Last played timestamp

## Acceptance Criteria

- [ ] Create `src/lib/statsStore.svelte.ts` with $state-based storage
- [ ] Implement `loadStats()` - Load from LocalStorage on init
- [ ] Implement `saveStats()` - Save to LocalStorage
- [ ] Implement `recordWin(game, time)` - Record win with time
- [ ] Implement `recordLoss(game)` - Record loss
- [ ] Implement `getStats(game)` - Get stats for specific game
- [ ] Storage key: `solitaire-collection-stats`
- [ ] Include version field for future migrations
- [ ] Try-catch around all localStorage access
- [ ] Tests for all storage functions
- [ ] Schema matches ADR-006 specification
- [ ] No TypeScript errors
- [ ] No console warnings

## References

**Related Tasks:**
- [FEAT-004](FEAT-004-statistics-display.md) - Display statistics in UI
- [BUG-001](BUG-001-cardback-persistence.md) - Similar localStorage pattern

**Related ADRs:**
- [ADR-006](../adrs/ADR-006-localstorage-for-game-statistics.md) - LocalStorage decision

## Notes

Follow the schema from ADR-006:
```typescript
interface GameStats {
  wins: number;
  losses: number;
  gamesPlayed: number;
  bestTime?: number;
  lastPlayed?: string;
}

interface StorageSchema {
  stats: Record<GameType, GameStats>;
  version: string;
}
```
