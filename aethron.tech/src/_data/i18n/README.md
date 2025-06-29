# Internationalization (i18n) Implementation

## Overview

This implementation provides a complete internationalization system for the Aethron Technologies website using Eleventy (11ty). The system supports multiple languages with structured JSON translation files and flexible template helpers.

## Supported Languages

- **English (en)** - Default language
- **Dutch (nl)** - Nederlands

## File Structure

```
src/
├── _data/
│   └── i18n/
│       ├── config.json     # Language configuration
│       ├── en.json         # English translations
│       ├── nl.json         # Dutch translations
│       └── helpers.js      # i18n helper functions
├── _includes/
│   ├── head.njk           # Language-aware meta tags
│   ├── navigation.njk     # Multi-language navigation
│   └── footer.njk         # Localized footer
├── _layouts/
│   └── base.njk           # Language-aware base layout
├── assets/styles/
│   └── i18n.css           # i18n-specific styles
├── index.njk              # English homepage
└── nl/
    └── index.njk          # Dutch homepage
```

## Translation System

### Translation Files

Translation data is organized in JSON files under `src/_data/i18n/`:

- `en.json` - English translations
- `nl.json` - Dutch translations
- `config.json` - Language configuration and metadata

### Using Translations in Templates

Use the `t` filter to access translations:

```njk
{{ lang | t: "homepage.hero.title" }}
{{ lang | t: "navigation.about" }}
{{ lang | t: "common.contact_us" }}
```

### Accessing Arrays and Objects

Access nested translation data directly:

```njk
{% for value in i18n[lang].homepage.about.values %}
  <li>{{ value }}</li>
{% endfor %}

{% for service in i18n[lang].homepage.services.items %}
  <h3>{{ service.title }}</h3>
  <p>{{ service.description }}</p>
{% endfor %}
```

## Available Helper Filters

### Translation Filters

- `t` - Get translation by key: `{{ lang | t: "key.path" }}`
- `langCode` - Get language code: `{{ lang | langCode }}`
- `langName` - Get language name: `{{ lang | langName }}`
- `langNativeName` - Get native language name: `{{ lang | langNativeName }}`
- `langDir` - Get text direction: `{{ lang | langDir }}`

### Localization Filters

- `localizeDate` - Format dates by locale: `{{ date | localizeDate: lang, "long" }}`
- `localizeNumber` - Format numbers by locale: `{{ number | localizeNumber: lang }}`
- `localizeCurrency` - Format currency by locale: `{{ amount | localizeCurrency: lang }}`

## Page Setup

### Front Matter

Add language code to page front matter:

```yaml
---
layout: layout.njk
lang: en
title: "homepage.hero.title"
description: "site.description"
---
```

### Language-Specific Pages

Create language-specific directories:

```
src/
├── index.njk          # English (default)
├── about.njk          # English about page
└── nl/
    ├── index.njk      # Dutch homepage
    └── about.njk      # Dutch about page
```

## SEO and Meta Tags

The system automatically generates:

- Language-specific meta tags
- Hreflang attributes for SEO
- Open Graph localization
- Canonical URLs

## Language Switching

### Navigation

The navigation includes a language switcher with:

- Dropdown select for language choice
- JavaScript function for URL switching
- Current language highlighting

### Footer Links

Language links are also available in the footer:

```njk
{% for language in i18nConfig.languages %}
<a href="/{{ language.code }}/" 
   class="footer-lang-link {% if language.code == lang %}active{% endif %}">
  {{ language.nativeName }}
</a>
{% endfor %}
```

## URL Structure

- English (default): `/`, `/about/`, `/contact/`
- Dutch: `/nl/`, `/nl/about/`, `/nl/contact/`

## Styling

Language-specific styles are available:

```css
.lang-en { /* English-specific styles */ }
.lang-nl { /* Dutch-specific styles */ }

[dir="rtl"] { /* RTL language support */ }
```

## Configuration

### Adding New Languages

1. Create translation file: `src/_data/i18n/[code].json`
2. Update `config.json` with language metadata
3. Add language to helpers.js if needed
4. Create language-specific pages

### Translation Keys

Follow the hierarchical structure:

```json
{
  "site": {
    "title": "Site Title",
    "description": "Site Description"
  },
  "navigation": {
    "home": "Home",
    "about": "About"
  },
  "homepage": {
    "hero": {
      "title": "Hero Title",
      "subtitle": "Hero Subtitle"
    }
  }
}
```

## Development

### Testing

Test the i18n system by:

1. Building the site: `npm run build`
2. Serving locally: `npm run serve`
3. Visiting both language versions:
   - English: `http://localhost:8080/`
   - Dutch: `http://localhost:8080/nl/`

### Debugging

- Check browser console for JavaScript errors
- Verify translation keys exist in JSON files
- Ensure proper front matter in pages
- Validate HTML lang attributes

## Best Practices

1. **Consistent Key Structure** - Use consistent hierarchical keys
2. **Fallback Handling** - System falls back to English for missing keys
3. **SEO Optimization** - Include hreflang and proper meta tags
4. **Accessibility** - Use proper lang attributes and direction
5. **Performance** - Translation data is loaded once during build

## Future Enhancements

- Additional language support (French, German, etc.)
- Dynamic content localization
- Date/time formatting per locale
- Number and currency formatting
- Pluralization rules
- Translation management system integration
