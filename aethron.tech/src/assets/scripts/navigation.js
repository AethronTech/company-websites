// Enhanced Navigation & Language Switcher JavaScript
class NavigationController {
  constructor() {
    this.mobileToggle = document.querySelector('.mobile-menu-toggle');
    this.navMenu = document.querySelector('#nav-menu');
    this.langToggle = document.querySelector('.lang-toggle');
    this.langDropdown = document.querySelector('.lang-dropdown');
    this.currentLang = document.documentElement.lang || 'en';
    
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupLanguageSwitcher();
    this.setupKeyboardNavigation();
    this.setupClickOutside();
  }

  setupMobileMenu() {
    if (!this.mobileToggle || !this.navMenu) return;

    this.mobileToggle.addEventListener('click', () => {
      const isExpanded = this.mobileToggle.getAttribute('aria-expanded') === 'true';
      
      this.mobileToggle.setAttribute('aria-expanded', !isExpanded);
      this.navMenu.classList.toggle('open');
      document.body.classList.toggle('nav-open');
      
      // Trap focus when mobile menu is open
      if (!isExpanded) {
        this.trapFocus(this.navMenu);
      }
    });
  }

  setupLanguageSwitcher() {
    if (!this.langToggle || !this.langDropdown) return;

    this.langToggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleLanguageDropdown();
    });

    // Handle language selection
    const langOptions = this.langDropdown.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchLanguage(option.getAttribute('data-lang'), option.href);
      });
    });
  }

  toggleLanguageDropdown() {
    const isExpanded = this.langToggle.getAttribute('aria-expanded') === 'true';
    
    this.langToggle.setAttribute('aria-expanded', !isExpanded);
    this.langDropdown.setAttribute('aria-hidden', isExpanded);
    this.langDropdown.classList.toggle('open');

    if (!isExpanded) {
      // Focus first language option
      const firstOption = this.langDropdown.querySelector('.lang-option');
      if (firstOption) firstOption.focus();
    }
  }

  switchLanguage(langCode, url) {
    // Get current language from URL or default to 'en'
    const currentLang = window.location.pathname.startsWith('/nl/') ? 'nl' : 'en';
    
    // Track language switch event (WEBS-41: GA4 integration)
    if (typeof window.trackLanguageSwitch === 'function' && currentLang !== langCode) {
      window.trackLanguageSwitch(currentLang, langCode);
    }
    
    // Store language preference
    localStorage.setItem('preferred-language', langCode);
    
    // Add loading state
    this.langToggle.classList.add('loading');
    
    // Navigate to new language version
    window.location.href = url;
  }

  setupKeyboardNavigation() {
    // ESC key to close dropdowns
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllDropdowns();
      }
    });

    // Arrow key navigation in language dropdown
    if (this.langDropdown) {
      this.langDropdown.addEventListener('keydown', (e) => {
        const options = Array.from(this.langDropdown.querySelectorAll('.lang-option'));
        const currentIndex = options.findIndex(option => option === document.activeElement);

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % options.length;
            options[nextIndex].focus();
            break;
          case 'ArrowUp':
            e.preventDefault();
            const prevIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
            options[prevIndex].focus();
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            document.activeElement.click();
            break;
        }
      });
    }
  }

  setupClickOutside() {
    document.addEventListener('click', (e) => {
      // Close language dropdown if clicking outside
      if (!e.target.closest('.language-switcher')) {
        this.closeLangDropdown();
      }

      // Close mobile menu if clicking outside
      if (!e.target.closest('.main-navigation') && this.navMenu?.classList.contains('open')) {
        this.closeMobileMenu();
      }
    });
  }

  closeAllDropdowns() {
    this.closeLangDropdown();
    this.closeMobileMenu();
  }

  closeLangDropdown() {
    if (this.langToggle && this.langDropdown) {
      this.langToggle.setAttribute('aria-expanded', 'false');
      this.langDropdown.setAttribute('aria-hidden', 'true');
      this.langDropdown.classList.remove('open');
    }
  }

  closeMobileMenu() {
    if (this.mobileToggle && this.navMenu) {
      this.mobileToggle.setAttribute('aria-expanded', 'false');
      this.navMenu.classList.remove('open');
      document.body.classList.remove('nav-open');
    }
  }

  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }
}

// Language preference detection and redirect
function detectPreferredLanguage() {
  const storedLang = localStorage.getItem('preferred-language');
  const browserLang = navigator.language.split('-')[0];
  const supportedLangs = ['en', 'nl'];
  const currentPath = window.location.pathname;
  const currentLang = currentPath.split('/')[1];

  // If we're already on a language-specific path, don't redirect
  if (supportedLangs.includes(currentLang)) {
    return;
  }

  // Use stored preference, then browser language, then default to English
  const preferredLang = storedLang || (supportedLangs.includes(browserLang) ? browserLang : 'en');
  
  // Only redirect if not already on the preferred language
  if (preferredLang !== 'en' && !currentPath.startsWith(`/${preferredLang}/`)) {
    window.location.href = `/${preferredLang}${currentPath}`;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new NavigationController();
  
  // Only detect language preference on the homepage
  if (window.location.pathname === '/') {
    detectPreferredLanguage();
  }
});

// Handle page visibility changes (for better UX)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Close any open dropdowns when tab becomes hidden
    const nav = document.querySelector('.main-navigation');
    if (nav) {
      nav.querySelectorAll('.open').forEach(el => el.classList.remove('open'));
    }
  }
});
