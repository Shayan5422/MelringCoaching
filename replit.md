# MELRING - Coaching par la Boxe

## Overview

MELRING is a premium boxing coaching and fitness training service with a strong focus on personal transformation and empowerment. The application is a single-page marketing website built with React, TypeScript, and Express that showcases the brand's philosophy, services, pricing, and team-building offerings. It features a luxury sports-inspired design with a black, white, and gold color scheme, and includes contact and booking forms for lead generation.

The site emphasizes emotional connection and transformation, targeting women, men, parents, children, and professionals through various training formats including HIIT, cardio, boxing sessions, and corporate team-building events.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for component-based UI development
- **Vite** as the build tool and development server, configured for fast HMR and optimized production builds
- **Wouter** for client-side routing (lightweight alternative to React Router)
- Single-page application (SPA) architecture with section-based navigation using smooth scroll

**UI Component System**
- **shadcn/ui** components (New York style) built on Radix UI primitives
- Component library includes forms, dialogs, toasts, buttons, inputs, and layout components
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables for theming with light mode configuration

**Typography & Design**
- Google Fonts: Montserrat (900/800/700 weight) for display/headers, Inter (400/500/600 weight) for body/UI
- Premium brand colors: Primary Black (#1D1D1B), Pure White (#FFFFFF), Premium Gold (#CDA756)
- Responsive design with mobile-first approach using Tailwind breakpoints
- Full-screen hero section with background images and gradient overlays

**State Management**
- **TanStack Query (React Query)** for server state management and API data fetching
- React Hook Form with Zod validation for form state and validation
- Local component state using React hooks

### Backend Architecture

**Server Framework**
- **Express.js** server with TypeScript
- ESM module system (type: "module")
- Custom middleware for logging, JSON parsing, and raw body capture

**API Design**
- RESTful endpoints for contact submissions and booking requests
- Routes:
  - `POST /api/contact` - Create contact submission
  - `GET /api/contacts` - Retrieve all contacts
  - `POST /api/booking` - Create booking request
  - `GET /api/bookings` - Retrieve all bookings
- Validation using Zod schemas with user-friendly error messages via zod-validation-error

**Data Persistence Strategy**
- In-memory storage implementation (`MemStorage`) for development/testing
- Interface-based storage abstraction (`IStorage`) allowing easy swap to database implementation
- **Drizzle ORM** configured for PostgreSQL with migration support
- Database schemas defined for `contact_submissions` and `booking_requests` tables with UUID primary keys and timestamps

**Development Environment**
- Vite middleware integration for seamless full-stack development
- Hot module replacement (HMR) for frontend changes
- Automatic server restart on backend changes via tsx watch mode
- Replit-specific plugins for development tooling and error overlays

### Data Schema & Validation

**Database Tables (PostgreSQL via Drizzle)**
- `contact_submissions`: id (UUID), name, email, message, created_at
- `booking_requests`: id (UUID), email, created_at

**Validation Rules**
- Contact form: name (min 2 chars), valid email, message (min 10 chars)
- Booking form: valid email
- French language error messages for user-facing validation

### External Dependencies

**Third-Party UI Libraries**
- Radix UI component primitives (20+ components including accordion, dialog, dropdown, navigation, popover, select, toast, etc.)
- Embla Carousel for potential image carousels
- CMDK for command palette functionality
- class-variance-authority for component variant management
- Lucide React for icons
- React Icons (specifically SiTiktok for social media)

**Database & ORM**
- Neon Database serverless PostgreSQL (`@neondatabase/serverless`)
- Drizzle ORM with Drizzle Kit for migrations
- Connection via DATABASE_URL environment variable

**Form Handling & Validation**
- React Hook Form for form state management
- Zod for schema validation
- @hookform/resolvers for integration
- drizzle-zod for generating Zod schemas from Drizzle tables

**Utilities**
- date-fns for date manipulation
- clsx and tailwind-merge for class name management
- nanoid for unique ID generation

**Build & Development Tools**
- esbuild for server-side bundling
- PostCSS with Tailwind and Autoprefixer
- tsx for TypeScript execution in development
- Replit-specific plugins (@replit/vite-plugin-runtime-error-modal, cartographer, dev-banner)

**Asset Management**
- Static images stored in `attached_assets/generated_images/`
- Vite alias configuration for asset imports (@assets)
- Text content stored in attached_assets directory

**External Service Integrations**
- Bookyway (third-party booking platform) - users receive access links via email after submitting booking requests
- Instagram and TikTok social media integrations (display only, links in navigation)