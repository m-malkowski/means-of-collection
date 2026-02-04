# Implementation Roadmap

## Phase Overview

| Phase | Focus | Duration | Deliverable |
|-------|-------|----------|-------------|
| 1 | Foundation | 1-2 days | Gatsby project + data layer |
| 2 | Core UI | 2-3 days | Components + styling |
| 3 | Filtering | 1-2 days | Client-side filters |
| 4 | Polish | 1-2 days | Theme toggle, SEO, detail pages |
| 5 | Deployment | 0.5 day | GitHub Pages + CI/CD |

---

## Phase 1: Foundation

### 1.1 Project Setup
- [x] Initialize Gatsby project with TypeScript template
- [x] Configure ESLint + Prettier
- [x] Set up folder structure per spec

### 1.2 Data Layer
- [x] Install & configure `gatsby-transformer-yaml`
- [x] Install & configure `gatsby-source-filesystem`
- [x] Create config YAML schema (`config/site.yaml`)
- [x] Create LEGO item schema (`content/items/lego/*.yaml`)
- [x] Add 3-5 sample LEGO items for testing
- [x] Create TypeScript types for all schemas
- [x] Set up GraphQL queries

### 1.3 Image Handling
- [x] Configure `gatsby-plugin-image`
- [x] Add sample images to `content/images/lego/`
- [x] Test image optimization pipeline

### Milestone: ✅ Can query items via GraphQL, images load correctly

---

## Phase 2: Core UI

### 2.1 Design Tokens
- [x] Define CSS variables for colors (light/dark)
- [x] Set up typography scale (monospace)
- [x] Create spacing/sizing tokens

### 2.2 Layout Components
- [x] `<Layout>` - wrapper with header/footer
- [x] `<Header>` - title, nav, theme toggle placeholder
- [x] `<Footer>` - minimal footer with stats
- [x] Create responsive container utilities

### 2.3 Item Display Components
- [x] `<ItemCard>` - gallery view card
  - Thumbnail, name, price, status badge
  - Hover state with more info
- [x] `<ItemRow>` - list view row
  - Compact inline display
- [x] `<ItemGrid>` - mosaic gallery container
- [x] `<ItemList>` - list view container
- [x] `<ViewToggle>` - switch between views

### 2.4 Pages
- [x] Home page (`/`) - hero + recent items
- [x] Collection page (`/collection/`)
- [x] Wishlist page (`/wishlist/`)

### Milestone: ✅ Can browse items in gallery/list view, responsive design works

---

## Phase 3: Filtering System

### 3.1 Filter Infrastructure
- [x] Create `useFilters` hook for state management
- [x] Implement URL query param sync
- [x] Create filter utility functions

### 3.2 Filter Components
- [x] `<FilterBar>` - container for all filters
- [x] `<TextSearch>` - search input with Fuse.js
- [ ] `<CategoryFilter>` - multi-select dropdown (deferred - single category for now)
- [x] `<TagFilter>` - chip/pill multi-select
- [x] `<PriceRangeFilter>` - predefined bucket selector
- [x] `<AgeFilter>` - predefined bucket selector
- [x] `<ResetFilters>` - clear all button
- [x] `<GiftFilter>` - toggle for gift-only items

### 3.3 Search Implementation
- [x] Install Fuse.js
- [x] Implement fuzzy search across all fields (name, tags, setId, notes)

### Milestone: ✅ All filters work, URL is shareable, filters combine correctly

---

## Phase 4: Polish & Detail Pages

### 4.1 Theme System
- [x] Implement dark/light mode toggle
- [x] Persist preference in localStorage
- [x] Respect system preference initially
- [x] Animate theme transitions

### 4.2 Item Detail Pages
- [x] Create `item-detail.tsx` template
- [x] Configure `gatsby-node.ts` to generate pages
- [x] Display all fields including category-specific
- [ ] Image gallery/carousel (placeholder for now)
- [x] Back to list navigation

### 4.3 SEO & Meta
- [x] Add `gatsby-plugin-react-helmet`
- [x] Create `<SEO>` component
- [x] Add Open Graph tags
- [x] Generate sitemap

### 4.4 Accessibility Audit
- [x] Keyboard navigation
- [x] Focus states
- [x] Screen reader labels
- [x] Skip link for main content
- [x] Reduced motion support

### 4.5 Statistics
- [x] Total items count
- [x] Total collection value
- [x] Owned/wishlist breakdown
- [x] Display in footer/home page

### Milestone: ✅ Complete, polished application ready for production

---

## Phase 5: Deployment

### 5.1 Build Configuration
- [x] Configure path prefix for GitHub Pages
- [x] Optimize production build
- [x] Test build locally

### 5.2 GitHub Actions
- [x] Create `.github/workflows/deploy.yml`
- [x] Trigger on push to main
- [x] Build and deploy to GitHub Pages (using actions/deploy-pages)

### 5.3 Repository Setup
- [ ] Enable GitHub Pages in repo settings (Source: GitHub Actions)
- [ ] Configure custom domain (optional)
- [ ] Test live deployment

### Milestone: ✅ Site is live at `m-malkowski.github.io/means-of-collection`

---

## Future Enhancements (Post-MVP)

- [ ] Add more categories (books, games, etc.)
- [ ] Item comparison feature
- [ ] Price history tracking
- [ ] Export to CSV/JSON
- [ ] Import from external APIs (LEGO, etc.)
- [ ] PWA support for offline access
- [ ] Collection value over time chart
- [ ] Related items suggestions

---

## Getting Started

After requirements review, begin Phase 1:

```bash
# Create Gatsby project
npm init gatsby -- -y -ts means-of-collection

# Or with specific template
npx gatsby new means-of-collection https://github.com/gatsbyjs/gatsby-starter-minimal-ts
```

Ready to start Phase 1?
