# Aethron.Tech Website

Welcome to the official website repository for Aethron Technologies.

## 🚀 About Aethron

Aethron Technologies is a cutting-edge technology company focused on innovative solutions and digital transformation.

## 📁 Project Structure

```
aethron.tech/
├── README.md              # This file
├── package.json           # NPM package configuration
├── package-lock.json      # Dependency lock file
├── .eleventy.js          # Eleventy configuration
├── .gitignore            # Git ignore rules
├── .editorconfig         # Editor configuration
├── src/                  # Source code
│   ├── _layouts/         # Eleventy layout templates
│   │   └── base.njk     # Base HTML template
│   ├── _includes/        # Reusable components (to be added)
│   ├── _data/           # Site data files (to be added)
│   ├── assets/          # Static assets (to be added)
│   ├── css/             # Stylesheets (to be added)
│   ├── js/              # JavaScript files (to be added)
│   ├── images/          # Image files (to be added)
│   └── index.md         # Homepage content
└── _site/               # Built website (auto-generated)
```

## 🛠️ Development Setup

### Prerequisites

- Node.js (v18 or later)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/AethronTech/company-websites.git
cd company-websites/aethron.tech

# Install dependencies
npm install
```

### Development Commands

```bash
# Start development server with live reload
npm run dev

# Build the website for production
npm run build

# Serve the built website
npm run start

# Preview the website on port 8080
npm run preview

# Run tests (to be configured)
npm run test
```

## 🔧 Configuration

This project uses:
- **Eleventy (11ty)** - Static site generator for fast, modern websites
- **Nunjucks** - Template engine for layouts and components
- **Markdown** - Content authoring with front matter
- **EditorConfig** - Consistent coding styles across editors
- **Git** - Version control with proper ignore rules

## 🏗️ Architecture

### Eleventy Configuration
- **Input Directory**: `src/` - All source files
- **Output Directory**: `_site/` - Built website
- **Layouts**: `src/_layouts/` - HTML templates  
- **Includes**: `src/_includes/` - Reusable components
- **Data**: `src/_data/` - Global site data
- **Assets**: Static files copied to output

### Template Formats
- **Markdown** (.md) - Content pages with front matter
- **Nunjucks** (.njk) - Templates and layouts
- **HTML** (.html) - Static HTML files

## 📝 Contributing

1. Create a feature branch from `dev`
2. Make your changes
3. Test your changes
4. Merge to `dev` for staging
5. Merge to `main` for production

## 📄 License

© 2025 Aethron Technologies. All rights reserved.

## 📞 Contact

For questions or support, please contact the Aethron development team.

---

**Last Updated:** June 28, 2025  
**Version:** 1.0.0