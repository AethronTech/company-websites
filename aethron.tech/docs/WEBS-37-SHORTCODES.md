# WEBS-37: Meta and OG Tags Shortcodes Documentation

## Overview
This feature adds powerful shortcodes for generating meta and Open Graph tags per page in the Aethron Technologies website. The shortcodes allow for flexible, page-specific SEO and social media optimization.

## Available Shortcodes

### 1. `{% meta %}` - Basic Meta Tag
Creates standard HTML meta tags.

**Syntax:**
```njk
{% meta "name", "content" %}
{% meta "property", "content", true %}  // For property-based meta tags
```

**Examples:**
```njk
{% meta "keywords", "technology, software, development" %}
{% meta "author", "Aethron Technologies" %}
{% meta "robots", "index, follow" %}
{% meta "og:title", "Custom Title", true %}
```

### 2. `{% og %}` - Open Graph Tags
Creates Open Graph meta tags for social media sharing.

**Syntax:**
```njk
{% og "property", "content" %}
```

**Examples:**
```njk
{% og "title", "Custom Page Title" %}
{% og "description", "This is a custom description for social sharing" %}
{% og "type", "article" %}
{% og "image", "https://example.com/custom-image.png" %}
```

### 3. `{% twitter %}` - Twitter Card Tags
Creates Twitter-specific meta tags.

**Syntax:**
```njk
{% twitter "name", "content" %}
```

**Examples:**
```njk
{% twitter "card", "summary_large_image" %}
{% twitter "site", "@AethronTech" %}
{% twitter "creator", "@AethronTech" %}
```

### 4. `{% seo %}` - Comprehensive SEO Shortcode
Creates a complete set of SEO meta tags with one shortcode.

**Syntax:**
```njk
{% seo {
  title: "Custom Title",
  description: "Custom description",
  keywords: "keyword1, keyword2",
  author: "Author Name",
  ogType: "website",
  ogImage: "https://example.com/image.png",
  twitterCard: "summary_large_image",
  canonical: "https://example.com/page",
  robots: "index, follow"
} %}
```

**Example:**
```njk
{% seo {
  title: "About Aethron Technologies",
  description: "Learn about our people-centric approach to software development",
  keywords: "aethron, technology, software, development, ITIL, agile",
  ogType: "website",
  ogImage: "https://aethron.tech/assets/images/og/og-about-en.png"
} %}
```

### 5. `{% jsonld %}` - JSON-LD Structured Data
Creates structured data scripts for enhanced SEO.

**Syntax:**
```njk
{% jsonld data %}
```

**Examples:**
```njk
{% jsonld {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Aethron Technologies",
  "url": "https://aethron.tech"
} %}

{% jsonld '{"@context": "https://schema.org", "@type": "WebPage", "name": "About Us"}' %}
```

### 6. `{% ogImage %}` - Smart OG Image Selection
Automatically selects the appropriate OG image or uses a custom one.

**Syntax:**
```njk
{% ogImage %}  // Auto-detects based on page
{% ogImage "https://example.com/custom-image.png" %}  // Custom image
```

**Examples:**
```njk
<!-- Auto-detect based on page URL -->
{% ogImage %}

<!-- Custom image -->
{% ogImage "https://aethron.tech/assets/images/special-og-image.png" %}
```

## Usage in Page Templates

### Method 1: Individual Shortcodes in Page Front Matter
```njk
---
layout: base.njk
title: About Us
customMeta: true
---

{% if customMeta %}
{% meta "keywords", "aethron, about, company, software development" %}
{% og "type", "website" %}
{% twitter "card", "summary_large_image" %}
{% endif %}

<!-- Page content here -->
```

### Method 2: Using the SEO Shortcode
```njk
---
layout: base.njk
title: Solutions
---

{% seo {
  title: "Our Solutions - Aethron Technologies",
  description: "Discover our flexible technological solutions designed for people",
  keywords: "solutions, technology, software, custom development",
  ogType: "website"
} %}

<!-- Page content here -->
```

### Method 3: Custom Variables in Front Matter
Pages can set custom variables that the meta-tags.njk include will use:

```njk
---
layout: base.njk
title: Contact
description: "Get in touch with Aethron Technologies for your software needs"
keywords: "contact, aethron, technology, software"
author: "Aethron Technologies"
customOGImage: "https://aethron.tech/assets/images/contact-special.png"
ogType: "website"
robots: "index, follow"
---

<!-- The meta-tags.njk include will automatically use these variables -->
```

## Advanced Usage

### Conditional Meta Tags
```njk
{% if page.url == "/" %}
  {% og "type", "website" %}
{% else %}
  {% og "type", "article" %}
{% endif %}
```

### Language-Specific Meta Tags
```njk
{% if lang == "nl" %}
  {% meta "description", "Nederlandse beschrijving" %}
{% else %}
  {% meta "description", "English description" %}
{% endif %}
```

### Structured Data for Organization
```njk
{% jsonld {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Aethron Technologies",
  "url": "https://aethron.tech",
  "description": "People-centric software solutions",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Antwerpen",
    "addressCountry": "BE"
  }
} %}
```

## Migration from Old System

The new shortcode system is **fully backward compatible**. Existing pages will continue to work with the automatic meta tag generation in `meta-tags.njk`.

To migrate a page to use shortcodes:

1. **Keep existing functionality**: The `meta-tags.njk` include still handles basic meta tags
2. **Add custom shortcodes**: Use shortcodes for page-specific enhancements
3. **Override defaults**: Set `skipBasicMeta: true` or `skipOGTags: true` in front matter to fully customize

## Performance Notes

- Shortcodes are processed at build time, not runtime
- No performance impact on website loading
- Generated HTML is optimized and cached
- All meta tags are properly escaped for security

## Best Practices

1. **Use the SEO shortcode** for comprehensive meta tag management
2. **Set custom OG images** for important pages
3. **Include structured data** for better search engine understanding
4. **Test social sharing** using Facebook's and Twitter's debugging tools
5. **Keep descriptions** under 160 characters for meta descriptions
6. **Use relevant keywords** but avoid keyword stuffing

## Testing Your Meta Tags

### Facebook Sharing Debugger
https://developers.facebook.com/tools/debug/

### Twitter Card Validator
https://cards-dev.twitter.com/validator

### Google Rich Results Test
https://search.google.com/test/rich-results

## File Locations

- **Shortcode definitions**: `.eleventy.js` (lines 246-364)
- **Meta tags include**: `src/_includes/meta-tags.njk`
- **Head template**: `src/_includes/head.njk`
- **OG images**: `src/assets/images/og/`

## Support

For questions about using these shortcodes, refer to this documentation or check the example implementations in the existing page templates.
