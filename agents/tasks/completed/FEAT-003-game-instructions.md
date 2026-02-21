# FEAT-003: Add instructions/help for each game

Add help/instructions modal or page explaining rules for each game.

## Summary

New players need to learn game rules. Each game should have accessible instructions explaining:
- Goal of the game
- How to play (valid moves)
- Winning/losing conditions
- Tips/strategies

## Acceptance Criteria

- [ ] Create HelpModal or InstructionsOverlay component
- [ ] Add "Help" button to GameHeader
- [ ] Write instructions for Klondike
- [ ] Write instructions for Napoleon's Tomb
- [ ] Write instructions for Aces Up
- [ ] Write instructions for Clock
- [ ] Instructions in Finnish (UI language)
- [ ] Include visual examples if helpful
- [ ] Keyboard shortcut to open help (e.g., F1 or ?)
- [ ] No TypeScript errors

## References

**Related ADRs:**
- [ADR-005](../adrs/ADR-005-game-over-overlay-refactor.md) - Overlay pattern

**External:**
- [Wikipedia: Klondike](https://en.wikipedia.org/wiki/Klondike_(solitaire))
- [Wikipedia: Napoleon at St Helena](https://en.wikipedia.org/wiki/Napoleon_at_St_Helena)

## Notes

Consider reusing GameOverOverlay pattern for help modal.
Instructions can be simple text - no need for complex layout initially.
