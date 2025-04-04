```text
src/
├── assets/
│   ├── fonts/            // Custom fonts and font files
│   ├── images/           // Static images, photos, illustrations
│   └── icons/            // SVG icons and icon files
├── components/
│   ├── common/           // Reusable UI components used across multiple features
│   │   ├── Button/       // Examples: Button, Input, Card, Modal, Dropdown, Checkbox
│   │   │   ├── Button.tsx               // Should be stateless when possible and highly reusable
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.module.scss
│   │   │   └── index.ts
│   │   └── ...
│   ├── layout/           // Components that define the overall structure of pages
│   │   ├── Header/       // Examples: Header, Footer, Sidebar, MainContent, Layout
│   │   ├── Footer/       // Handles arrangement of the page and consistent UI containers
│   │   └── ...
│   └── features/         // Feature-specific components that are not meant to be reused globally
│       ├── Auth/         // Organized by domain/feature (e.g., Auth, Dashboard, Profile)
│       ├── Dashboard/    // May contain complex business logic specific to that feature
│       └── ...           // Can be composed of many common components
├── hooks/
│   ├── useDebounce.ts    // Custom React hooks for reusable stateful logic
│   ├── useForm.ts        // Separates logic from UI components
│   └── ...
├── pages/
│   ├── Home/             // Page components that combine layouts and features
│   │   ├── Home.tsx      // Usually correspond to routes in the application
│   │   ├── Home.module.scss
│   │   └── index.ts
│   ├── Dashboard/
│   └── ...
├── services/
│   ├── api.ts            // API client setup and configuration
│   ├── auth.service.ts   // Service modules for different API endpoints
│   └── ...               // Handles data fetching, authentication, etc.
├── store/
│   ├── slices/           // Redux toolkit slices or other state management
│   │   ├── auth.slice.ts // Organized by domain/feature
│   │   └── ...
│   ├── store.ts          // Store configuration
│   └── hooks.ts          // Custom hooks for accessing store
├── styles/
│   ├── abstracts/        // Contains SCSS variables, functions, and mixins
│   │   ├── _variables.scss  // colors, fonts, spacings, breakpoints
│   │   ├── _mixins.scss     // reusable style patterns (e.g., flexCenter, responsive)
│   │   └── ...              // No actual CSS output, just helpers used by other files
│   ├── base/             // Contains global base styles and resets
│   │   ├── _reset.scss      // normalizes browser default styles
│   │   ├── _typography.scss // base text styles, headings, paragraphs
│   │   └── ...              // Core styles that apply to the entire application
│   ├── global.scss       // Main SCSS file that imports all other SCSS files
│   └── index.scss        // Entry point for global styles
├── types/
│   ├── auth.types.ts     // TypeScript type definitions and interfaces
│   ├── common.types.ts   // Organized by domain/feature
│   └── ...
├── utils/
│   ├── format.ts         // Utility functions for data formatting, validation, etc.
│   ├── validation.ts     // Pure functions that can be used anywhere in the app
│   └── ...
├── App.tsx               // Main application component
├── index.tsx             // Application entry point
└── routes.tsx            // Route definitions and configuration

```
