# Example YAML Schemas

This document shows the YAML format for different content types.

---

## Site Configuration

**File:** `config/site.yaml`

```yaml
site:
  title: "Means of Collection"
  description: "A static archive of what I own and what I want"
  author: "Your Name"
  currency: "EUR"
  currencySymbol: "€"
  siteUrl: "https://username.github.io/means-of-collection"

filters:
  # Price ranges: <25, 25-50, 50-100, 100-200, 200-500, 500+
  priceBreakpoints:
    - 25
    - 50
    - 100
    - 200
    - 500

  # How long ago items were added
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
      days: null

theme:
  defaultMode: "dark"
  accentColor: "#00ff00"  # Optional terminal-green accent
```

---

## LEGO Items

**Directory:** `content/items/lego/`

### Owned Item Example

**File:** `content/items/lego/millennium-falcon-75192.yaml`

```yaml
# Common fields
id: "lego-75192"
name: "Millennium Falcon"
category: "lego"
status: "owned"
isGift: false
tags:
  - star-wars
  - ucs
  - display
  - large
retailPrice: 849.99
purchasePrice: 749.99
storeUrl: "https://www.lego.com/product/millennium-falcon-75192"
notes: "Bought during May 4th sale. Took 3 weeks to build."
images:
  - "lego/millennium-falcon-75192-box.jpg"
  - "lego/millennium-falcon-75192-built.jpg"
dateAdded: 2025-05-04
dateBought: 2025-05-04

# LEGO-specific fields
setId: "75192"
partCount: 7541
isRetired: false
minifigCount: 7
yearReleased: 2017
```

### Wishlist Item Example

**File:** `content/items/lego/colosseum-10276.yaml`

```yaml
id: "lego-10276"
name: "Colosseum"
category: "lego"
status: "wishlist"
isGift: true  # Great gift idea!
tags:
  - architecture
  - display
  - large
retailPrice: 549.99
storeUrl: "https://www.lego.com/product/colosseum-10276"
notes: "Want this for the living room display"
images:
  - "lego/colosseum-10276.jpg"
dateAdded: 2025-11-15
dateBought: null

# LEGO-specific fields
setId: "10276"
partCount: 9036
isRetired: true
minifigCount: 0
yearReleased: 2020
```

---

## Future Category Example: Books

**File:** `content/items/books/dune.yaml`

```yaml
# Common fields
id: "book-dune-1965"
name: "Dune"
category: "books"
status: "owned"
isGift: false
tags:
  - sci-fi
  - classic
  - fiction
retailPrice: 12.99
purchasePrice: 9.99
storeUrl: "https://www.amazon.com/dp/0441172717"
notes: "First edition paperback"
images:
  - "books/dune-cover.jpg"
dateAdded: 2025-01-10
dateBought: 2025-01-15

# Book-specific fields
author: "Frank Herbert"
isbn: "978-0441172719"
publisher: "Ace"
yearPublished: 1965
pages: 896
format: "paperback"  # hardcover, paperback, ebook
series: "Dune"
seriesNumber: 1
```

---

## Validation Rules

### Required Fields (All Items)
- `id` - Must be unique across all items
- `name` - Non-empty string
- `category` - Must match a known category
- `status` - Must be "owned" or "wishlist"
- `isGift` - Boolean indicating if this is a gift idea
- `dateAdded` - Valid ISO date

### Category-Specific Required Fields

**LEGO:**
- `setId` - LEGO set number

**Books:**
- `author` - Author name

### Field Constraints
- Prices must be non-negative numbers
- Dates must be valid ISO 8601 format (YYYY-MM-DD)
- Images must be valid paths relative to `content/images/`
- URLs must be valid HTTP/HTTPS URLs
