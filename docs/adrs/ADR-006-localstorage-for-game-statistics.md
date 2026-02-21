# ADR-006: LocalStorage for Game Statistics

**Status**: Accepted  
**Date**: 2026-01-26  
**Deciders**: Development Team  
**Tags**: #storage #statistics #github-pages

## Context

The Solitaire Collection needs to persist game statistics (wins, losses, best times) and user preferences (draw count, recycling settings) across sessions. The application will be deployed to **GitHub Pages**, which provides static hosting only - no backend server, no database, no server-side processing.

### Requirements

1. Persist game statistics per game type
2. Store user preferences
3. Work on GitHub Pages (static hosting)
4. No external dependencies if possible
5. Simple implementation aligned with ADR-000 ("Simplicity over cleverness")

### Constraints

- **No backend**: GitHub Pages serves static files only
- **Client-side only**: All storage must happen in the browser
- **No database**: No SQL, no server-side storage
- **Cross-device sync**: Not required for MVP, but nice-to-have for future

## Decision

We will use **browser LocalStorage API** for persisting game statistics and user preferences.

### Details

**Storage structure:**

```typescript
interface GameStats {
  wins: number;
  losses: number;
  gamesPlayed: number;
  bestTime?: number;  // In seconds
  lastPlayed?: string; // ISO timestamp
}

interface StorageSchema {
  stats: Record<GameType, GameStats>;
  preferences: {
    drawCount: 1 | 3;
    recyclingEnabled: boolean;
    highlightMoves: boolean;
    showMoveCounter: boolean;
  };
  version: string; // For future migrations
}
```

**Implementation:**

```typescript
// src/lib/statsStore.svelte.ts
const STORAGE_KEY = 'solitaire-collection';
const STORAGE_VERSION = '1.0';

export const gameStats = $state<Record<GameType, GameStats>>({});
export const preferences = $state<Preferences>({
  drawCount: 3,
  recyclingEnabled: true,
  highlightMoves: true,
  showMoveCounter: true
});

export function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (data.version === STORAGE_VERSION) {
        Object.assign(gameStats, data.stats);
        Object.assign(preferences, data.preferences);
      }
    }
  } catch (e) {
    console.error('Failed to load from storage:', e);
  }
}

export function saveToStorage() {
  try {
    const data = {
      version: STORAGE_VERSION,
      stats: gameStats,
      preferences: preferences
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to storage:', e);
  }
}

export function recordWin(game: GameType, time: number) {
  if (!gameStats[game]) {
    gameStats[game] = { wins: 0, losses: 0, gamesPlayed: 0 };
  }
  gameStats[game].wins++;
  gameStats[game].gamesPlayed++;
  gameStats[game].lastPlayed = new Date().toISOString();
  
  if (!gameStats[game].bestTime || time < gameStats[game].bestTime) {
    gameStats[game].bestTime = time;
  }
  
  saveToStorage();
}
```

### Rules and Constraints

- ✅ Always wrap localStorage calls in try-catch (quota exceeded errors)
- ✅ Save immediately after stats update (don't batch)
- ✅ Include version field for future data migrations
- ✅ Validate data structure when loading
- ❌ Don't store sensitive data (it's readable in DevTools)
- ⚠️ Keep data size reasonable (5-10MB quota limit)

## Consequences

- ✅ **Benefit**: Zero external dependencies - works out of the box
- ✅ **Benefit**: Works offline - no network required
- ✅ **Benefit**: Simple API - localStorage.setItem/getItem
- ✅ **Benefit**: Instant read/write - no async operations needed
- ✅ **Benefit**: GitHub Pages compatible - no backend needed
- ✅ **Benefit**: 5-10MB storage quota sufficient for statistics
- ❌ **Trade-off**: Per-device only - stats don't sync across devices
- ❌ **Trade-off**: Cleared with browser data - user must be aware
- ❌ **Trade-off**: No leaderboards - can't compare with other players
- ❌ **Trade-off**: No backup - lost if user clears browser data
- 💡 **Neutral**: Visible in DevTools - not secret, but acceptable for game stats
- ⚠️ **Risk**: QuotaExceededError if user's storage is full - mitigate with try-catch and graceful degradation

## Alternatives Considered

### Alternative 1: IndexedDB

Browser database with more storage capacity (~50MB+) and structured queries.

**Rejected because**: 
- Overkill for simple key-value statistics
- Async API adds complexity
- LocalStorage's 5-10MB is sufficient for our needs
- Harder to debug (not visible in Application tab easily)

### Alternative 2: Firebase/Supabase

Cloud-based real-time database with cross-device sync and leaderboards.

**Rejected because**:
- Adds external dependency
- Requires API keys and configuration
- Free tier limits may be hit
- Overkill for MVP statistics
- Against ADR-000 "Simplicity over cleverness"
- Could be reconsidered if leaderboards become a requirement

### Alternative 3: SessionStorage

Browser storage cleared when tab closes.

**Rejected because**:
- Statistics would be lost after closing tab
- Not persistent across sessions (defeats the purpose)

### Alternative 4: Cookies

Small text files sent with every HTTP request.

**Rejected because**:
- 4KB size limit too restrictive
- Sent with every request (unnecessary overhead)
- More complex API than LocalStorage

## Examples

**Recording a win:**

```typescript
// In Klondike.svelte
import { recordWin, recordLoss } from '$lib/statsStore.svelte';

$effect(() => {
  if (isWon) {
    recordWin('klondike', elapsedTime);
  } else if (isLost) {
    recordLoss('klondike');
  }
});
```

**Displaying statistics:**

```typescript
// In GameSelector.svelte
import { gameStats } from '$lib/statsStore.svelte';

<div class="stats">
  <h3>Klondike</h3>
  <p>Wins: {gameStats.klondike?.wins ?? 0}</p>
  <p>Win Rate: {calculateWinRate('klondike')}%</p>
  {#if gameStats.klondike?.bestTime}
    <p>Best Time: {formatTime(gameStats.klondike.bestTime)}</p>
  {/if}
</div>
```

**Error handling:**

```typescript
export function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded, stats not saved');
      // Show user notification: "Storage full, please clear browser data"
    } else {
      console.error('Failed to save stats:', e);
    }
    // Graceful degradation: app continues working without persistence
  }
}
```

## References

- **External Resources**:
  - [MDN: Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
  - [MDN: Storage quota](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
  
- **Related ADRs**:
  - [AGENTS.md](../../AGENTS.md): "Simplicity over cleverness" principle
  - [ADR-002](ADR-002-svelte-5-runes-only.md): $state runes for reactive statistics

- **Related Tasks**:
  - FEAT-XXX: Implement game statistics tracking
  - FEAT-XXX: Add statistics display to game selector
  - FEAT-XXX: Persist user preferences

## Notes

- **Future enhancement**: If cross-device sync becomes a requirement, consider Firebase as upgrade path
- **Future enhancement**: If leaderboards needed, backend will be required (cannot use GitHub Pages)
- **Migration**: Version field enables future data migrations if schema changes
- **Testing**: LocalStorage can be mocked in tests using `jest.localStorage` or similar
