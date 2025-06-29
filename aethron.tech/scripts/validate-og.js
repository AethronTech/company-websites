#!/usr/bin/env node

/**
 * WEBS-49: Automated Open Graph Validation Script
 * Tests OG tags for all major pages and languages
 */

const ogs = require('open-graph-scraper');
const fs = require('fs').promises;
const path = require('path');

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
  'ogTitle',
  'ogDescription', 
  'ogUrl',
  'ogType',
  'ogSiteName',
  'ogImage'
];

// Validation results
let results = {
  passed: 0,
  failed: 0,
  errors: [],
  details: []
};

/**
 * Validate OG tags for a single page
 */
async function validatePage(pageInfo) {
  const fullUrl = `${BASE_URL}${pageInfo.url}`;
  
  console.log(`\n🔍 Testing: ${pageInfo.name} (${fullUrl})`);
  
  try {
    const options = {
      url: fullUrl,
      timeout: TIMEOUT,
      retry: 2,
      onlyGetOpenGraphInfo: false
    };
    
    const { error, result, response } = await ogs(options);
    
    if (error) {
      throw new Error(`OGS Error: ${error.message || error}`);
    }
    
    if (!result) {
      throw new Error('No OG data returned');
    }
    
    // Validate required properties
    const validation = validateOGProperties(result, pageInfo);
    
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
      ogData: result,
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
function validateOGProperties(ogData, pageInfo) {
  const errors = [];
  
  // Check required properties exist
  REQUIRED_OG_PROPERTIES.forEach(prop => {
    if (!ogData[prop]) {
      errors.push(`Missing required property: ${prop}`);
    }
  });
  
  // Validate specific properties
  if (ogData.ogTitle && ogData.ogTitle.length > 60) {
    errors.push(`Title too long (${ogData.ogTitle.length} chars, max 60)`);
  }
  
  if (ogData.ogDescription && ogData.ogDescription.length > 160) {
    errors.push(`Description too long (${ogData.ogDescription.length} chars, max 160)`);
  }
  
  if (ogData.ogImage && !ogData.ogImage[0]?.url.includes(pageInfo.expectedImage)) {
    errors.push(`Unexpected image: expected ${pageInfo.expectedImage}, got ${ogData.ogImage[0]?.url}`);
  }
  
  if (ogData.ogType && ogData.ogType !== 'website') {
    errors.push(`Unexpected type: expected 'website', got '${ogData.ogType}'`);
  }
  
  if (ogData.ogSiteName && !ogData.ogSiteName.includes('Aethron')) {
    errors.push(`Unexpected site name: ${ogData.ogSiteName}`);
  }
  
  // Validate image dimensions if available
  if (ogData.ogImage && ogData.ogImage[0]) {
    const img = ogData.ogImage[0];
    if (img.width && img.width !== '1200') {
      errors.push(`Image width should be 1200px, got ${img.width}px`);
    }
    if (img.height && img.height !== '630') {
      errors.push(`Image height should be 630px, got ${img.height}px`);
    }
  }
  
  // Validate locale for NL pages
  if (pageInfo.url.includes('/nl/') && ogData.ogLocale) {
    if (ogData.ogLocale !== 'nl_NL') {
      errors.push(`Expected locale 'nl_NL' for Dutch page, got '${ogData.ogLocale}'`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate validation report
 */
async function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    summary: {
      total: results.passed + results.failed,
      passed: results.passed,
      failed: results.failed,
      successRate: `${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`
    },
    errors: results.errors,
    details: results.details
  };
  
  // Save detailed JSON report
  await fs.writeFile(
    path.join(__dirname, 'og-validation-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  // Generate markdown summary
  const markdown = generateMarkdownReport(report);
  await fs.writeFile(
    path.join(__dirname, 'og-validation-report.md'),
    markdown
  );
  
  return report;
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(report) {
  return `# Open Graph Validation Report

**Generated:** ${report.timestamp}  
**Base URL:** ${report.baseUrl}

## 📊 Summary

- **Total Pages:** ${report.summary.total}
- **Passed:** ✅ ${report.summary.passed}
- **Failed:** ❌ ${report.summary.failed}  
- **Success Rate:** ${report.summary.successRate}

## 📋 Results

${report.details.map(detail => `
### ${detail.page}
- **URL:** ${detail.url}
- **Status:** ${detail.valid ? '✅ PASSED' : '❌ FAILED'}
${detail.errors && detail.errors.length > 0 ? `- **Errors:**\n${detail.errors.map(err => `  - ${err}`).join('\n')}` : ''}
${detail.ogData ? `- **Title:** ${detail.ogData.ogTitle || 'N/A'}
- **Description:** ${detail.ogData.ogDescription || 'N/A'}
- **Image:** ${detail.ogData.ogImage?.[0]?.url || 'N/A'}` : ''}
`).join('\n')}

${report.summary.failed > 0 ? `## ❌ Errors Found

${report.errors.map(error => `- ${error}`).join('\n')}

## 🔧 Recommended Actions

1. Fix the errors listed above
2. Re-run validation: \`npm run og:validate\`
3. Test manually with Facebook Debugger and LinkedIn Post Inspector
` : '## ✅ All Tests Passed!\n\nYour Open Graph implementation is working correctly.'}
`;
}

/**
 * Main validation function
 */
async function main() {
  console.log('🚀 Starting Open Graph Validation for WEBS-49');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`📄 Testing ${PAGES_TO_TEST.length} pages...\n`);
  
  // Test all pages
  for (const page of PAGES_TO_TEST) {
    await validatePage(page);
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Generate report
  console.log('\n📊 Generating validation report...');
  const report = await generateReport();
  
  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📋 VALIDATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Pages: ${report.summary.total}`);
  console.log(`Passed: ✅ ${report.summary.passed}`);
  console.log(`Failed: ❌ ${report.summary.failed}`);
  console.log(`Success Rate: ${report.summary.successRate}`);
  
  if (results.failed > 0) {
    console.log('\n❌ VALIDATION FAILED');
    console.log('Errors found:');
    results.errors.forEach(error => console.log(`  - ${error}`));
    console.log('\n📄 Check og-validation-report.md for details');
    process.exit(1);
  } else {
    console.log('\n✅ ALL VALIDATIONS PASSED!');
    console.log('🎉 WEBS-49 Open Graph validation successful!');
    process.exit(0);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

// Run validation
main().catch(error => {
  console.error('❌ Validation failed:', error);
  process.exit(1);
});
