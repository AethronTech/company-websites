module.exports = function(eleventyConfig) {

  // Add i18n filter for translations
  eleventyConfig.addFilter("t", function(key, language) {
    // If language is not provided, try to get it from the current page context
    if (!language) {
      language = this.ctx?.lang || 'en';
    }
    
    const i18nData = {
      en: require("./src/_data/i18n/en.json"),
      nl: require("./src/_data/i18n/nl.json")
    };
    
    if (!i18nData[language]) {
      language = 'en';
    }
    
    const keys = key.split('.');
    let value = i18nData[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = i18nData.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return `[Missing: ${key}]`;
          }
        }
        break;
      }
    }
    
    return value || `[Missing: ${key}]`;
  });

  // Language helper filters
  eleventyConfig.addFilter("langNativeName", function(language = "en") {
    const config = require("./src/_data/i18n/config.json");
    const lang = config.languages.find(l => l.code === language);
    return lang ? lang.nativeName : language;
  });

  eleventyConfig.addFilter("langDir", function(language = "en") {
    const config = require("./src/_data/i18n/config.json");
    const lang = config.languages.find(l => l.code === language);
    return lang ? lang.dir : "ltr";
  });
  
  // Locale-sensitive formatting filters
  eleventyConfig.addFilter("formatDate", function(date, language = "en", format = "long") {
    const config = require("./src/_data/i18n/config.json");
    const langConfig = config.dateFormats[language] || config.dateFormats.en;
    
    const dateObj = new Date(date);
    
    if (format === "iso") {
      return dateObj.toISOString();
    }
    
    return dateObj.toLocaleDateString(langConfig.locale, {
      year: "numeric",
      month: format === "long" ? "long" : "short",
      day: "numeric"
    });
  });
  
  eleventyConfig.addFilter("formatNumber", function(number, language = "en") {
    const config = require("./src/_data/i18n/config.json");
    const langConfig = config.numberFormats[language] || config.numberFormats.en;
    
    return new Intl.NumberFormat(langConfig.locale).format(number);
  });
  
  eleventyConfig.addFilter("formatCurrency", function(amount, language = "en") {
    const config = require("./src/_data/i18n/config.json");
    const langConfig = config.numberFormats[language] || config.numberFormats.en;
    
    return new Intl.NumberFormat(langConfig.locale, {
      style: 'currency',
      currency: langConfig.currency
    }).format(amount);
  });
  
  // Locale-aware URL helper
  eleventyConfig.addFilter("localizeUrl", function(url, language = "en") {
    const config = require("./src/_data/i18n/config.json");
    
    // Don't prefix default language
    if (language === config.defaultLanguage) {
      return url;
    }
    
    // Add language prefix
    const cleanUrl = url.replace(/^\/+/, '');
    return `/${language}/${cleanUrl}`;
  });

  // Get alternate language URL
  eleventyConfig.addFilter("alternateUrl", function(currentUrl, targetLanguage) {
    const config = require("./src/_data/i18n/config.json");
    
    // Remove language prefix from current URL
    let cleanUrl = currentUrl;
    for (const lang of config.languages) {
      if (lang.code !== config.defaultLanguage) {
        const prefix = `/${lang.code}/`;
        if (cleanUrl.startsWith(prefix)) {
          cleanUrl = cleanUrl.substring(prefix.length - 1);
          break;
        }
      }
    }
    
    // Add target language prefix
    return eleventyConfig.getFilter("localizeUrl").call(this, cleanUrl, targetLanguage);
  });

  // Get available languages for current page
  eleventyConfig.addFilter("getAvailableLanguages", function() {
    const config = require("./src/_data/i18n/config.json");
    return config.languages;
  });

  // Get current language from URL
  eleventyConfig.addFilter("getCurrentLanguage", function(url) {
    const config = require("./src/_data/i18n/config.json");
    
    for (const lang of config.languages) {
      if (lang.code !== config.defaultLanguage && url.startsWith(`/${lang.code}/`)) {
        return lang.code;
      }
    }
    return config.defaultLanguage;
  });
  
  // Copy static assets with organized directory structure
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/css");      // Legacy support
  eleventyConfig.addPassthroughCopy("src/js");       // Legacy support  
  eleventyConfig.addPassthroughCopy("src/images");   // Legacy support
  eleventyConfig.addPassthroughCopy("src/fonts");    // Legacy support
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/sitemap.xml");
  
  // Watch for changes in asset directories
  eleventyConfig.addWatchTarget("src/assets/");
  eleventyConfig.addWatchTarget("src/css/");         // Legacy support
  eleventyConfig.addWatchTarget("src/js/");          // Legacy support
  
  // Set custom date format filter
  eleventyConfig.addFilter("dateDisplay", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  });
  
  // Add custom collections for organized content
  eleventyConfig.addCollection("posts", function(collection) {
    return collection.getFilteredByGlob("src/posts/*.md");
  });
  
  eleventyConfig.addCollection("blogPosts", function(collection) {
    return collection.getFilteredByGlob("src/content/blog/*.md");
  });
  
  eleventyConfig.addCollection("pages", function(collection) {
    return collection.getFilteredByGlob("src/content/pages/*.md");
  });

  // Add i18n-specific collections
  eleventyConfig.addCollection("englishPages", function(collection) {
    return collection.getAll().filter(function(item) {
      return item.data.lang === 'en' || (!item.data.lang && !item.inputPath.includes('/nl/'));
    });
  });

  eleventyConfig.addCollection("dutchPages", function(collection) {
    return collection.getAll().filter(function(item) {
      return item.data.lang === 'nl' || item.inputPath.includes('/nl/');
    });
  });

  // Collection for all pages by language
  eleventyConfig.addCollection("pagesByLanguage", function(collection) {
    const pages = {
      en: [],
      nl: []
    };
    
    collection.getAll().forEach(function(item) {
      const lang = item.data.lang || (item.inputPath.includes('/nl/') ? 'nl' : 'en');
      if (pages[lang]) {
        pages[lang].push(item);
      }
    });
    
    return pages;
  });

  // Navigation collection per language
  eleventyConfig.addCollection("navigationItems", function(collection) {
    const config = require("./src/_data/i18n/config.json");
    const nav = {};
    
    config.languages.forEach(lang => {
      nav[lang.code] = collection.getAll()
        .filter(item => {
          const itemLang = item.data.lang || (item.inputPath.includes('/nl/') ? 'nl' : 'en');
          return itemLang === lang.code && item.data.eleventyNavigation;
        })
        .sort((a, b) => (a.data.eleventyNavigation.order || 0) - (b.data.eleventyNavigation.order || 0));
    });
    
    return nav;
  });
  
  // Set up markdown processing
  const markdownIt = require("markdown-it");
  const markdownItAnchor = require("markdown-it-anchor");
  
  const markdownLib = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: "after",
      class: "direct-link"
    })
  });
  
  eleventyConfig.setLibrary("md", markdownLib);
  
  // Configure build options
  eleventyConfig.setQuietMode(true);
  
  // WEBS-37: Meta and OG tag shortcodes for per-page customization
  
  // Meta tag shortcode
  eleventyConfig.addShortcode("meta", function(name, content, property = false) {
    const attr = property ? 'property' : 'name';
    return `<meta ${attr}="${name}" content="${content}">`;
  });
  
  // OG tag shortcode (Open Graph)
  eleventyConfig.addShortcode("og", function(property, content) {
    return `<meta property="og:${property}" content="${content}">`;
  });
  
  // Twitter Card shortcode
  eleventyConfig.addShortcode("twitter", function(name, content) {
    return `<meta name="twitter:${name}" content="${content}">`;
  });
  
  // Comprehensive SEO shortcode with all meta tags
  eleventyConfig.addShortcode("seo", function(options = {}) {
    const lang = this.ctx?.lang || 'en';
    const site = this.ctx?.site?.site || {};
    const page = this.ctx?.page || {};
    
    // Merge default options with provided options
    const seoData = {
      title: options.title || this.ctx?.title,
      description: options.description || this.ctx?.description,
      keywords: options.keywords,
      author: options.author || site.author,
      ogType: options.ogType || 'website',
      ogImage: options.ogImage,
      twitterCard: options.twitterCard || 'summary_large_image',
      canonical: options.canonical || `${site.url}${page.url}`,
      robots: options.robots || 'index, follow',
      ...options
    };
    
    let metaTags = [];
    
    // Basic meta tags
    if (seoData.description) {
      metaTags.push(`<meta name="description" content="${seoData.description}">`);
    }
    if (seoData.keywords) {
      metaTags.push(`<meta name="keywords" content="${seoData.keywords}">`);
    }
    if (seoData.author) {
      metaTags.push(`<meta name="author" content="${seoData.author}">`);
    }
    if (seoData.robots) {
      metaTags.push(`<meta name="robots" content="${seoData.robots}">`);
    }
    
    // Open Graph tags
    if (seoData.title) {
      metaTags.push(`<meta property="og:title" content="${seoData.title}">`);
    }
    if (seoData.description) {
      metaTags.push(`<meta property="og:description" content="${seoData.description}">`);
    }
    if (seoData.ogType) {
      metaTags.push(`<meta property="og:type" content="${seoData.ogType}">`);
    }
    if (seoData.canonical) {
      metaTags.push(`<meta property="og:url" content="${seoData.canonical}">`);
    }
    if (seoData.ogImage) {
      metaTags.push(`<meta property="og:image" content="${seoData.ogImage}">`);
      metaTags.push(`<meta property="og:image:width" content="1200">`);
      metaTags.push(`<meta property="og:image:height" content="630">`);
      metaTags.push(`<meta property="og:image:type" content="image/png">`);
    }
    
    // Twitter Card tags
    if (seoData.twitterCard) {
      metaTags.push(`<meta name="twitter:card" content="${seoData.twitterCard}">`);
    }
    if (seoData.title) {
      metaTags.push(`<meta name="twitter:title" content="${seoData.title}">`);
    }
    if (seoData.description) {
      metaTags.push(`<meta name="twitter:description" content="${seoData.description}">`);
    }
    if (seoData.ogImage) {
      metaTags.push(`<meta name="twitter:image" content="${seoData.ogImage}">`);
    }
    
    // Canonical link
    if (seoData.canonical) {
      metaTags.push(`<link rel="canonical" href="${seoData.canonical}">`);
    }
    
    return metaTags.join('\n  ');
  });
  
  // JSON-LD structured data shortcode
  eleventyConfig.addShortcode("jsonld", function(data) {
    const structuredData = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return `<script type="application/ld+json">\n${structuredData}\n</script>`;
  });
  
  // Page-specific OG image shortcode with automatic fallback
  eleventyConfig.addShortcode("ogImage", function(customImage) {
    const lang = this.ctx?.lang || 'en';
    const page = this.ctx?.page || {};
    const site = this.ctx?.site?.site || {};
    
    let ogImage = customImage;
    
    // If no custom image provided, determine based on page URL
    if (!ogImage) {
      let pageType = 'home';
      
      if (page.url) {
        if (page.url.includes('/about') || page.url.includes('/over')) {
          pageType = 'about';
        } else if (page.url.includes('/solutions') || page.url.includes('/oplossingen')) {
          pageType = 'solutions';
        } else if (page.url.includes('/contact')) {
          pageType = 'contact';
        } else if (page.url.includes('/privacy')) {
          pageType = 'privacy';
        } else if (page.url.includes('/terms') || page.url.includes('/voorwaarden')) {
          pageType = 'terms';
        }
      }
      
      ogImage = `${site.url}/assets/images/og/og-${pageType}-${lang}.png`;
    }
    
    return `<meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta name="twitter:image" content="${ogImage}">`;
  });
  
  // Directory configuration
  return {
    dir: {
      input: "src",
      output: "_site", 
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    templateFormats: [
      "md",
      "njk", 
      "html",
      "liquid"
    ],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
