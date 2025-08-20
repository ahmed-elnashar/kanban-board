# Kanban Board - Task Management Application

A modern, responsive Kanban board application built with React, TypeScript, and Vite. Features drag-and-drop task management, real-time updates, keyboard shortcuts, and local storage persistence.

## 🚀 Live Demo

[Deployed Version](https://kanban-board-ua6i.vercel.app/)

## ✨ Features

- **Drag & Drop**: Intuitive task management with @dnd-kit
- **Real-time Updates**: Instant UI updates with Zustand state management
- **Responsive Design**: Mobile-first approach with CSS Modules
- **Keyboard Shortcuts**: Quick actions (Ctrl+K for search, Ctrl+H for history)
- **Task History**: Track all task operations with timestamps
- **Local Storage**: Persistent data storage across sessions
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **Styling**: CSS Modules
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + TypeScript ESLint

## 📁 Project Structure

```
kanban-board/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── AddTask/           # Task creation component
│   │   ├── Board/             # Main board container
│   │   ├── Column/            # Individual column component
│   │   ├── DndProvider/       # Drag & drop context
│   │   ├── Filter/            # Search and filter controls
│   │   ├── KeyboardShortcuts/ # Keyboard shortcuts modal
│   │   ├── LoadingSpinner/    # Loading indicator
│   │   └── Task/              # Individual task component
│   ├── hooks/
│   │   ├── useKanbanData.ts   # Data fetching and processing
│   │   ├── useTaskOperations.ts # Task CRUD operations
│   │   └── useKeyboardShortcuts.ts # Global keyboard shortcuts
│   ├── store/
│   │   └── kanbanStore.ts     # Zustand store configuration
│   ├── test/
│   │   ├── setup.ts           # Test environment setup
│   │   └── test-utils.tsx     # Custom test utilities
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── utils/
│   │   └── helpers.ts         # Utility functions
│   ├── App.tsx                # Main application component
│   ├── index.css              # Global styles
│   └── main.tsx               # Application entry point
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🏗️ Architecture Overview

### **State Management**

- **Zustand Store**: Centralized state for tasks, columns, and UI state
- **Local Storage**: Persistent data storage with automatic sync
- **Optimistic Updates**: Immediate UI feedback with rollback on errors

### **Component Architecture**

- **Atomic Design**: Small, focused components with clear responsibilities
- **Custom Hooks**: Business logic separated from UI components
- **CSS Modules**: Scoped styling to prevent conflicts

### **Data Flow**

1. User interactions trigger store actions
2. Store updates trigger component re-renders
3. Changes automatically persist to localStorage
4. Optimistic updates provide instant feedback

### **Performance Optimizations**

- **React.memo**: Prevents unnecessary re-renders
- **useMemo**: Cached computed values
- **Lazy Loading**: Components loaded on demand
- **Efficient Re-renders**: Minimal DOM updates

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd kanban-board

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Run tests with UI
```

## 🧪 Testing

The project includes comprehensive testing with **134 passing tests**:

- **Unit Tests**: Component behavior, utility functions
- **Integration Tests**: Hook interactions, store operations
- **Accessibility Tests**: ARIA labels, keyboard navigation
- **Performance Tests**: Utility function efficiency

### Test Structure

```
src/components/*/__tests__/     # Component tests
src/utils/__tests__/            # Utility function tests
src/test/                       # Test utilities and setup
```

## 📊 Development Metrics

- **Time Spent**: ~5 hours
- **Lines of Code**: ~2,000+
- **Test Coverage**: 100% of components and utilities
- **Bundle Size**: Optimized with Vite

## 🔧 Shortcuts & AI Assistance

- **Claude AI**: Used for initial project structure and component design

