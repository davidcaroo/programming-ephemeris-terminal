# Programming Ephemeris Terminal - AI Coding Instructions

## Project Overview
This is a retro-style terminal interface that displays programming history ephemerides (historical events). Built with Next.js 15, React 19, and uses a terminal aesthetic with typewriter effects.

## Architecture & Key Components

### Core Structure
- **Single-page app**: All functionality in `TerminalEphemeris` component (`components/terminal-ephemeris.tsx`)
- **Shadcn/ui design system**: Pre-built components in `components/ui/` using Radix UI primitives
- **App Router**: Next.js 15 with App Router structure (`app/` directory)

### Data Model
```typescript
// Ephemeris structure (hardcoded array in terminal-ephemeris.tsx)
const ephemerides = [
  {
    date: "YYYY-MM-DD",
    event: "Historical programming event description"
  }
]
```

### State Management Patterns
- **Local React state** with useState hooks for all interactions
- **Key state variables**:
  - `currentCommand`: Input field value
  - `commandHistory`: Array of executed commands and outputs
  - `ephemerisKey`: Forces TypewriterText re-render on refresh
  - `isRefreshing`: Prevents input during ephemeris updates

### Terminal Command System
Commands are handled in `handleCommand()` switch statement:
- `refresh`: Randomly selects new ephemeris + re-renders typewriter
- `help`: Shows available commands
- `history`: Displays command history
- `clear`: Empties command history array
- `exit`: Shows goodbye message

## Development Workflow

### Setup & Running
```bash
npm install --legacy-peer-deps  # Required due to React 19 peer deps
npm run dev                     # Start development server on :3000
```

### Styling Conventions
- **Terminal aesthetic**: Black background, green text, monospace fonts
- **Color scheme**: 
  - Orange (`text-orange-400`): Prompts and command names
  - Green (`text-green-400`): User input and primary text
  - Blue (`text-blue-400`): Directory indicators
- **Utility-first CSS**: Tailwind with no custom CSS files
- **Component composition**: Use `cn()` helper for conditional classes

### Component Patterns
- **"use client"** directive required for interactive components
- **TypeScript interfaces** for all prop types
- **Ref patterns**: `useRef<HTMLInputElement>` for input focus management
- **Effect cleanup**: Always return cleanup functions from useEffect

### UI Component Usage
- Import from `@/components/ui/` for shadcn components
- Use `@/` path alias consistently (configured in tsconfig.json)
- Leverage Radix UI primitives through shadcn wrappers

## Critical Implementation Details

### TypewriterText Component
- Takes `key` prop to force re-render on content change
- Uses `setTimeout` with cleanup for character-by-character display
- Shows animated cursor (`█`) while typing

### Form Handling
- `onSubmit` prevents default and calls `handleCommand()`
- Input disabled during `isRefreshing` state
- Auto-focus maintained on input field

### Animation Timing
- TypewriterText: 50ms per character for ephemeris display
- Command refresh: 1.5s delay to simulate loading
- Boot sequence: Staggered timeouts for terminal startup

## Common Gotchas
- Install with `--legacy-peer-deps` flag (React 19 compatibility)
- Build ignores TypeScript/ESLint errors (see next.config.mjs)
- No Tailwind config file - uses Tailwind v4 via PostCSS
- Ephemeris data is hardcoded - extend the array for new entries

## Adding New Features
- **New commands**: Add cases to `handleCommand()` switch statement
- **New ephemerides**: Add objects to `ephemerides` array
- **UI components**: Use shadcn/ui or create in `components/`
- **Styling**: Follow terminal color scheme and monospace typography
