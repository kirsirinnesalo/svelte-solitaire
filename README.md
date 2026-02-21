# Pasianssit – Solitaire Collection

A single-page app featuring a collection of classic solitaire card games, built with Svelte 5.

---

## 🎮 Current Features

### Card Games

- ✅ **Klondike** - Classic solitaire
- ✅ **Napoleon's Tomb** - Strategic single-deck solitaire
- ✅ **Aces Up** - Quick elimination game
- ✅ **Clock** - Build the clock by placing cards on their hours

### Game Features

- ✅ **Drag & drop** - Intuitive card movement
- ✅ **Undo/Redo** - Full history support
- ✅ **Game settings** - Customizable rules per game
- ✅ **Card back selection** - Multiple designs
- ✅ **Move counter** - Track your efficiency
- ✅ **Timer** - Optional time tracking
- ✅ **Auto-complete** - Smart foundational moves (Klondike)
- ✅ **Pause overlay** - Pause without showing cards

### Infrastructure

- ✅ **Svelte 5 runes** - Modern reactive state (ADR-002)
- ✅ **TypeScript strict** - Full type safety
- ✅ **Component architecture** - Reusable UI components
- ⏳ **Testing** - Vitest setup in progress

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
