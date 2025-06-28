module.exports = function(eleventyConfig) {
  // Add i18n filter for translations
  eleventyConfig.addFilter("t", function(language, key) {
    const i18nData = {
      en: require("./src/_data/i18n/en.json"),
      nl: require("./src/_data/i18n/nl.json")
    };
    
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

  // Add language helper filters
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
