# Svelte Solitaire Collection

A collection of classic solitaire card games built with Svelte 5, TypeScript and Vite.

This project primarily serves as an AI-assisted development experiment:
it explores structured agent guidance, architectural constraints, and rule-based game implementations.

🎮 **[Live demo](https://kirsirinnesalo.github.io/svelte-solitaire/)**


## 🎯 Project Goals

- Experiment with AI agent–driven development workflows
- Define explicit architectural constraints for automated contributors
- Keep game rules deterministic and testable
- Build a playable personal solitaire collection

The games are real.

The architecture is intentional.


## 🧱 Architectural Constraints

Each game implementation is split into two clearly separated layers:

1. UI Layer
  - Svelte component
  - Responsible only for rendering and user interaction

2. Rules Layer
  - Pure TypeScript module
  - No UI dependencies
  - Deterministic state transitions
  - Fully testable in isolation

Rules modules:
  - Do not access DOM
  - Do not mutate external state
  - Expose explicit move validation and state updates

These constraints exist primarily to make AI-generated changes predictable and auditable.


## 🎮 Games

- **Klondike** - Classic draw-and-build solitaire
- **Napoleon's Tomb** - Strategic foundation-building variant
- **Aces Up** - Fast elimination-style solitaire
- **Clock** - Luck based circular placement game

Each game follows the same structural contract between UI and rules engine.


## 🚀 Getting Started

```bash
npm install       # Install dependencies
npm run dev       # Development server at http://localhost:5173
npm run build     # Production build
npm run preview   # Preview production build
npm run check     # TypeScript validation
npm run test      # Run tests
```

## 📚 Development Documentation

- **[AGENTS.md](AGENTS.md)** - Development guide for AI agents and maintainers
- **[agents/tasks/backlog.md](agents/tasks/backlog.md)** - Task backlog and roadmap
- **[docs/adrs/](docs/adrs/)** - Architecture Decision Records


## 📝 License

MIT License - see [LICENSE](LICENSE) for details.
