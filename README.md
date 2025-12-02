CSS Framework

A token-driven CSS framework built with modern cascade layers. ACSD provides sensible defaults for semantic HTML and reusable components—perfect for marketing pages, documentation, and internal tools.

## Quick Start

Add the framework to any HTML:

```html
<link rel="stylesheet" href="acsd.css" />
```

## Layer Architecture

The framework uses CSS `@layer` for predictable cascade control:

```css
@layer tokens, base, components, utilities, overrides;
```

| Layer        | Purpose                                                     |
| ------------ | ----------------------------------------------------------- |
| `tokens`     | Design tokens (colors, spacing, typography, radii, shadows) |
| `base`       | Element selectors—styles semantic HTML without classes      |
| `components` | Reusable UI patterns (`.btn`, `.card`, `.alert`, `.badge`)  |
| `utilities`  | Single-purpose helpers (`.flex`, `.mt-md`, `.text-center`)  |
| `overrides`  | Reserved for project-specific customizations                |

## Token System

All values come from CSS custom properties. Key tokens include:

- **Colors**: 5 color ramps (gray, primary, secondary, success, warning, danger) with 7 shades each
- **Spacing**: `--space-xs` through `--space-2xl`
- **Typography**: Modular scale using `--font-ratio: 1.25`
- **Radii**: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`

## Components (BEM Naming)

### Button

```html
<button class="btn">Default</button>
<button class="btn btn--secondary">Secondary</button>
<button class="btn btn--danger">Danger</button>
<button class="btn btn--outline">Outline</button>
<button class="btn btn--sm">Small</button>
<button class="btn btn--lg">Large</button>
```

### Card

```html
<article class="card">
  <header class="card__header">Title</header>
  <div class="card__body">Content</div>
  <footer class="card__footer">Footer</footer>
</article>
<article class="card card--elevated">...</article>
```

### Alert

```html
<div class="alert">Info message</div>
<div class="alert alert--success">Success!</div>
<div class="alert alert--warning">Warning</div>
<div class="alert alert--danger">Error</div>
```

### Badge

```html
<span class="badge">Default</span>
<span class="badge badge--primary">Primary</span>
<span class="badge badge--success">Success</span>
<span class="badge badge--danger">Danger</span>
```

### Navbar

```html
<nav class="navbar">
  <a class="navbar__brand" href="#">Brand</a>
  <ul class="navbar__links">
    <li><a class="navbar__link navbar__link--active" href="#">Link</a></li>
  </ul>
</nav>
```

### Progress Bar

```html
<div class="progress">
  <div class="progress__bar" style="width: 60%;"></div>
</div>
```

## Utilities

```css
/* display */
.flex, .grid, .block, .hidden

/* flexbox */
.items-center, .justify-between, .gap-sm, .gap-md

/* spacing */
.mt-sm, .mt-md, .mt-lg, .mb-md, .p-md

/* text */
.text-center, .text-muted, .text-sm, .font-bold

/* layout */
.container;
```

## Optional Features Implemented

1. **Dark Theme**: Add `class="theme-dark"` to `<body>` to enable dark mode
2. **Print Stylesheet**: Optimized for printing with simplified colors and hidden interactive elements

## Browser Support

Requires a modern browser with support for:

- CSS Cascade Layers (`@layer`)
- OKLCH color space
- Relative color syntax (`oklch(from ...)`)
