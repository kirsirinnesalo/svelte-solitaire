# Pasianssit – Solitaire Collection

A single-page app featuring a collection of classic solitaire card games, built with Svelte 5.

---

## 🤖 For AI Agents

**Read these first before starting any task:**

1. [AGENTS.md](AGENTS.md) - Complete development guide
2. [ADR-000](agents/adrs/ADR-000-agent-guidance.md) - Project DNA and conventions
3. [Pre-flight Checklist](AGENTS.md#️-pre-flight-checklist) - Before starting any task
4. [Task Backlog](agents/tasks/backlog.md) - Available tasks

**Core workflow:**
- ONE task at a time (complete fully before starting next)
- Create feature branch for each task (`feat/TASK-ID-description`)
- TDD workflow (tests first, red-green-refactor)
- Merge with `--no-ff` when complete

---

## 🎮 Current Features

### Card Games

- ✅ **Klondike** - Classic solitaire
- ✅ **Napoleon's Tomb** - Strategic single-deck solitaire
- ✅ **Aces Up** - Quick elimination game
- ✅ **Clock** - Build the clock by placing cards on their hours

### Game Features

- ✅ **Drag & drop** - Intuitive card movement
- ✅ **Undo/Redo** - Full history support (TECH-005: unified undo manager)
- ✅ **Game settings** - Customizable rules per game
- ✅ **Card back selection** - Multiple designs (BUG-001: localStorage persistence)
- ✅ **Move counter** - Track your efficiency
- ✅ **Timer** - Optional time tracking
- ✅ **Auto-complete** - Smart foundational moves (Klondike)
- ✅ **Pause overlay** - Pause without showing cards

### Infrastructure

- ✅ **Svelte 5 runes** - Modern reactive state (ADR-002)
- ✅ **TypeScript strict** - Full type safety
- ✅ **Component architecture** - Reusable UI components
- ⏳ **Testing** - Vitest setup in progress (TECH-001)

## 🚀 Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:5173
```

### Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Development Commands

```bash
# Type checking
npm run check

# Run tests (when available)
npm run test

# Watch mode for tests
npm run test -- --watch
```

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CardComponent.svelte   # Single card component
│   └── GameSelector.svelte    # Game selection menu
├── games/              # Game implementations
│   ├── {game}/         # Each game in its own folder
│   │   ├── {Game}.svelte      # UI component
│   │   └── {game}Rules.ts     # Pure game logic
├── lib/                # Utilities and shared logic
│   └── cardUtils.ts    # Card and game utilities
├── types/              # TypeScript type definitions
│   └── game.ts
├── App.svelte          # Root component
├── main.ts             # Application entry point
└── app.css             # Global styles
```

**Example**: Klondike game structure:
- `games/klondike/Klondike.svelte` - UI and user interactions
- `games/klondike/klondikeRules.ts` - Game logic
- `games/klondike/klondikeRules.test.ts` - Tests

## 🎴 Games

### Klondike
Classic solitaire with seven tableau piles. Goal is to build up foundations by suit in ascending order.
- Draw 1 or 3 cards from deck

### Napoleon's Tomb
Strategic solitaire where the goal is to build Napoleon's tomb and surround it with guards.
- **Napoleon's tomb (center)**: Build down 6→5→4→3→2→A, four rounds
- **4 guards (corners)**: Build up 7→8→9→10→J→Q→K (7 cards each)
- **4 reserve piles**: Temporary storage, max 1 card per pile
- Only one card can be moved at a time
- Challenging but rewarding game

### Aces Up
Quick and simple solitaire with 4 piles.
- Goal: leave only aces
- Remove cards by clicking
- Automatic "can remove" detection

### Clock
Solitaire based on an analog clock face.
- Cards arranged like a clock: 12 positions around the dial, kings in the center
- Click a pile to reveal its top card
- Place each card in its clock position (A=1 o'clock, 2=2 o'clock, ..., Q=12 o'clock, K=center)
- Win by revealing all cards before placing the 4th king

### Coming Soon
- **Pyramid**: Remove pairs that sum to 13
- **Yukon**: Like Klondike with more strategic options
- **Perpetual Motion**: Endless solitaire with continuous shuffling

## 🛠️ Technologies

- **Svelte 5** - Modern reactive framework
- **TypeScript 5** - Full type safety with strict mode
- **Vite 7** - Lightning-fast dev server and build tool
- **Vitest** - Unit testing framework (in setup)

## 🏗️ Architecture

- **Runes-only** - Svelte 5 runes, no legacy patterns ([ADR-002](agents/adrs/ADR-002-svelte-5-runes-only.md))
- **Separation of concerns** - UI components (`*.svelte`) + pure game logic (`*Rules.ts`)
- **Callback props** - Component communication via props, not events ([ADR-003](agents/adrs/ADR-003-callback-props-over-event-dispatchers.md))
- **TDD workflow** - Test-first development ([ADR-001](agents/adrs/ADR-001-test-driven-development.md))

For detailed architectural decisions, see [agents/adrs/](agents/adrs/).

## 📚 Documentation

- **[AGENTS.md](AGENTS.md)** - Complete development guide for AI agents and maintainers
- **[agents/adrs/](agents/adrs/)** - Architecture Decision Records
- **[agents/tasks/backlog.md](agents/tasks/backlog.md)** - Current task backlog and roadmap
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - GitHub Copilot instructions (Finnish)

## 🤝 Contributing

1. Read [AGENTS.md](AGENTS.md) for workflow and conventions
2. Check [agents/tasks/backlog.md](agents/tasks/backlog.md) for available tasks
3. Follow TDD: Write test first, then implement
4. Use feature branches with Conventional Commits
5. Ensure all tests pass before merging

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.
