# Pasianssit – Solitaire Collection

A single-page app featuring a collection of classic solitaire card games, built with Svelte 5, TypeScript and Vite.

🎮 **[Live demo](https://kirsirinnesalo.github.io/svelte-solitaire/)**

---

## 🚀 Getting Started

```bash
npm install       # Install dependencies
npm run dev       # Development server at http://localhost:5173
npm run build     # Production build
npm run preview   # Preview production build
npm run check     # TypeScript validation
npm run test      # Run tests
```

## 🎮 Current Features

### Games

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
- ⏳ **Testing** - Vitest setup in progress

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
├── games/               # Game implementations
│   └── {game}/
│       ├── {Game}.svelte      # UI component
│       └── {game}Rules.ts     # Pure game logic (testable)
├── lib/                 # Utilities and shared logic
├── types/               # TypeScript type definitions
├── App.svelte           # Root component
└── main.ts              # Application entry point
```

## 🏗️ Architecture

- **Runes-only** - Svelte 5 runes, no legacy patterns ([ADR-002](agents/adrs/ADR-002-svelte-5-runes-only.md))
- **Separation of concerns** - UI components (`*.svelte`) + pure game logic (`*Rules.ts`)
- **Callback props** - Component communication via props, not events ([ADR-003](agents/adrs/ADR-003-callback-props-over-event-dispatchers.md))
- **TDD workflow** - Test-first development ([ADR-001](agents/adrs/ADR-001-test-driven-development.md))

For detailed architectural decisions, see [agents/adrs/](agents/adrs/).

## 📚 Documentation

- **[AGENTS.md](AGENTS.md)** - Development guide for AI agents and maintainers
- **[agents/adrs/](agents/adrs/)** - Architecture Decision Records
- **[agents/tasks/backlog.md](agents/tasks/backlog.md)** - Task backlog and roadmap

## 🤝 Contributing

1. Read [AGENTS.md](AGENTS.md) for workflow and conventions
2. Check [agents/tasks/backlog.md](agents/tasks/backlog.md) for available tasks
3. Follow TDD: Write test first, then implement
4. Use feature branches with Conventional Commits
5. Ensure all tests pass before merging

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.
