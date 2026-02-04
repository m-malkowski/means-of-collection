# means-of-collection

A static, build-time archive of what I own, what I want, and how LEGO slowly converts income into bricks.

🌐 **Live Site**: [m-malkowski.github.io/means-of-collection](https://m-malkowski.github.io/means-of-collection)

## Features

- 🧱 **Collection Management** - Track owned LEGO sets and wishlists
- 🔍 **Smart Filtering** - Search, filter by tags, price ranges, and more
- 🎁 **Gift Ideas** - Mark items as gift suggestions
- 🌓 **Dark/Light Theme** - Toggle with system preference support
- 📱 **Responsive Design** - Works on desktop and mobile
- 🔗 **Shareable URLs** - Filter state persists in URL
- ♿ **Accessible** - Keyboard navigation, screen reader support

## Tech Stack

- **Framework**: Gatsby 5 + TypeScript
- **Styling**: CSS Modules with CSS Variables
- **Data**: YAML files transformed via GraphQL
- **Search**: Fuse.js for fuzzy matching
- **Hosting**: GitHub Pages with GitHub Actions CI/CD

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run develop

# Build for production
npm run build

# Preview production build
npm run serve

# Clear cache
npm run clean
```

## Adding Items

Create a YAML file in `content/items/lego/`:

```yaml
id: "lego-12345"
name: "My LEGO Set"
category: "lego"
status: "wishlist"  # or "owned"
isGift: true
tags: [star-wars, ucs]
retailPrice: 199.99
dateAdded: "2025-01-15"
setId: "12345"
partCount: 1500
```

## Documentation

- [Requirements](docs/REQUIREMENTS.md) - Full specification
- [Roadmap](docs/ROADMAP.md) - Implementation phases
- [YAML Schemas](docs/YAML_SCHEMAS.md) - Data format examples

## License

ISC


