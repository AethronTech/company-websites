module.exports = function(eleventyConfig) {
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
