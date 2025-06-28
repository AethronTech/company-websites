# Assets Directory

This directory contains all static assets for the Aethron.tech website.

## Structure

- `styles/` - CSS and SCSS files
- `scripts/` - JavaScript files
- `images/` - Image files (photos, graphics, icons)
- `fonts/` - Custom font files

## Organization Guidelines

### Styles (`styles/`)
- `main.css` - Primary stylesheet
- `components/` - Component-specific styles
- `utilities/` - Utility classes
- `variables.css` - CSS custom properties

### Scripts (`scripts/`)
- `main.js` - Primary JavaScript file
- `components/` - Component-specific scripts
- `utils/` - Utility functions

### Images (`images/`)
- `logos/` - Company logos and branding
- `photos/` - Photography and hero images
- `icons/` - Icon files and graphics
- `backgrounds/` - Background images

### Fonts (`fonts/`)
- Web font files (woff, woff2, etc.)
- Font license files

## Build Process

All assets in this directory are copied to the build output via Eleventy passthrough copy configuration in `.eleventy.js`.
