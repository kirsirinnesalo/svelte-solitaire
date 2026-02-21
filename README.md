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

## 🎮 Games

- **Klondike** - Classic solitaire
- **Napoleon's Tomb** - Strategic single-deck solitaire
- **Aces Up** - Quick elimination game
- **Clock** - Build the clock by placing cards on their hours

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
