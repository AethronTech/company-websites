module.exports = {
  url: process.env.NODE_ENV === 'production'
    ? 'https://aethron.tech'
    : 'http://localhost:8082',
  title: 'Aethron Technologies',
  description: 'Digital solutions for IT professionals',
  author: 'Aethron Technologies',
  buildTime: new Date(),
  // Google Analytics 4 Configuration
  analytics: {
    ga4: {
      // GA4 Measurement ID
      measurementId: process.env.GA4_MEASUREMENT_ID || 'G-82YVN907TD',
      // Privacy-compliant settings
      config: {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_expires: 63072000, // 2 years in seconds
        cookie_update: true,
        cookie_flags: 'SameSite=Lax;Secure'
      }
    }
  }
};
