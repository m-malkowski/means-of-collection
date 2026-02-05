# Claude Code Instructions - Means of Collection

## Project Overview
A static Gatsby.js website for archiving personal collections and wishlists, starting with LEGO sets. Built with TypeScript, styled with a terminal/monospace aesthetic, hosted on GitHub Pages.

**Live Site**: https://m-malkowski.github.io/means-of-collection

## Tech Stack
- **Framework**: Gatsby 5 + TypeScript
- **Styling**: CSS Modules with CSS Variables
- **Data**: YAML files transformed via GraphQL (gatsby-transformer-yaml)
- **Search**: Fuse.js for fuzzy matching
- **Images**: gatsby-plugin-image for optimization
- **Hosting**: GitHub Pages with GitHub Actions CI/CD

## Quick Start Commands
```bash
npm run develop      # Start dev server at http://localhost:8000
npm run build        # Production build with path prefix
npm run serve        # Preview production build
npm run clean        # Clear Gatsby cache
npm run typecheck    # TypeScript type checking
npm run add-lego-set <setId>  # Auto-create LEGO entry from CSV
npm run fix-yaml     # Fix YAML formatting
```

## Project Structure

```
means-of-collection/
├── config/
│   └── site.yaml              # Site config, filter breakpoints, theme settings
├── content/
│   ├── items/
│   │   └── lego/*.yaml        # LEGO item data files
│   ├── db/
│   │   └── lego-starwars.csv  # LEGO database for script imports
│   └── images/
│       └── lego/              # Item images (now in static/images/lego/)
├── src/
│   ├── components/            # React components (each in folder with index.ts)
│   ├── pages/
│   │   ├── index.tsx          # Redirects to /wishlist/
│   │   ├── wishlist.tsx       # Wishlist page
│   │   └── collection.tsx     # Collection page
│   ├── templates/
│   │   └── item-detail.tsx    # Template for /item/{id}/ pages
│   ├── hooks/
│   │   └── useFilters.ts      # Main filtering hook with Fuse.js
│   ├── styles/
│   │   ├── global.css         # Global styles
│   │   └── variables.css      # CSS variables for theming
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   └── utils/
│       └── config.ts          # Config utilities
├── scripts/
│   ├── add-lego-set.js        # Auto-generate LEGO entries from CSV
│   └── fix-yaml.js            # YAML formatting utilities
├── static/
│   └── images/lego/           # Item images (served statically)
├── docs/
│   ├── REQUIREMENTS.md        # Full specification
│   ├── ROADMAP.md             # 5-phase implementation plan (all complete ✅)
│   └── YAML_SCHEMAS.md        # Example data formats
├── gatsby-config.ts           # Gatsby plugins & config
├── gatsby-node.ts             # Dynamic page generation
├── tsconfig.json              # TypeScript config
└── package.json
```

## Key Documentation Files
- **[docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)** - Full spec for UI, data, filtering
- **[docs/ROADMAP.md](docs/ROADMAP.md)** - 5-phase implementation plan (all phases complete)
- **[docs/YAML_SCHEMAS.md](docs/YAML_SCHEMAS.md)** - Example data formats

## Data Layer

### Site Configuration ([config/site.yaml](config/site.yaml))
```yaml
site:
  title: "Means of Collection"
  description: "A static archive of what I own and what I want"
  author: "Maciej Malkowski"
  currency: "EUR"
  currencySymbol: "€"
  siteUrl: "https://m-malkowski.github.io/means-of-collection"

filters:
  priceBreakpoints: [25, 50, 100, 200, 500]
  ageBuckets:
    - { label: "This week", days: 7 }
    - { label: "This month", days: 30 }
    - { label: "This quarter", days: 90 }
    - { label: "This year", days: 365 }
    - { label: "Older", days: null }

theme:
  defaultMode: "dark"
  accentColor: "#00ff00"
```

### Adding LEGO Items

**Option 1: Automated Script (Recommended)**
```bash
npm run add-lego-set 75192
```
This script:
1. Looks up the set in [content/db/lego-starwars.csv](content/db/lego-starwars.csv)
2. Creates a YAML file in [content/items/lego/](content/items/lego/)
3. Downloads the image from BrickSet to [static/images/lego/](static/images/lego/)

**Option 2: Manual YAML Creation**
Create files in [content/items/lego/](content/items/lego/):

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
links:
  - url: "https://www.lego.com/product/set-name-12345"
  - url: "https://www.amazon.com/dp/ABC123"
    name: "Buy on Amazon"

# LEGO-specific
setId: "12345"
partCount: 1500
isRetired: false
minifigCount: 5
yearReleased: 2017
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

## Design System

### Typography
- Primary font: `'Fira Code', Consolas, 'JetBrains Mono', monospace`
- Terminal/geeky aesthetic

### Colors
- Monochrome base (black, white, grays)
- Accent: `#00ff00` (terminal green)
- Dark mode default, light mode toggle

### Theme System
- Dark/light mode toggle in [src/components/ThemeToggle/](src/components/ThemeToggle/)
- Persisted in localStorage
- System preference detection
- CSS variables in [src/styles/variables.css](src/styles/variables.css)

## Component Architecture

### Component Patterns
- Each component in its own folder with `index.ts` export
- CSS Modules for styling
- Functional components with hooks
- TypeScript with strict mode

### Key Components
- **[Layout](src/components/Layout/)** - Page wrapper with header/footer
- **[Header](src/components/Header/)** - Site title, navigation, theme toggle
- **[Footer](src/components/Footer/)** - Minimal footer with collection stats
- **[ItemCard](src/components/ItemCard/)** - Gallery view card with hover state
- **[ItemRow](src/components/ItemRow/)** - Compact list view row
- **[ItemGrid](src/components/ItemGrid/)** - Mosaic gallery container
- **[ViewToggle](src/components/ViewToggle/)** - Switch between gallery/list views
- **[PageHeader](src/components/PageHeader/)** - Page title and description

### Filter Components
- **[FilterBar](src/components/FilterBar/)** - Container for all filters
- **[TextSearch](src/components/TextSearch/)** - Search input with Fuse.js
- **[TagFilter](src/components/TagFilter/)** - Chip/pill multi-select
- **[PriceRangeFilter](src/components/PriceRangeFilter/)** - Predefined bucket selector
- **[AgeFilter](src/components/AgeFilter/)** - Date-based bucket selector
- **[GiftFilter](src/components/GiftFilter/)** - Toggle for gift-only items
- **[ResetFilters](src/components/ResetFilters/)** - Clear all button

## Filtering System

### Implementation
- **Hook**: [src/hooks/useFilters.ts](src/hooks/useFilters.ts)
- **Library**: Fuse.js for fuzzy search
- **State Management**: React useState
- **URL Sync**: Query params for shareable links

### Filter Types
| Filter | Type | Behavior |
|--------|------|----------|
| Text Search | Input | Matches name, tags, setId, notes (fuzzy) |
| Tags | Multi-select | OR within selection |
| Price Range | Predefined buckets | Single select (e.g., "0-25", "25-50") |
| Age | Predefined buckets | Single select (This week, This month, etc.) |
| Gift Ideas | Toggle | Show only items marked as gift ideas |

### URL Parameters
Filters are persisted in URL query params:
```
?tags=star-wars,ucs&price=100-200&age=this-month&gift=true
```

## TypeScript Types ([src/types/index.ts](src/types/index.ts))

### Core Types
```typescript
type ItemStatus = "owned" | "wishlist";
type ItemCategory = "lego"; // Extensible for future categories
type ViewMode = "gallery" | "list";

interface ItemLink {
  url: string;
  name?: string; // Optional custom name
}

interface BaseItem {
  id: string;
  name: string;
  category: ItemCategory;
  status: ItemStatus;
  isGift: boolean;
  tags?: string[];
  retailPrice?: number;
  purchasePrice?: number;
  links?: ItemLink[];
  notes?: string;
  images?: string[];
  dateAdded: string;
  dateBought?: string | null;
}

interface LegoItem extends BaseItem {
  category: "lego";
  setId: string;
  partCount?: number;
  isRetired?: boolean;
  minifigCount?: number;
  yearReleased?: number;
}

interface FilterState {
  search: string;
  categories: ItemCategory[];
  tags: string[];
  priceRange: string | null;
  ageBucket: string | null;
  status: ItemStatus | "all";
  giftOnly: boolean;
}
```

## Build & Deployment

### Local Development
```bash
npm run develop    # Start at http://localhost:8000
npm run typecheck  # Check TypeScript types
```

### Production Build
```bash
npm run build      # Build with --prefix-paths for GitHub Pages
npm run serve      # Serve production build locally
```

### CI/CD
- **GitHub Actions Workflow**: [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
- **Trigger**: Push to main branch
- **Deployment**: GitHub Pages (actions/deploy-pages)
- **Path Prefix**: `/means-of-collection`

## Conventions

### File Naming
- Components: `PascalCase` folders with `index.tsx`
- Pages: `kebab-case.tsx`
- YAML: `{name}-{setId}.yaml`
- Types: Export from [src/types/index.ts](src/types/index.ts)

### Code Style
- TypeScript strict mode
- Functional React components
- Prefer hooks over classes
- Use `type` over `interface` for simple types
- CSS Modules for component styling
- CSS Variables for global theming

### GraphQL Query Patterns
- Use page queries for components
- Use static queries for global data
- All items queried via `allLegoYaml`
- Config queried via `configYaml`

## Common Tasks

### Add a new LEGO set (automated)
```bash
npm run add-lego-set 75192
```

### Add a new LEGO set (manual)
1. Create `content/items/lego/{name}-{setId}.yaml`
2. Add image to `static/images/lego/`
3. Restart dev server (or wait for hot reload)

### Modify filter breakpoints
Edit [config/site.yaml](config/site.yaml):
```yaml
filters:
  priceBreakpoints: [25, 50, 100, 200, 500]
```

### Add a new category
1. Add category type to [src/types/index.ts](src/types/index.ts)
2. Create folder `content/items/{category}/`
3. Add gatsby-source-filesystem entry in [gatsby-config.ts](gatsby-config.ts)
4. Update GraphQL queries in pages and templates
5. Create category-specific GraphQL types in [gatsby-node.ts](gatsby-node.ts)

### Debugging GraphQL
- Visit http://localhost:8000/___graphql
- Use GraphiQL to explore schema
- Check `gatsby-node.ts` for custom schema definitions

## Implementation Status

All 5 phases are complete:
- ✅ **Phase 1**: Foundation (Gatsby + data layer)
- ✅ **Phase 2**: Core UI (Components + styling)
- ✅ **Phase 3**: Filtering (Client-side filters)
- ✅ **Phase 4**: Polish (Theme, SEO, detail pages)
- ✅ **Phase 5**: Deployment (GitHub Pages + CI/CD)

## Future Enhancements (Post-MVP)
- Add more categories (books, games, etc.)
- Item comparison feature
- Price history tracking
- Export to CSV/JSON
- Import from external APIs (LEGO, etc.)
- PWA support for offline access
- Collection value over time chart
- Related items suggestions

## Important Notes
- Images are now served from `static/images/lego/` (not `content/images/`)
- Path prefix `/means-of-collection` is required for GitHub Pages
- All filtering is client-side (no server)
- Filter state is persisted in URL query parameters
- Theme preference is stored in localStorage
- YAML files are transformed to GraphQL at build time
- Use `npm run clean` if you encounter caching issues
