# ADR-001: Test-Driven Development Mandate

**Status**: Accepted  
**Date**: 2026-01-26  
**Deciders**: Project Team  
**Tags**: #testing #tdd #workflow #quality

## Context

The project initially launched without a test suite, prioritizing rapid prototyping and feature implementation. Now with 4 games implemented and a stable architecture emerging, the codebase needs tests to:

1. **Prevent Regressions**: Game logic is complex, changes can break existing features
2. **Enable Refactoring**: Can't safely refactor without test safety net
3. **Document Behavior**: Tests serve as living documentation
4. **Improve Design**: TDD encourages better separation of concerns
5. **AI Agent Confidence**: Agents need tests to verify their changes work

Current state:
- ✅ Pure game logic in `*Rules.ts` files (testable)
- ✅ Svelte components separated from logic (testable)
- ✅ TypeScript strict mode (type safety)
- ❌ No test framework installed
- ❌ No existing tests
- ❌ No TDD workflow established

## Decision

We will adopt **Test-Driven Development (TDD)** as the mandatory workflow for all new features and bug fixes.

### Core Principle

**Write tests first, then implementation.**

```
RED → GREEN → REFACTOR
```

1. **RED**: Write a failing test that describes desired behavior
2. **GREEN**: Write minimal code to make the test pass
3. **REFACTOR**: Improve code while keeping tests green

### Testing Framework

**Vitest** + **Testing Library** for Svelte

```bash
npm install -D vitest @testing-library/svelte @testing-library/jest-dom
```

**Rationale**:
- Vitest: Fast, Vite-native, modern API
- Testing Library: Component testing, user-centric
- Jest-DOM: Helpful matchers (`toBeInTheDocument`)

### Test Coverage Targets

| Category | Target | Priority |
|----------|--------|----------|
| Pure functions (`*Rules.ts`) | 100% | Critical |
| Component logic | 80%+ | High |
| UI rendering | 60%+ | Medium |
| Overall project | 90%+ | High |

### What to Test (Priority Order)

#### 1. Pure Game Logic (Critical) 🔴

**Files**: `*Rules.ts` (klondikeRules.ts, napoleonRules.ts, etc.)

**Test everything**:
```typescript
// klondikeRules.test.ts
describe('moveCard', () => {
  it('allows valid moves', () => {
    const state = createTestState();
    const result = moveCard(state, fromLocation, toLocation);
    expect(result.valid).toBe(true);
  });

  it('rejects invalid moves', () => {
    const state = createTestState();
    const result = moveCard(state, fromLocation, invalidLocation);
    expect(result.valid).toBe(false);
  });
});

describe('isGameWon', () => {
  it('returns true when all foundations complete', () => {
    const wonState = createWonState();
    expect(isGameWon(wonState)).toBe(true);
  });
});
```

**Why critical**: Game logic is the core value, must be bulletproof.

#### 2. Utility Functions (High) 🟠

**Files**: `cardUtils.ts`, `dragUtils.ts`

```typescript
// cardUtils.test.ts
describe('getRankValue', () => {
  it('returns 1 for Ace', () => {
    expect(getRankValue('A')).toBe(1);
  });

  it('returns 13 for King', () => {
    expect(getRankValue('K')).toBe(13);
  });
});
```

#### 3. Component Interactions (High) 🟠

**Files**: `*.svelte` components

```typescript
// GameSelector.test.ts
describe('GameSelector', () => {
  it('calls callback when game selected', async () => {
    const mockCallback = vi.fn();
    render(GameSelector, { onselectgame: mockCallback });
    
    await fireEvent.click(screen.getByText('Klondike'));
    
    expect(mockCallback).toHaveBeenCalledWith('klondike');
  });
});
```

#### 4. Integration Tests (Medium) 🟡

**Test complete game flows**:

```typescript
describe('Klondike game flow', () => {
  it('completes full game to win state', () => {
    // Initialize game
    // Make series of moves
    // Verify win condition
  });
});
```

#### 5. Visual Regression (Low - Manual) 🟢

Manual verification for:
- Layout on different screen sizes
- Color contrast
- Animation smoothness

### TDD Workflow

#### For New Features (FEAT-XXX)

```bash
# 1. Create test file first
touch src/games/myGame/myGameRules.test.ts

# 2. Write failing test
describe('myNewFeature', () => {
  it('does something', () => {
    expect(myFunction()).toBe(expectedValue);
  });
});

# 3. Run tests (watch mode)
npm run test -- --watch

# 4. Implement minimum code to pass
export function myFunction() {
  return expectedValue;
}

# 5. Test passes → Refactor
# Improve code, tests stay green

# 6. Commit with test + implementation
git add .
git commit -m "FEAT-001: Add new feature with tests"
```

#### For Bug Fixes (BUG-XXX)

```bash
# 1. Write test that reproduces bug
it('should handle edge case', () => {
  expect(buggyFunction(edgeCase)).toBe(correctResult);
  // ❌ This fails initially
});

# 2. Fix bug
// Modify implementation

# 3. Test passes → Bug fixed
# ✅ Test now passes

# 4. Verify no regressions
npm run test

# 5. Commit
git commit -m "BUG-001: Fix edge case handling"
```

#### For Refactoring (TECH-XXX)

```bash
# 1. Ensure existing tests pass
npm run test
# All green ✅

# 2. Refactor code
// Improve structure, extract functions, etc.

# 3. Run tests frequently
npm run test -- --watch

# 4. Keep tests green throughout
# If test fails, revert or fix

# 5. Commit when complete
git commit -m "TECH-001: Extract shared undo logic"
```

## Consequences

### Positive

1. **Confidence**: Tests catch regressions immediately
2. **Better Design**: TDD encourages smaller, focused functions
3. **Documentation**: Tests show how code is meant to be used
4. **Faster Debugging**: Failing test pinpoints exact issue
5. **Refactoring Safety**: Can improve code without fear
6. **AI Agent Success**: Agents can verify their changes work
7. **Onboarding**: New contributors understand codebase through tests

### Negative

1. **Initial Slowdown**: Writing tests takes time upfront
2. **Learning Curve**: Team must learn testing tools
3. **Maintenance**: Tests need updates when requirements change
4. **False Security**: Bad tests give false confidence
5. **Existing Code**: Must add tests to legacy code gradually

### Mitigation

- **Templates**: Provide test templates for common patterns
- **Examples**: Reference existing tests as models
- **Incremental**: Add tests to existing code when modifying
- **Code Review**: Ensure tests are meaningful, not just coverage
- **Tooling**: Fast test runner (Vitest) minimizes wait time

## Implementation Plan

### Phase 1: Setup (TECH-001) 🔴

```bash
# Install dependencies
npm install -D vitest @testing-library/svelte @testing-library/jest-dom

# Configure Vitest
# Create vitest.config.ts

# Add npm scripts
"test": "vitest run"
"test:watch": "vitest"
"test:coverage": "vitest --coverage"

# Commit setup
git commit -m "TECH-001: Add Vitest testing infrastructure"
```

### Phase 2: Test Existing Rules (TECH-002 to TECH-005) 🟠

Add tests to existing game logic:

- TECH-002: Test klondikeRules.ts (exists, expand)
- TECH-003: Test napoleonRules.ts (exists, expand)
- TECH-004: Test acesUpRules.ts (create)
- TECH-005: Test clockRules.ts (create)

Target: 100% coverage of `*Rules.ts` files

### Phase 3: Test Utilities (TECH-006) 🟡

- cardUtils.ts tests
- dragUtils.ts tests

### Phase 4: Component Tests (TECH-007+) 🟢

Gradually add component tests:
- GameSelector
- CardComponent
- GameHeader
- Setting toggles

### Phase 5: Integration Tests (TECH-020+) 🟢

Full game flow tests:
- Complete Klondike game
- Napoleon game scenarios
- Edge cases

### Enforcement

**Required for all new code**:
- [ ] FEAT tasks include tests
- [ ] BUG tasks include regression test
- [ ] TECH refactoring maintains test coverage
- [ ] Code review checks for tests

**AI Agents must**:
1. Write test first (RED)
2. Implement feature (GREEN)
3. Refactor if needed (REFACTOR)
4. Run `npm run test` before committing
5. Ensure no test failures

## Testing Patterns

### Test File Naming

```
src/games/klondike/klondikeRules.ts
src/games/klondike/klondikeRules.test.ts  ← Same name + .test
```

### Test Annotations

Every test file should include annotations linking tests to tasks and architectural decisions:

```typescript
/**
 * @covers FEAT-001
 * @description Card movement animation tests
 * @constrainedBy ADR-001, ADR-004
 */
import { describe, it, expect } from 'vitest';
import { animateCard } from './cardAnimations';

describe('Card animations', () => {
  /**
   * @covers FEAT-001
   */
  it('animates card from tableau to foundation', () => {
    // test implementation
  });
});
```

**Annotations**:
- `@covers` - Lists task IDs that this test covers (FEAT-XXX, TECH-XXX, BUG-XXX)
- `@constrainedBy` - References ADRs that constrain implementation
- `@description` - Human-readable test purpose

**Benefits**:
- Traceability: Link test coverage back to requirements
- Impact analysis: Find all tests for a task
- Architecture awareness: See which ADRs affect this code
- Documentation: Tests serve as feature documentation

### Test Structure

```typescript
// AAA Pattern: Arrange, Act, Assert
describe('functionName', () => {
  it('describes expected behavior', () => {
    // Arrange - setup test data
    const input = createTestData();
    
    // Act - call function
    const result = functionUnderTest(input);
    
    // Assert - verify result
    expect(result).toBe(expectedValue);
  });
});
```

### Test Helpers

```typescript
// testHelpers.ts
export function createTestCard(suit: Suit, rank: Rank): Card {
  return {
    suit,
    rank,
    faceUp: true,
    id: `${suit}-${rank}`
  };
}

export function createKlondikeState(overrides?: Partial<KlondikeState>): KlondikeState {
  return {
    tableau: [[], [], [], [], [], [], []],
    foundations: [[], [], [], []],
    stock: [],
    waste: [],
    ...overrides
  };
}
```

### Mocking Callbacks

```typescript
// Mock callback prop
const mockCallback = vi.fn();

render(MyComponent, { onAction: mockCallback });

// Trigger action
await fireEvent.click(screen.getByRole('button'));

// Verify callback called
expect(mockCallback).toHaveBeenCalledTimes(1);
expect(mockCallback).toHaveBeenCalledWith(expectedData);
```

## Examples

### Example 1: Pure Function Test

```typescript
// klondikeRules.test.ts
import { describe, it, expect } from 'vitest';
import { canStackOnTableau } from './klondikeRules';
import { createTestCard } from '../testHelpers';

describe('canStackOnTableau', () => {
  it('allows red card on black card of higher rank', () => {
    const blackCard = createTestCard('spades', '7');
    const redCard = createTestCard('hearts', '6');
    
    expect(canStackOnTableau(redCard, blackCard)).toBe(true);
  });

  it('rejects same color cards', () => {
    const blackCard = createTestCard('spades', '7');
    const anotherBlackCard = createTestCard('clubs', '6');
    
    expect(canStackOnTableau(anotherBlackCard, blackCard)).toBe(false);
  });

  it('rejects wrong rank difference', () => {
    const blackCard = createTestCard('spades', '7');
    const redCard = createTestCard('hearts', '5'); // Skip rank 6
    
    expect(canStackOnTableau(redCard, blackCard)).toBe(false);
  });
});
```

### Example 2: Component Test

```typescript
// GameSelector.test.ts
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import GameSelector from './GameSelector.svelte';

describe('GameSelector', () => {
  it('displays all games', () => {
    render(GameSelector, { onselectgame: vi.fn() });
    
    expect(screen.getByText('Klondike')).toBeInTheDocument();
    expect(screen.getByText('Napoleon\'s Tomb')).toBeInTheDocument();
    expect(screen.getByText('Aces Up')).toBeInTheDocument();
    expect(screen.getByText('Clock')).toBeInTheDocument();
  });

  it('calls callback with game ID when clicked', async () => {
    const mockSelect = vi.fn();
    render(GameSelector, { onselectgame: mockSelect });
    
    await fireEvent.click(screen.getByText('Klondike'));
    
    expect(mockSelect).toHaveBeenCalledWith('klondike');
  });
});
```

## Coverage Reporting

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

Target thresholds in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      lines: 90,
      functions: 90,
      branches: 85,
      statements: 90
    }
  }
});
```

## References

- **Vitest Documentation**: https://vitest.dev/
- **Testing Library**: https://testing-library.com/docs/svelte-testing-library/intro
- **TDD by Example**: Kent Beck
- **Related ADRs**:
  - [ADR-000](ADR-000-agent-guidance.md): Project workflow
  - [ADR-002](ADR-002-svelte-5-runes-only.md): Svelte patterns (impacts testing)

## Notes

TDD is **not optional** for this project going forward. Every new feature, bug fix, and refactoring must follow the red-green-refactor cycle.

**Key insight**: TDD is slower upfront but much faster over the project lifetime. The first feature with tests takes longer; the 10th feature is faster because you trust your changes don't break anything.

**For AI Agents**: Run `npm run test -- --watch` in a separate terminal and keep it running. Watch for test failures as you code. Never commit failing tests.

**Remember**: A test is only valuable if it can fail. If you can't imagine a scenario where the test fails, it's not testing anything meaningful.
