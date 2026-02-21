# Copilot-ohjeistus: Pasianssikokoelma

**Tech stack**: Svelte 5 (runes only), TypeScript, Vite  
**Kehityskonventiot**: [AGENTS.md](../AGENTS.md)  
**Arkkitehtuuripäätökset**: [docs/adrs/](../docs/adrs/)

---

## Tyyppijärjestelmä

Tyypit: `src/types/game.ts`

- `Card`: `{ suit, rank, faceUp, id }`
- `Suit`: `'hearts' | 'diamonds' | 'clubs' | 'spades'`
- `Rank`: `'A' | '2' ... '10' | 'J' | 'Q' | 'K'`

## Yhteiset kirjastot

- `src/lib/cardUtils.ts` — `createDeck()`, `shuffleDeck()`, `canStackOnTableau()`, `canStackOnFoundation()`, `getRankValue()`
- `src/lib/dragUtils.ts` — drag & drop -apufunktiot
- `src/lib/cardBackStore.svelte.ts` — kortin kääntöpuolen valinta ($state-pohjainen store)

## Pelien rakenne

```
src/games/{peli}/
  {Peli}.svelte       # UI, $state, $derived, $props
  {peli}Rules.ts      # Pure funktiot, täysin testattavissa
```

Klondike on referenssitoteutus muille peleille.

## Tyylittely

**Kortit**: `70px × 100px`, `border-radius: 8px`, `box-shadow: 0 2px 4px rgba(0,0,0,0.2)`  
**Värit**: pelialue `#2d6e2d`, navigointi `#4CAF50`, punaiset maat `#d32f2f`  
**Kortin kääntöpuoli**: Unicode `🂠`

## Svelte 5

Käytä aina runeeja — ei `export let`, ei `$:`, ei `createEventDispatcher`. Katso [ADR-002](../docs/adrs/ADR-002-svelte-5-runes-only.md).
