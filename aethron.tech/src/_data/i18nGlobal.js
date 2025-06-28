module.exports = function() {
  const config = require("./i18n/config.json");
  return {
    languages: config.languages,
    defaultLanguage: config.defaultLanguage,
    fallbackLanguage: config.fallbackLanguage
  };
};
