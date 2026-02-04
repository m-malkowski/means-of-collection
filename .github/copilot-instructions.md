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

### ✅ Phase 2: Core UI (Complete)
- Design tokens (CSS variables for colors, typography, spacing)
- Layout, Header, Footer components
- ItemCard, ItemRow, ItemGrid components
- ViewToggle (gallery/list view)
- PageHeader component
- Responsive styling

### ✅ Phase 3: Filtering (Complete)
- useFilters hook with URL state sync
- FilterBar container component
- TextSearch with Fuse.js fuzzy search
- TagFilter (chip/pill multi-select)
- PriceRangeFilter (bucket selector)
- AgeFilter (bucket selector)
- GiftFilter toggle
- ResetFilters button

### ✅ Phase 4: Polish (Complete)
- Dark/light theme toggle with localStorage persistence
- System preference detection
- Animated theme transitions
- Item detail pages with gatsby-node.ts generation
- SEO component with Open Graph tags
- Sitemap generation
- Accessibility: skip links, focus states, reduced motion support
- Collection statistics in footer and home page

### ✅ Phase 5: Deployment (Complete)
- GitHub Actions workflow (.github/workflows/deploy.yml)
- Path prefix configured for GitHub Pages
- Production build optimized
- Automated deploy on push to main

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
