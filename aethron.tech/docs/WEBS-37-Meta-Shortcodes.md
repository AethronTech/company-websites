# WEBS-37: Meta and OG Tags Shortcodes Documentation

This system provides flexible shortcodes for generating meta and OG tags per page, allowing for custom SEO optimization.

## Available Shortcodes

### 1. Basic Meta Tag Shortcode
```njk
{% meta "keywords", "technology, software, development" %}
{% meta "author", "Aethron Technologies" %}
{% meta "robots", "index, follow" %}
```

### 2. Open Graph Shortcode
```njk
{% og "title", "Custom Page Title" %}
{% og "description", "Custom page description for social sharing" %}
{% og "type", "article" %}
{% og "image", "https://example.com/custom-image.jpg" %}
```

### 3. Twitter Card Shortcode
```njk
{% twitter "card", "summary_large_image" %}
{% twitter "title", "Custom Twitter Title" %}
{% twitter "description", "Custom Twitter description" %}
{% twitter "image", "https://example.com/twitter-image.jpg" %}
```

### 4. Comprehensive SEO Shortcode
```njk
{% seo {
  title: "Custom Page Title",
  description: "Custom page description",
  keywords: "keyword1, keyword2, keyword3",
  author: "Author Name",
  ogType: "article",
  ogImage: "https://example.com/og-image.jpg",
  twitterCard: "summary_large_image",
  robots: "index, follow"
} %}
```

### 5. Auto OG Image Shortcode
```njk
<!-- Uses automatic page detection -->
{% ogImage %}

<!-- Or with custom image -->
{% ogImage "https://example.com/custom-og-image.jpg" %}
```

### 6. JSON-LD Structured Data Shortcode
```njk
{% jsonld {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Aethron Technologies",
  "url": "https://aethron.tech"
} %}
```

## Page-Level Customization

### Method 1: Front Matter Variables
```yaml
---
title: "Custom Page Title"
description: "Custom page description"
keywords: "technology, software, solutions"
author: "Aethron Technologies"
ogType: "article"
customOGImage: "https://aethron.tech/custom-image.jpg"
twitterCard: "summary"
robots: "index, follow"
structuredData: |
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Custom Page"
  }
---
```

### Method 2: Using Shortcodes in Templates
```njk
---
layout: base.njk
---

<!-- Custom meta tags for this specific page -->
{% meta "keywords", "specific, page, keywords" %}
{% og "type", "article" %}
{% twitter "card", "summary" %}

<!-- Page content here -->
```

### Method 3: Custom Meta Tags Variable
```njk
---
customMetaTags: |
  <meta name="custom-tag" content="custom-value">
  <meta property="custom:property" content="custom-content">
---
```

## Advanced Usage Examples

### Blog Post with Rich Metadata
```njk
---
title: "Understanding Modern Software Development"
description: "A comprehensive guide to modern software development practices and methodologies."
keywords: "software development, programming, agile, methodology"
author: "Aethron Technologies Team"
ogType: "article"
customOGImage: "/assets/images/blog/software-development-og.jpg"
structuredData: |
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Understanding Modern Software Development",
    "author": {
      "@type": "Organization",
      "name": "Aethron Technologies"
    },
    "datePublished": "2025-06-29",
    "image": "/assets/images/blog/software-development-og.jpg"
  }
---

<!-- Additional custom meta tags -->
{% meta "article:published_time", "2025-06-29T10:00:00Z" %}
{% meta "article:author", "Aethron Technologies Team" %}
{% og "article:section", "Technology" %}
```

### Product/Service Page
```njk
---
title: "Our Solutions - Aethron Technologies"
description: "Discover our comprehensive technology solutions designed for modern businesses."
keywords: "business solutions, enterprise software, digital transformation"
ogType: "website"
structuredData: |
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Technology Solutions",
    "provider": {
      "@type": "Organization",
      "name": "Aethron Technologies",
      "url": "https://aethron.tech"
    }
  }
---

<!-- Service-specific meta tags -->
{% meta "business:contact_data", "https://aethron.tech/contact" %}
{% og "business:contact_data", "https://aethron.tech/contact" %}
```

## System Features

1. **Automatic Fallbacks**: If no custom values are provided, the system falls back to default site values
2. **Multi-language Support**: All shortcodes respect the current page language context
3. **Flexible Integration**: Can be used in front matter, templates, or layout files
4. **SEO Optimized**: Generates proper meta tags for search engines and social media
5. **Structured Data**: Built-in support for JSON-LD structured data
6. **Modular Design**: Meta tags are separated into their own include file for easy maintenance

## Migration from Previous System

The new system is fully backward compatible. Existing pages will continue to work with default meta tags, while new pages can utilize the enhanced shortcode system for custom SEO optimization.
