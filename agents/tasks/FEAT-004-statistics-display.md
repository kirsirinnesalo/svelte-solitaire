# FEAT-004: Display game statistics in game selector

Show win/loss statistics for each game in the game selector.

## Summary

After TECH-002 implements statistics storage, this task displays them in the GameSelector to show player progress.

Show for each game:
- Games played
- Wins
- Win rate percentage
- Best time (if applicable)

## Acceptance Criteria

- [ ] GameSelector imports statsStore
- [ ] Display stats under each game name
- [ ] Show "No games played yet" for new games
- [ ] Format times nicely (MM:SS)
- [ ] Calculate win rate percentage
- [ ] Stats update immediately after game
- [ ] Responsive layout (stats don't break mobile)
- [ ] No TypeScript errors

## References

**Related Tasks:**
- [TECH-002](TECH-002-stats-storage.md) - Stats storage (required first)

**Related ADRs:**
- [ADR-006](../../docs/adrs/ADR-006-localstorage-for-game-statistics.md) - Statistics spec

## Notes

Simple text display initially.
Could enhance with charts/graphs in future.
