# Content Directory

This directory contains all content files for the Aethron.tech website.

## Structure

- `pages/` - Static pages (About, Services, Contact, etc.)
- `blog/` - Blog posts and articles

## Content Organization

### Pages
Place static content pages in the `pages/` directory:
- `about.md` - About page content
- `services.md` - Services page content  
- `contact.md` - Contact page content

### Blog
Place blog posts in the `blog/` directory:
- Follow naming convention: `YYYY-MM-DD-post-title.md`
- Include proper front matter with title, date, description, tags

## Front Matter Template

```yaml
---
layout: base.njk
title: "Page Title"
description: "Page description for SEO"
date: 2025-06-28
tags: ["tag1", "tag2"]
---
```
