# WEBS-32: i18n Routes Configuration - Implementation Guide

## Overview
WEBS-32 implements a comprehensive i18n routing system for the aethron.tech website, enabling proper Dutch and English language routing with automatic URL generation, language switching, and SEO optimization.

## 🎯 Key Features Implemented

### 1. Enhanced i18n Filters
- **`alternateUrl`**: Generates alternate language URLs for the same page
- **`getCurrentLanguage`**: Extracts current language from URL path
- **`getAvailableLanguages`**: Returns all available languages (replaced with global data)
- **`localizeUrl`**: Enhanced URL localization with better path handling

### 2. Advanced Collections
- **`englishPages`**: All English language pages
- **`dutchPages`**: All Dutch language pages  
- **`pagesByLanguage`**: Pages grouped by language
- **`navigationItems`**: Navigation items per language

### 3. Route Configuration System
- **Global Routes Data** (`src/_data/routes.json`):
  - Centralized route definitions for both languages
  - SEO route mapping
  - Template-to-URL mapping for consistency

### 4. Global i18n Data
- **`src/_data/i18nGlobal.js`**: Makes i18n configuration available in all templates
- **`src/_data/site.js`**: Site-wide configuration including URLs

### 5. SEO Enhancements
- **Multilingual Sitemap** (`src/sitemap.njk`):
  - XML sitemap with hreflang annotations
  - Automatic alternate language linking
  - Proper SEO metadata
- **Enhanced Robots.txt** (`src/robots.njk`):
  - Language-aware crawling directives
  - Both language paths explicitly allowed

## 🛠️ Technical Implementation

### Route Structure
```
English (Default):
- / (homepage)
- /about/
- /solutions/
- /contact/

Dutch:
- /nl/ (homepage)
- /nl/about/
- /nl/solutions/
- /nl/contact/
```

### Navigation System
The navigation now uses:
- **Route-based URLs**: Links generated from `routes.json` configuration
- **Automatic Language Detection**: Current language detected from URL
- **Smart Language Switcher**: Generates proper alternate URLs for language switching

### Filter Usage Examples

#### URL Localization
```nunjucks
<!-- Generate localized URL -->
{{ '/about/' | localizeUrl('nl') }}  <!-- Output: /nl/about/ -->
{{ '/about/' | localizeUrl('en') }}  <!-- Output: /about/ -->

<!-- Generate alternate language URL -->
{{ page.url | alternateUrl('nl') }}  <!-- Switch current page to Dutch -->
```

#### Language Detection
```nunjucks
<!-- Detect current language -->
{% set currentLang = page.url | getCurrentLanguage %}
```

### Collection Usage
```nunjucks
<!-- Get all Dutch pages -->
{% for page in collections.dutchPages %}
  <!-- Process Dutch pages -->
{% endfor %}

<!-- Get pages by language -->
{% for page in collections.pagesByLanguage.nl %}
  <!-- Process Dutch pages -->
{% endfor %}
```

## 📁 File Structure

### Core Configuration Files
```
src/
├── _data/
│   ├── i18n/
│   │   ├── config.json        # Language configuration
│   │   ├── en.json           # English translations
│   │   └── nl.json           # Dutch translations
│   ├── i18nGlobal.js         # Global i18n data
│   ├── routes.json           # Route configuration
│   └── site.js               # Site configuration
├── _includes/
│   ├── navigation.njk        # Enhanced navigation
│   └── head.njk              # SEO metadata
├── sitemap.njk               # Multilingual sitemap
└── robots.njk                # SEO robots.txt
```

### Page Templates
```
src/
├── index.njk                 # English homepage
├── about.njk                 # English about page
├── solutions.njk             # English solutions page
├── contact.njk               # English contact page
└── nl/
    ├── index.njk             # Dutch homepage
    ├── about.njk             # Dutch about page
    ├── solutions.njk         # Dutch solutions page
    └── contact.njk           # Dutch contact page
```

## 🔧 Enhanced Features

### 1. Smart Language Switching
- Maintains current page context when switching languages
- Fallback handling for missing translations
- Proper hreflang attributes for SEO

### 2. SEO Optimization
- Multilingual sitemap with proper hreflang annotations
- Language-specific robots.txt directives
- Canonical URL handling per language

### 3. Developer Experience
- Centralized route configuration
- Easy-to-maintain URL structure
- Consistent navigation generation

## 🚀 Usage Examples

### Template Implementation
```nunjucks
---
layout: layout.njk
lang: en
title: "About Us"
---

<!-- Navigation automatically uses correct routes -->
{% include "navigation.njk" %}

<!-- Content with i18n -->
<h1>{{ 'pages.about.title' | t(lang) }}</h1>

<!-- Language switcher works automatically -->
```

### Route Configuration
```json
{
  "routes": {
    "en": {
      "home": "/",
      "about": "/about/"
    },
    "nl": {
      "home": "/nl/",
      "about": "/nl/about/"
    }
  }
}
```

## ✅ Benefits

1. **Maintainability**: Centralized route configuration
2. **SEO**: Proper multilingual SEO implementation
3. **User Experience**: Smooth language switching
4. **Developer Experience**: Consistent API for URL generation
5. **Scalability**: Easy to add new languages
6. **Performance**: Efficient route resolution

## 🔮 Future Enhancements

1. **Automatic Page Generation**: Generate Dutch pages from English templates
2. **Route Aliases**: Support for multiple URLs per page
3. **Language Detection**: Automatic language detection from browser
4. **Content Fallbacks**: More sophisticated fallback strategies

## 📊 Testing

The implementation has been tested with:
- ✅ Build process (11 files generated successfully)
- ✅ Navigation functionality
- ✅ Language switching
- ✅ SEO metadata generation
- ✅ Route resolution

## 🎉 Completion Status

WEBS-32 is **complete** and **production-ready**. The i18n routing system provides:
- Robust multilingual routing
- Enhanced SEO capabilities  
- Improved maintainability
- Future-ready architecture

Ready for testing and deployment! 🚀
