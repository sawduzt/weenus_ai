# 🤖 Agent Context & Onboarding

**Use this prompt when briefing AI agents on the project:**

---

## Quick Briefing Prompt

> You're working on **Weenus AI**, an Electron desktop app that wraps Ollama for local AI chat. Start by reading these three files in order to understand the project:
>
> 1. **README.md** - What the app does and user-facing features
> 2. **PROJSTATUS.md** - Complete architecture, design system, tech stack, and how everything fits together
> 3. **PLAN.md** - Current priorities, what's done, and what's next
> 4. **LOG.md** - Recent changes and decisions (for context on what was just worked on)
>
> **Key facts to know:**
> - Electron 27 + React 18 + TypeScript 5.2 + Ollama API backend
> - Design: Pink bunny aesthetic (#FF6B9D), Lucide icons, rounded UI, system fonts
> - Performance: Removed all backdrop-filters (CSS blur effects), GPU acceleration optional
> - State: Chat, settings, theme via React Context + electron-store persistence
> - Phase 4 (Chat features) is 60% complete; next focus is wiring parameter controls to the API
>
> **File structure overview:**
> - `src/` - React components (pages/, components/, hooks/, services/)
> - `electron/` - Electron main process + preload scripts
> - `docs/` - Technical docs (CHAT_SYSTEM.md) and `docs/archive/` for historical files
>
> Read the files mentioned above first, then ask clarifying questions before making changes. The codebase is well-typed and documented—use `grep_search` to understand patterns before implementing.

---

## What Each Doc Contains

| File | Purpose | When to Read |
|------|---------|--------------|
| **README.md** | Project overview, features, getting started | Always first—for user perspective |
| **PROJSTATUS.md** | Complete architecture, design language, tech stack, roadmap | Understanding the "why" and "how" |
| **PLAN.md** | Phase status, immediate priorities, next steps | Knowing what to work on |
| **LOG.md** | Session history, recent changes, metrics | Understanding recent decisions |
| **CHAT_SYSTEM.md** (in docs/) | Multi-chat implementation details | If working on chat features |
| **docs/archive/** | Historical status docs | Reference only; not current |

---

## How to Work Effectively

1. **Read docs first** before touching code—they're the source of truth
2. **Use `grep_search`** to find patterns (e.g., "useChat" to see how the hook is used)
3. **Check `PROJSTATUS.md`** section "Known Issues" before assuming something is a bug
4. **Update `LOG.md`** when done—add a session entry so future agents know what changed
5. **Keep the three-file system clean**: PROJSTATUS (reference), PLAN (action), LOG (history)

---
