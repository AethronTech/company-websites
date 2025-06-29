#!/usr/bin/env node

/**
 * WEBS-49: Alternative OG Validation Script
 * Uses direct HTML parsing instead of open-graph-scraper
 */

const https = require('https');
const http = require('http');
const fs = require('fs').promises;
const { URL } = require('url');

// Configuration
const BASE_URL = process.env.SITE_URL || 'http://localhost:8080';
const TIMEOUT = 30000;

// Pages to test
const PAGES_TO_TEST = [
  { url: '/', name: 'Homepage EN', expectedImage: 'og-home-en.png' },
  { url: '/about/', name: 'About EN', expectedImage: 'og-about-en.png' },
  { url: '/solutions/', name: 'Solutions EN', expectedImage: 'og-solutions-en.png' },
  { url: '/contact/', name: 'Contact EN', expectedImage: 'og-contact-en.png' },
  { url: '/nl/', name: 'Homepage NL', expectedImage: 'og-home-nl.png' },
  { url: '/nl/over/', name: 'About NL', expectedImage: 'og-about-nl.png' },
  { url: '/nl/oplossingen/', name: 'Solutions NL', expectedImage: 'og-solutions-nl.png' },
  { url: '/nl/contact/', name: 'Contact NL', expectedImage: 'og-contact-nl.png' }
];

// Required OG properties
const REQUIRED_OG_PROPERTIES = [
  'og:title',
  'og:description', 
  'og:url',
  'og:type',
  'og:site_name',
  'og:image'
];

// Validation results
let results = {
  passed: 0,
  failed: 0,
  errors: [],
  details: []
};

/**
 * Fetch HTML content from URL
 */
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const request = client.get(url, {
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 OG-Validator/1.0'
      }
    }, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        }
      });
    });
    
    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Extract OG tags from HTML
 */
function extractOGTags(html) {
  const ogTags = {};
  
  // Regex to find meta tags with property="og:*"
  const ogRegex = /<meta\s+property=["']og:([^"']+)["']\s+content=["']([^"']*)["'][^>]*>/gi;
  
  let match;
  while ((match = ogRegex.exec(html)) !== null) {
    const property = match[1];
    const content = match[2];
    ogTags[`og:${property}`] = content;
  }
  
  // Also extract Twitter cards
  const twitterRegex = /<meta\s+name=["']twitter:([^"']+)["']\s+content=["']([^"']*)["'][^>]*>/gi;
  while ((match = twitterRegex.exec(html)) !== null) {
    const property = match[1];
    const content = match[2];
    ogTags[`twitter:${property}`] = content;
  }
  
  return ogTags;
}

/**
 * Validate OG tags for a page
 */
async function validatePage(pageInfo) {
  const fullUrl = `${BASE_URL}${pageInfo.url}`;
  
  console.log(`\n🔍 Testing: ${pageInfo.name} (${fullUrl})`);
  
  try {
    const html = await fetchHTML(fullUrl);
    const ogTags = extractOGTags(html);
    
    // Validate required properties
    const validation = validateOGProperties(ogTags, pageInfo);
    
    if (validation.isValid) {
      console.log(`✅ ${pageInfo.name} - All OG tags valid`);
      results.passed++;
    } else {
      console.log(`❌ ${pageInfo.name} - Validation failed:`);
      validation.errors.forEach(err => console.log(`   - ${err}`));
      results.failed++;
      results.errors.push(...validation.errors.map(err => `${pageInfo.name}: ${err}`));
    }
    
    results.details.push({
      page: pageInfo.name,
      url: fullUrl,
      valid: validation.isValid,
      ogTags: ogTags,
      errors: validation.errors
    });
    
    return validation.isValid;
    
  } catch (error) {
    console.log(`❌ ${pageInfo.name} - Error: ${error.message}`);
    results.failed++;
    results.errors.push(`${pageInfo.name}: ${error.message}`);
    
    results.details.push({
      page: pageInfo.name,
      url: fullUrl,
      valid: false,
      error: error.message
    });
    
    return false;
  }
}

/**
 * Validate OG properties for a page
 */
function validateOGProperties(ogTags, pageInfo) {
  const errors = [];
  
  // Check required properties exist
  REQUIRED_OG_PROPERTIES.forEach(prop => {
    if (!ogTags[prop]) {
      errors.push(`Missing required property: ${prop}`);
    }
  });
  
  // Validate specific properties
  if (ogTags['og:title'] && ogTags['og:title'].length > 60) {
    errors.push(`Title too long (${ogTags['og:title'].length} chars, max 60)`);
  }
  
  if (ogTags['og:description'] && ogTags['og:description'].length > 160) {
    errors.push(`Description too long (${ogTags['og:description'].length} chars, max 160)`);
  }
  
  if (ogTags['og:image'] && !ogTags['og:image'].includes(pageInfo.expectedImage)) {
    errors.push(`Unexpected image: expected ${pageInfo.expectedImage}, got ${ogTags['og:image']}`);
  }
  
  if (ogTags['og:type'] && ogTags['og:type'] !== 'website') {
    errors.push(`Unexpected type: expected 'website', got '${ogTags['og:type']}'`);
  }
  
  if (ogTags['og:site_name'] && !ogTags['og:site_name'].includes('Aethron')) {
    errors.push(`Unexpected site name: ${ogTags['og:site_name']}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Generate detailed report
 */
async function generateReport() {
  const reportContent = `# Open Graph Validation Report - WEBS-49

**Generated:** ${new Date().toISOString()}
**Base URL:** ${BASE_URL}
**Total Pages:** ${PAGES_TO_TEST.length}

## Summary
- ✅ **Passed:** ${results.passed}
- ❌ **Failed:** ${results.failed}
- 📊 **Success Rate:** ${Math.round((results.passed / PAGES_TO_TEST.length) * 100)}%

## Page Details

${results.details.map(detail => `
### ${detail.page}
**URL:** ${detail.url}
**Status:** ${detail.valid ? '✅ PASS' : '❌ FAIL'}

${detail.error ? `**Error:** ${detail.error}` : ''}

${detail.ogTags ? `**OG Tags Found:**
${Object.entries(detail.ogTags).map(([key, value]) => `- \`${key}\`: ${value}`).join('\n')}` : ''}

${detail.errors && detail.errors.length > 0 ? `**Validation Errors:**
${detail.errors.map(err => `- ${err}`).join('\n')}` : ''}
`).join('\n---\n')}

## Recommendations

${results.failed > 0 ? `
### Fix Required Issues
${results.errors.map(err => `- ${err}`).join('\n')}
` : ''}

### Manual Testing Checklist
After fixing automated issues, complete manual testing:

1. **LinkedIn Post Inspector** - https://www.linkedin.com/post-inspector/
2. **Facebook Debugger** - https://developers.facebook.com/tools/debug/
3. **Twitter Card Validator** - https://cards-dev.twitter.com/validator
4. **WhatsApp Preview Test** - Share URL in WhatsApp
5. **Telegram Preview Test** - Share URL in Telegram

### Performance Checks
- Verify OG images load quickly (< 2 seconds)
- Check image file sizes (< 100KB recommended)
- Validate cache headers for images

---
*Report generated by WEBS-49 OG Validation Script*
`;

  await fs.writeFile('og-validation-report.md', reportContent);
  console.log('📄 Detailed report saved to: og-validation-report.md');
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting Open Graph Validation for WEBS-49');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`📄 Testing ${PAGES_TO_TEST.length} pages...\n`);
  
  // Test all pages
  for (const page of PAGES_TO_TEST) {
    await validatePage(page);
  }
  
  console.log('\n📊 Generating validation report...');
  await generateReport();
  
  // Print summary
  console.log('\n==================================================');
  console.log('📋 VALIDATION SUMMARY');
  console.log('==================================================');
  console.log(`Total Pages: ${PAGES_TO_TEST.length}`);
  console.log(`Passed: ✅ ${results.passed}`);
  console.log(`Failed: ❌ ${results.failed}`);
  console.log(`Success Rate: ${Math.round((results.passed / PAGES_TO_TEST.length) * 100)}%`);
  
  if (results.failed > 0) {
    console.log('\n❌ VALIDATION FAILED');
    console.log('Errors found:');
    results.errors.forEach(error => console.log(`  - ${error}`));
    console.log('\n📄 Check og-validation-report.md for details');
    process.exit(1);
  } else {
    console.log('\n✅ VALIDATION PASSED');
    console.log('All OG tags are properly configured!');
    console.log('\n📄 Check og-validation-report.md for details');
    console.log('\n🔗 Next steps:');
    console.log('  1. Complete manual testing with LinkedIn/Facebook tools');
    console.log('  2. Test mobile sharing (WhatsApp, Telegram)');
    console.log('  3. Verify OG image loading performance');
    process.exit(0);
  }
}

// Run the validation
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Validation script failed:', error.message);
    process.exit(1);
  });
}

module.exports = { main, validatePage, extractOGTags };
