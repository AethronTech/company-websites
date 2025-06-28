/**
 * WEBS-31: Client-side i18n Helper for Dynamic Content Rendering
 * Handles locale-sensitive formatting and dynamic content updates
 */

class AethronI18n {
  constructor() {
    this.currentLocale = document.documentElement.lang || 'en';
    this.config = this.loadConfig();
    this.init();
  }

  loadConfig() {
    // Basic configuration - could be loaded from JSON endpoint in production
    return {
      locales: {
        'en': {
          code: 'en',
          name: 'English',
          nativeName: 'English',
          dir: 'ltr',
          dateFormat: { locale: 'en-US', options: { year: 'numeric', month: 'long', day: 'numeric' } },
          numberFormat: { locale: 'en-US', currency: 'USD' }
        },
        'nl': {
          code: 'nl',
          name: 'Dutch',
          nativeName: 'Nederlands', 
          dir: 'ltr',
          dateFormat: { locale: 'nl-NL', options: { year: 'numeric', month: 'long', day: 'numeric' } },
          numberFormat: { locale: 'nl-NL', currency: 'EUR' }
        }
      },
      fallbackLocale: 'en'
    };
  }

  init() {
    this.formatNumbers();
    this.formatDates();
    this.formatCurrency();
    this.handleLocaleAttributes();
    this.setupDynamicUpdates();
  }

  // Format numbers according to locale
  formatNumbers() {
    const elements = document.querySelectorAll('.i18n-number');
    const locale = this.config.locales[this.currentLocale];
    
    elements.forEach(element => {
      const number = parseFloat(element.textContent || element.dataset.value);
      if (!isNaN(number)) {
        element.textContent = new Intl.NumberFormat(locale.numberFormat.locale).format(number);
      }
    });
  }

  // Format dates according to locale
  formatDates() {
    const elements = document.querySelectorAll('.i18n-date');
    const locale = this.config.locales[this.currentLocale];
    
    elements.forEach(element => {
      const dateValue = element.dataset.date || element.textContent;
      const date = new Date(dateValue);
      
      if (!isNaN(date.getTime())) {
        element.textContent = date.toLocaleDateString(
          locale.dateFormat.locale, 
          locale.dateFormat.options
        );
      }
    });
  }

  // Format currency according to locale
  formatCurrency() {
    const elements = document.querySelectorAll('.i18n-currency');
    const locale = this.config.locales[this.currentLocale];
    
    elements.forEach(element => {
      const amount = parseFloat(element.dataset.amount || element.textContent);
      if (!isNaN(amount)) {
        element.textContent = new Intl.NumberFormat(locale.numberFormat.locale, {
          style: 'currency',
          currency: locale.numberFormat.currency
        }).format(amount);
      }
    });
  }

  // Handle locale-specific attributes and styling
  handleLocaleAttributes() {
    const locale = this.config.locales[this.currentLocale];
    
    // Set direction attribute
    document.documentElement.setAttribute('dir', locale.dir);
    
    // Add locale-specific CSS classes
    document.body.classList.add(`locale-${this.currentLocale}`);
    
    // Handle RTL/LTR specific adjustments
    if (locale.dir === 'rtl') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.add('ltr');
    }
  }

  // Setup dynamic content updates
  setupDynamicUpdates() {
    // Listen for locale changes (could be triggered by language switcher)
    document.addEventListener('localeChange', (event) => {
      this.currentLocale = event.detail.locale;
      this.init(); // Re-initialize with new locale
    });

    // Handle dynamic content loading
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.formatDynamicContent(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Format newly added dynamic content
  formatDynamicContent(element) {
    // Format any new i18n elements that were added dynamically
    if (element.matches('.i18n-number') || element.querySelector('.i18n-number')) {
      this.formatNumbers();
    }
    if (element.matches('.i18n-date') || element.querySelector('.i18n-date')) {
      this.formatDates();
    }
    if (element.matches('.i18n-currency') || element.querySelector('.i18n-currency')) {
      this.formatCurrency();
    }
  }

  // Utility method to get localized text (for client-side use)
  t(key, fallback = null) {
    // This would typically fetch from a translations endpoint
    // For now, return fallback or key
    return fallback || `[${key}]`;
  }

  // Change locale programmatically
  changeLocale(newLocale) {
    if (this.config.locales[newLocale]) {
      this.currentLocale = newLocale;
      document.documentElement.lang = newLocale;
      
      // Trigger custom event for other components
      document.dispatchEvent(new CustomEvent('localeChange', {
        detail: { locale: newLocale }
      }));
      
      this.init();
    }
  }

  // Get current locale info
  getCurrentLocale() {
    return this.config.locales[this.currentLocale];
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.AethronI18n = new AethronI18n();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AethronI18n;
}
