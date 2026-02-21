# Copilot Instructions: Solitaire Collection

**Tech stack**: Svelte 5 (runes only), TypeScript, Vite  
**Development conventions**: [AGENTS.md](../AGENTS.md)  
**Architecture decisions**: [docs/adrs/](../docs/adrs/)

---

## Type System

Types: `src/types/game.ts`

- `Card`: `{ suit, rank, faceUp, id }`
- `Suit`: `'hearts' | 'diamonds' | 'clubs' | 'spades'`
- `Rank`: `'A' | '2' ... '10' | 'J' | 'Q' | 'K'`

## Shared Libraries

- `src/lib/cardUtils.ts` — `createDeck()`, `shuffleDeck()`, `canStackOnTableau()`, `canStackOnFoundation()`, `getRankValue()`
- `src/lib/dragUtils.ts` — drag & drop helpers
- `src/lib/cardBackStore.svelte.ts` — card back selection ($state-based store)

## Game Structure

```
src/games/{game}/
  {Game}.svelte       # UI, $state, $derived, $props
  {game}Rules.ts      # Pure functions, fully testable
```

Klondike is the reference implementation for other games.

## Styling

**Cards**: `70px × 100px`, `border-radius: 8px`, `box-shadow: 0 2px 4px rgba(0,0,0,0.2)`  
**Colors**: game area `#2d6e2d`, navigation `#4CAF50`, red suits `#d32f2f`  
**Card back**: Unicode `🂠`

## Svelte 5

Always use runes — no `export let`, no `$:`, no `createEventDispatcher`. See [ADR-002](../docs/adrs/ADR-002-svelte-5-runes-only.md).
