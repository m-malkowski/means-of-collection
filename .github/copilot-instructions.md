# Copilot Instructions - Means of Collection

## Project Overview
A static Gatsby.js website for archiving personal collections and wishlists, starting with LEGO sets. Built with TypeScript, styled with a terminal/monospace aesthetic, hosted on GitHub Pages.

## Quick Start
```bash
npm run develop   # Start dev server at http://localhost:8000
npm run build     # Production build with path prefix
npm run serve     # Preview production build
npm run clean     # Clear Gatsby cache
```

## Project Structure

```
means-of-collection/
├── config/
│   └── site.yaml              # Site config, filter breakpoints, theme settings
├── content/
│   ├── items/
│   │   └── lego/*.yaml        # LEGO item data files
│   └── images/
│       └── lego/              # Item images
├── src/
│   ├── components/            # React components (Phase 2+)
│   ├── pages/
│   │   ├── index.tsx          # Redirects to /wishlist/
│   │   ├── wishlist.tsx       # Wishlist page
│   │   └── collection.tsx     # Collection page
│   ├── templates/             # Page templates for dynamic routes
│   ├── hooks/                 # Custom React hooks
│   ├── styles/                # Global CSS, variables, themes
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   └── utils/                 # Helper functions
├── docs/
│   ├── REQUIREMENTS.md        # Full specification
│   ├── ROADMAP.md             # Implementation phases & checklist
│   └── YAML_SCHEMAS.md        # YAML format examples
├── gatsby-config.ts           # Gatsby plugins & config
├── gatsby-node.ts             # Dynamic page generation
└── tsconfig.json              # TypeScript config
```

## Key Documentation
- **Requirements**: `docs/REQUIREMENTS.md` - Full spec for UI, data, filtering
- **Roadmap**: `docs/ROADMAP.md` - 5-phase implementation plan with checkboxes
- **YAML Schemas**: `docs/YAML_SCHEMAS.md` - Example data formats

## Data Layer

### Adding Items
Create YAML files in `content/items/{category}/`:

```yaml
# content/items/lego/my-set-12345.yaml
id: "lego-12345"           # Unique ID
name: "Set Name"           # Display name
category: "lego"           # Category identifier
status: "wishlist"         # "owned" | "wishlist"
isGift: true               # Show as gift idea
tags: [star-wars, ucs]     # Freeform tags
retailPrice: 199.99        # EUR
dateAdded: "2025-01-15"    # ISO date

# LEGO-specific
setId: "12345"
partCount: 1500
```

### GraphQL Queries
YAML files become queryable via `allLegoYaml`:

```graphql
query {
  allLegoYaml {
    nodes {
      id, name, status, isGift, retailPrice, setId, tags
    }
  }
}
```

Explore at: http://localhost:8000/___graphql

## Configuration

### Site Config (`config/site.yaml`)
```yaml
site:
  title: "Means of Collection"
  currency: "EUR"
  currencySymbol: "€"

filters:
  priceBreakpoints: [25, 50, 100, 200, 500]
  ageBuckets:
    - { label: "This week", days: 7 }
    - { label: "This month", days: 30 }
    # ...

theme:
  defaultMode: "dark"
  accentColor: "#00ff00"
```

## Design System

### Typography
- Primary font: `'Fira Code', Consolas, 'JetBrains Mono', monospace`
- Terminal/geeky aesthetic

### Colors
- Monochrome base (black, white, grays)
- Accent: `#00ff00` (terminal green)
- Dark mode default, light mode toggle

### Component Patterns
- Use CSS Modules or inline styles (styled-components later)
- All filtering is client-side
- URL query params for shareable filter state

## Implementation Status

### ✅ Phase 1: Foundation (Complete)
- Gatsby + TypeScript setup
- YAML data layer configured
- Config schema created
- TypeScript types defined
- Sample LEGO items added
- Basic pages working

### 🔲 Phase 2: Core UI (Next)
- Design tokens (CSS variables)
- Layout, Header, Footer components
- ItemCard, ItemGrid, ViewToggle
- Responsive styling

### 🔲 Phase 3: Filtering
- useFilters hook
- Filter components (search, tags, price, age)
- URL state sync
- Fuse.js search

### 🔲 Phase 4: Polish
- Dark/light theme toggle
- Item detail pages
- SEO meta tags

### 🔲 Phase 5: Deployment
- GitHub Actions workflow
- GitHub Pages deploy

## Conventions

### File Naming
- Components: `PascalCase` folders with `index.tsx`
- Pages: `kebab-case.tsx`
- YAML: `{name}-{id}.yaml`
- Types: Export from `src/types/index.ts`

### Code Style
- TypeScript strict mode
- Functional React components
- Prefer hooks over classes
- Use `type` over `interface` for simple types

## Common Tasks

### Add a new LEGO set
1. Create `content/items/lego/{name}-{setId}.yaml`
2. Add image to `content/images/lego/`
3. Restart dev server (or wait for hot reload)

### Add a new category
1. Add category type to `src/types/index.ts`
2. Create folder `content/items/{category}/`
3. Add gatsby-source-filesystem entry if needed
4. Create category-specific GraphQL queries

### Modify filters
1. Edit breakpoints in `config/site.yaml`
2. Update filter components to read from config
