module.exports = function(eleventyConfig) {
  // Enhanced i18n system with better caching and error handling
  const i18nCache = new Map();
  
  function loadI18nData(language) {
    if (!i18nCache.has(language)) {
      try {
        const data = require(`./src/_data/i18n/${language}.json`);
        i18nCache.set(language, data);
      } catch (error) {
        console.warn(`[I18N] Warning: Could not load language file for '${language}'. Using fallback.`);
        return null;
      }
    }
    return i18nCache.get(language);
  }
  
  // Enhanced translation filter with better fallback and interpolation
  eleventyConfig.addFilter("t", function(language, key, interpolations = {}) {
    const fallbackLang = 'en';
    
    // Get translation data
    let data = loadI18nData(language);
    let fallbackData = language !== fallbackLang ? loadI18nData(fallbackLang) : null;
    
    // Helper function to get nested value
    function getNestedValue(obj, keyPath) {
      return keyPath.split('.').reduce((current, key) => {
        return current && typeof current === 'object' ? current[key] : undefined;
      }, obj);
    }
    
    // Try to get value from primary language
    let value = data ? getNestedValue(data, key) : undefined;
    
    // Fallback to default language if not found
    if (value === undefined && fallbackData) {
      value = getNestedValue(fallbackData, key);
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[I18N] Using fallback for key '${key}' in language '${language}'`);
      }
    }
    
    // If still not found, return error indicator
    if (value === undefined) {
      return `[Missing: ${key}]`;
    }
    
    // Handle interpolations (e.g., {{name}} in strings)
    if (typeof value === 'string' && Object.keys(interpolations).length > 0) {
      value = value.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return interpolations[key] !== undefined ? interpolations[key] : match;
      });
    }
    
    return value;
  });
  
  // Global function to get translations (for use in templates)
  eleventyConfig.addGlobalData("i18n", function() {
    return {
      t: (key, interpolations = {}) => {
        // This will be available in templates as i18n.t()
        return (language) => {
          return this.t(language, key, interpolations);
        };
      }
    };
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
