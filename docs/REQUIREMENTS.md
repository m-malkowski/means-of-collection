# Requirements Specification

## Project Overview
A static Gatsby.js website for archiving personal collections and wishlists, with initial focus on LEGO sets. Hosted on GitHub Pages with data stored as YAML files in the repository.

---

## Core Requirements

### 1. Data Architecture

#### 1.1 Common Item Schema
All items share these base fields:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier |
| `name` | string | ✅ | Item name |
| `category` | string | ✅ | Category identifier (e.g., "lego") |
| `tags` | string[] | ❌ | Freeform tags for filtering |
| `retailPrice` | number | ❌ | Original retail price in EUR |
| `purchasePrice` | number | ❌ | Actual purchase price in EUR |
| `links` | array | ❌ | Array of external link objects |
| `links[].url` | string | ✅ | Link URL |
| `links[].name` | string | ❌ | Optional custom link name |
| `notes` | string | ❌ | Personal notes |
| `images` | string[] | ❌ | Relative paths to images in repo |
| `dateAdded` | date | ✅ | When added to collection/wishlist |
| `dateBought` | date | ❌ | When purchased (null = wishlist) |
| `status` | enum | ✅ | "owned" \| "wishlist" |
| `isGift` | boolean | ✅ | Indicate this item was a gift / could be a gift|

#### 1.2 Category-Specific Extensions

**LEGO Schema** (extends common):
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `setId` | string | ✅ | Official LEGO set number |
| `partCount` | number | ❌ | Number of pieces |
| `isRetired` | boolean | ❌ | Whether set is retired |
| `minifigCount` | number | ❌ | Number of minifigures |
| `yearReleased` | number | ❌ | Release year |

#### 1.3 Configuration Schema
```yaml
# config/site.yaml
site:
  title: "Means of Collection"
  description: "My collection archive"
  currency: "EUR"
  currencySymbol: "€"

filters:
  priceBreakpoints: [25, 50, 100, 200, 500]  # Creates ranges: <25, 25-50, 50-100, etc.
  ageBuckets:
    - label: "This week"
      days: 7
    - label: "This month"
      days: 30
    - label: "This quarter"
      days: 90
    - label: "This year"
      days: 365
    - label: "Older"
      days: null  # Everything else

theme:
  defaultMode: "dark"  # "dark" | "light"
```

---

### 2. User Interface

#### 2.1 Design System
- **Typography**: Consolas / "Fira Code" / "JetBrains Mono" (monospace stack)
- **Color Scheme**: Monochrome (black, white, grays)
- **Theme**: Dark/Light mode toggle, persisted in localStorage
- **Feel**: Terminal/geeky aesthetic with subtle accents

#### 2.2 Layout Components
| Component | Description |
|-----------|-------------|
| Header | Site title, navigation, theme toggle |
| Filter Bar | All filter controls (collapsible on mobile) |
| View Toggle | Switch between Gallery/List views |
| Item Card | Image, name, price, status badge |
| Item Row | Compact list view with key details |
| Footer | Minimal footer |

#### 2.3 Views
1. **Gallery View** (default)
   - Responsive mosaic grid
   - Cards show: thumbnail, name, price
   - Hover: show additional info overlay
   
2. **List View**
   - Compact table/rows
   - Sortable columns
   - More fields visible at once

#### 2.4 Pages
| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing / redirect to wishlist |
| Collection | `/collection/` | All owned items |
| Wishlist | `/wishlist/` | All wishlist items |
| Item Detail | `/item/{id}/` | Full item details (uses item `id` field) |
| About | `/about/` | Optional info page |

---

### 3. Filtering System

#### 3.1 Filter Types
| Filter | Type | Behavior |
|--------|------|----------|
| Text Search | Input | Matches all fields (fuzzy) |
| Category | Multi-select | OR within selection |
| Tags | Multi-select chips | OR within selection |
| Price Range | Predefined buckets | Single select |
| Age | Predefined buckets | Single select |
| Status | Toggle | Owned/Wishlist/All |
| Gift Ideas | Toggle | Show only items marked as gift ideas |

#### 3.2 Sorting
| Sort Option | Description |
|-------------|-------------|
| Name (A-Z / Z-A) | Alphabetical |
| Price (Low-High / High-Low) | By retail or purchase price |
| Date Added (Newest / Oldest) | When added to collection |
| Date Bought (Newest / Oldest) | When purchased |

#### 3.3 Mobile Filter UX

**Approach: Collapsible panel + Active filter chips**

- Collapsed by default with "Filters" button
- "X filters active" badge shown when collapsed
- Expands inline (no overlay/modal)
- Active filters displayed as dismissible chips above results
- Tap chip to remove that filter
- "Clear all" option when multiple filters active

#### 3.4 Filter Behavior
- All filtering is **client-side** (no server)
- Filters combine with **AND** logic between types
- URL query params reflect filter state (shareable links)
- Filter counts show available items per option
- Reset button clears all filters
- Sort selection also persisted in URL

---

### 4. Technical Requirements

#### 4.1 Stack
- **Framework**: Gatsby.js v5+
- **Language**: TypeScript
- **Styling**: CSS Modules or Styled Components
- **Data**: YAML files via gatsby-transformer-yaml
- **Images**: gatsby-plugin-image for optimization
- **Hosting**: GitHub Pages via GitHub Actions

#### 4.2 Performance
- Static generation at build time
- Lazy loading for images
- Client-side search with pre-built index (e.g., Fuse.js)
- Minimal JavaScript bundle

#### 4.3 SEO & Accessibility
- Semantic HTML
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation
- ARIA labels where needed

---

### 5. File Structure
```
means-of-collection/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   ├── Header/
│   │   ├── ItemCard/
│   │   ├── ItemRow/
│   │   ├── FilterBar/
│   │   ├── ThemeToggle/
│   │   └── ...
│   ├── pages/
│   │   ├── index.tsx
│   │   ├── collection.tsx
│   │   ├── wishlist.tsx
│   │   └── about.tsx
│   ├── templates/
│   │   └── item-detail.tsx
│   ├── hooks/
│   │   ├── useFilters.ts
│   │   ├── useTheme.ts
│   │   └── useSearch.ts
│   ├── styles/
│   │   ├── global.css
│   │   ├── variables.css
│   │   └── theme.css
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       ├── formatting.ts
│       └── filtering.ts
├── content/
│   ├── items/
│   │   ├── lego/
│   │   │   ├── millennium-falcon.yaml
│   │   │   └── ...
│   │   └── {other-categories}/
│   └── images/
│       ├── lego/
│       │   └── ...
│       └── ...
├── config/
│   └── site.yaml
├── static/
├── gatsby-config.ts
├── gatsby-node.ts
└── package.json
```

---

## Non-Functional Requirements

### Data Management
- Easy to add new items (just create YAML file)
- Validation of YAML schemas at build time
- Clear error messages for malformed data

### Extensibility
- Easy to add new categories with custom fields
- Pluggable filter components
- Theme customization via CSS variables
