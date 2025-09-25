# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Open Code Chat is a Vue 3 + TypeScript web application that provides a multi-project, multi-session chat interface for interacting with OPENCODE AI. The application supports project switching and session management with real-time chat capabilities.

## Development Commands

```bash
# Start development server
pnpm dev

# Start OPENCODE server (required for API communication)
pnpm opencode

# Build for production (includes type checking)
pnpm build

# Preview production build
pnpm preview

# Install dependencies
pnpm install
```

**Important**: The OPENCODE server must be running (`pnpm opencode`) for the frontend to function properly. It serves the API on port 4096.

## Architecture

### Frontend Stack

- **Vue 3** with Composition API and TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn-vue** (Reka UI) for UI components
- **@opencode-ai/sdk** for API communication

### Project Structure

- `src/components/messages/` - Chat message display and input components
- `src/components/project-selector/` - Project management UI
- `src/components/session-selector/` - Session management UI
- `src/components/ui/` - Reusable shadcn-vue components
- `src/services/` - API client and data services
- `src/types/` - TypeScript type definitions
- `src/lib/` - Utility functions

### Key Architectural Patterns

**State Management**: Uses Vue 3 Composition API with refs/reactive objects. No external state management library.

**Real-time Updates**: Event subscription system with AbortController for cleanup. Messages stream in real-time from the OPENCODE API.

**Message Handling**: Custom logic merges consecutive assistant messages and handles different message part types (text, files, patches).

**Multi-tenancy**: Supports switching between OPENCODE projects, each with multiple chat sessions.

## API Integration

The application communicates with OPENCODE through `@opencode-ai/sdk`. Key service file: `src/services/opencode.ts`

- Uses event-driven streaming for real-time message updates
- Handles permission requests through UI prompts
- Full TypeScript coverage for API responses

## Configuration Files

- `components.json` - shadcn-vue component configuration
- `opencode.json` - OPENCODE permissions configuration
- `vite.config.ts` - Vite build configuration with Vue and Tailwind plugins
- `tsconfig.json` - TypeScript project references (multi-config setup)

## Development Notes

**Package Manager**: This project uses pnpm (locked to version 9.15.9). Use `pnpm` commands instead of `npm`.

**No Testing Framework**: Currently no test framework is configured. Consider adding Vitest if implementing tests.

**No Linting**: No ESLint or Prettier configuration exists. Consider adding if implementing code quality tools.

**Component Development**: When adding new components, follow the existing patterns:

- Use Vue 3 Composition API
- Place in appropriate feature directory (`messages/`, `project-selector/`, etc.)
- Reusable components go in `ui/`
- Import UI components from `@/components/ui/`
