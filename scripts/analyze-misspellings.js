#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the JSON data
const dataPath = path.join(__dirname, '../src/data/pushPayFilteredPageData.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Comprehensive whitelist (synced with PageLevelInsights.jsx)
const currentWhitelist = [
  // Brand names and company terms (case insensitive)
  'pushpay', "pushpay's", 'pushpays', 'chms', 'staq', 'parishstaq', 'churchstaq', 'resi', 'quickbooks',
  'autopay', 'fastpay', 'livestream', 'signups', 'everygift', 'integrations', 'checkr',
  'analytics', 'ebook', 'bgh', 'coram', 'deo', 'asbury', 'kozlowski', 'senneff',
  'chao', 'gruia', 'kamy', 'beattie', 'meaney', 'bellevue', 'reeltown', 'leone',
  'mailchimp', 'mychurch', 'lamontagne', 'pco', "pco's", 'penafort', 'subsplash', 'rainer',
  'generis', 'profitstars', 'churchco', 'virtus', 'ccb', 'ncs', 'acs', 'isidore', 'sliker',
  
  // Technical terms and abbreviations
  'api', 'apis', 'saas', 'crm', 'pos', 'ui', 'ux', 'rss', 'ach', 'pre', 'barcodes',
  'homescreen', 'customizable', 'covid', 'ssl', 'https', 'http', 'cms', 'seo',
  'url', 'urls', 'html', 'css', 'js', 'json', 'xml', 'pdf', 'csv', 'sql',
  'oauth', 'jwt', 'cdn', 'dns', 'vpn', 'ide', 'sdk', 'npm', 'github', 'gitlab',
  'pci', 'dss', 'gdpr', 'eea', 'llc', 'sms', 'vbs', 'crypto', 'www', 'usd', 'aud', 'nzd',
  'cvv', 'tls', 'ddos', 'waf', 'hdmi', 'hvac', 'hd', 'vr', 'npo', 'roi', 'svp', 'cfo',
  'ceo', 'cto', 'hr', 'it', 'pr', 'qbo', 'crm', 'erp', 'bi', 'ai', 'ml', 'iot',
  
  // Religious and church terms
  'christian', 'christianity', 'ministry', 'ministries', 'parish', 'parishes',
  'diocese', 'dioceses', 'congregation', 'congregations', 'baptist', 'methodist',
  'presbyterian', 'episcopal', 'catholic', 'lutheran', 'pentecostal', 'evangelical',
  'worship', 'sermons', 'bible', 'biblical', 'scripture', 'scriptures', 'tithe',
  'tithes', 'tithing', 'offering', 'offerings', 'stewardship', 'discipleship',
  'outreach', 'missions', 'missionary', 'missionaries', 'pastor', 'pastors',
  'reverend', 'chaplain', 'deacon', 'elder', 'elders', 'vestry', 'rcia', 'ocia',
  'vbs', 'evangelization',
  
  // Business and technical terms
  'app', 'apps', 'mobile', 'dashboard', 'admin', 'login', 'logout', 'signup',
  'username', 'password', 'email', 'emails', 'newsletter', 'blog', 'blogs',
  'webinar', 'webinars', 'podcast', 'podcasts', 'ebook', 'ebooks', 'whitepaper',
  'whitepapers', 'onboarding', 'offboarding', 'fundraising', 'fundraiser',
  'nonprofit', 'nonprofits', 'online', 'offline', 'realtime', 'real-time',
  'automations', 'preconfigured', 'impactful', 'gamechanger', 'uptime', 'cancelled',
  'livestreaming', 'mischarged', 'cancellable', 'merchantability', 'anonymized',
  'chargebacks', 'unlink', 'jamsadr', 'adr', 'arbitrations', 'severability',
  'transactional', 'enablement', 'preapproved', 'preauthorized', 'deliverability',
  'multisite', 'scalable', 'passwordless', 'touchpoint', 'personalization',
  'lifecycle', 'roadmap', 'financials', 'inclusivity', 'embeddable', 'frictionless',
  'autofill', 'timeframe', 'discoverability', 'preselected', 'templated', 'pdfs',
  'cybersecurity', 'fintech', 'hackathon', 'metaverse', 'blockchain', 'millennials',
  'digitalization', 'coronavirus', 'lockdowns', 'mentorship', 'chaperones',
  
  // Geographic locations and country names (from country dropdowns)
  'usa', 'uk', 'canada', 'australia', 'zealand', 'america', 'american',
  'california', 'texas', 'florida', 'york', 'seattle', 'portland', 'denver',
  'atlanta', 'chicago', 'boston', 'philadelphia', 'nashville', 'austin',
  'aland', 'plurinational', 'bonaire', 'sint', 'eustatius', 'saba', 'bouvet',
  'darussalam', 'burkina', 'faso', 'costa', 'rica', "d'ivoire", 'curaçao', 'el',
  'malvinas', 'faroe', 'jamahiriya', 'mayotte', 'niue', 'papua', 'barthélemy', 'da',
  'cunha', 'kitts', 'miquelon', 'marino', 'sao', 'maarten', 'sri', 'mayen', 'leste',
  'tokelau', 'caicos', 'bolivarian', 'futuna', 'padua', 'brentwood', 'bayside',
  'saddleback', 'northstar', 'stockbridge', 'idlewild',
  
  // Technology platforms and services
  'ok', 'okay', 'wifi', 'wi-fi', 'smartphone', 'smartphones', 'tablet', 'tablets',
  'ipad', 'iphone', 'android', 'ios', 'mac', 'pc', 'laptop', 'desktop',
  'internet', 'intranet', 'extranet', 'website', 'websites', 'webpage', 'webpages',
  'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'google', 'microsoft',
  'apple', 'amazon', 'stripe', 'paypal', 'venmo', 'zelle', 'vimeo', 'chromecast',
  'alexa', 'mastercard', 'visa', 'amex', 'discover', 'gmail', 'outlook', 'zoom',
  'teams', 'slack', 'dropbox', 'onedrive', 'sharepoint', 'salesforce', 'hubspot',
  'marketo', 'mailchimp', 'constantcontact', 'aweber', 'convertkit', 'activecampaign',
  
  // Proper names (people, places, organizations)
  'veritas', 'auxano', 'linc', 'cnlp', 'ccli', 'fumc', 'acutis', 'rms',
  'vanderbloemen', 'vanderbloeman', 'vanderblomen', 'glassdoor', 'deloitte',
  'akamai', 'digicert', 'verasafe', 'gramm', 'bliley', 'nacha', 'ofac',
  'durbin', 'ponzi', 'forex', 'hipaa', 'ccpa', 'gdpr', 'coppa', 'ferpa',
  
  // Legal and business terms
  'amongst', 'analyse', 'authorised', 'behavioural', 'licence', 'annum',
  'proratable', 'setoff', 'withholdings', 'servicers', 'bona', 'fide',
  'summative', 'rata', 'duplicative', 'noninfringement', 'severable',
  'sublicensable', 'sublicense', 'licensable', 'licensors', 'merchantability',
  'cfr', 'sdks', 'mms', 'gifs', 'captcha', 'balancers', 'recordkeeping',
  'incentivize', 'geolocation', 'biometric', 'masse', 'et', 'de', 'pty', 'ltd',
  
  // Common abbreviations and acronyms that might be flagged
  'wi', 'fi', 'kb', 'mb', 'gb', 'tb', 'cpu', 'gpu', 'ram', 'ssd', 'hdd',
  'usb', 'hdmi', 'bluetooth', 'nfc', 'qr', 'ar', 'vr', 'ai', 'ml', 'iot',
  'saas', 'paas', 'iaas', 'b2b', 'b2c', 'b2b2c', 'p2p', 'api', 'rest',
  'soap', 'http', 'https', 'ftp', 'sftp', 'ssh', 'vpn', 'lan', 'wan'
];

console.log('🔍 Analyzing misspelled words in pushPayFilteredPageData.json...\n');

// Count all misspelled words
const wordCounts = {};
const pageCounts = {};
let totalPages = 0;
let pagesWithMisspellings = 0;

// Process each page
data[0].pages.forEach(page => {
  totalPages++;
  
  if (page.misspelled_words && page.misspelled_words.length > 0) {
    pagesWithMisspellings++;
    
    page.misspelled_words.forEach(word => {
      const lowerWord = word.toLowerCase();
      
      // Count total occurrences
      wordCounts[word] = (wordCounts[word] || 0) + 1;
      
      // Count unique pages per word
      if (!pageCounts[word]) {
        pageCounts[word] = new Set();
      }
      pageCounts[word].add(page.url);
    });
  }
});

// Create normalized whitelist for case-insensitive comparison
const normalizedWhitelist = currentWhitelist.map(word => word.toLowerCase());

// Separate words into whitelisted and not whitelisted
const whitelistedWords = {};
const nonWhitelistedWords = {};

Object.entries(wordCounts).forEach(([word, count]) => {
  // Normalize word: lowercase and replace smart quotes with regular quotes
  const normalizedWord = word.toLowerCase().replace(/['']/g, "'");
  
  if (normalizedWhitelist.includes(normalizedWord)) {
    whitelistedWords[word] = {
      count: count,
      pages: pageCounts[word].size
    };
  } else {
    nonWhitelistedWords[word] = {
      count: count,
      pages: pageCounts[word].size
    };
  }
});

// Sort by frequency (descending)
const sortedWhitelisted = Object.entries(whitelistedWords)
  .sort(([,a], [,b]) => b.count - a.count);
const sortedNonWhitelisted = Object.entries(nonWhitelistedWords)
  .sort(([,a], [,b]) => b.count - a.count);

// Display results
console.log('📊 SUMMARY:');
console.log(`Total pages analyzed: ${totalPages}`);
console.log(`Pages with misspellings: ${pagesWithMisspellings}`);
console.log(`Total unique misspelled words: ${Object.keys(wordCounts).length}`);
console.log(`Words in current whitelist: ${sortedWhitelisted.length}`);
console.log(`Words NOT in whitelist: ${sortedNonWhitelisted.length}\n`);

console.log('🚫 WORDS NOT IN WHITELIST (potential false positives):');
console.log('=' .repeat(80));
console.log('Word'.padEnd(25) + 'Occurrences'.padEnd(15) + 'Pages Affected');
console.log('-'.repeat(80));

if (sortedNonWhitelisted.length === 0) {
  console.log('✅ All misspelled words are in the whitelist!');
} else {
  sortedNonWhitelisted.forEach(([word, data]) => {
    console.log(
      word.padEnd(25) + 
      data.count.toString().padEnd(15) + 
      data.pages.toString()
    );
  });
}

console.log('\n✅ WORDS ALREADY IN WHITELIST (being filtered out):');
console.log('=' .repeat(80));
console.log('Word'.padEnd(25) + 'Occurrences'.padEnd(15) + 'Pages Affected');
console.log('-'.repeat(80));

if (sortedWhitelisted.length === 0) {
  console.log('No whitelisted words found in misspellings.');
} else {
  // Show top 20 whitelisted words
  sortedWhitelisted.slice(0, 20).forEach(([word, data]) => {
    console.log(
      word.padEnd(25) + 
      data.count.toString().padEnd(15) + 
      data.pages.toString()
    );
  });
  
  if (sortedWhitelisted.length > 20) {
    console.log(`... and ${sortedWhitelisted.length - 20} more whitelisted words`);
  }
}

// Generate suggested whitelist additions
if (sortedNonWhitelisted.length > 0) {
  console.log('\n🎯 SUGGESTED WHITELIST ADDITIONS:');
  console.log('=' .repeat(80));
  console.log('Add these to your whitelist if they are acceptable terms:\n');
  
  // Group suggestions by frequency
  const highFrequency = sortedNonWhitelisted.filter(([, data]) => data.count >= 10);
  const mediumFrequency = sortedNonWhitelisted.filter(([, data]) => data.count >= 5 && data.count < 10);
  const lowFrequency = sortedNonWhitelisted.filter(([, data]) => data.count < 5);
  
  if (highFrequency.length > 0) {
    console.log('🔥 HIGH FREQUENCY (10+ occurrences):');
    const suggestions = highFrequency.map(([word]) => `'${word.toLowerCase()}'`).join(', ');
    console.log(suggestions + '\n');
  }
  
  if (mediumFrequency.length > 0) {
    console.log('🔶 MEDIUM FREQUENCY (5-9 occurrences):');
    const suggestions = mediumFrequency.map(([word]) => `'${word.toLowerCase()}'`).join(', ');
    console.log(suggestions + '\n');
  }
  
  if (lowFrequency.length > 0) {
    console.log('🔸 LOW FREQUENCY (1-4 occurrences):');
    const suggestions = lowFrequency.slice(0, 30).map(([word]) => `'${word.toLowerCase()}'`).join(', ');
    console.log(suggestions);
    if (lowFrequency.length > 30) {
      console.log(`... and ${lowFrequency.length - 30} more low-frequency words`);
    }
  }
}

console.log('\n💡 USAGE:');
console.log('1. Review the words NOT in whitelist above');
console.log('2. Add acceptable terms to the spellingWhitelist array in PageLevelInsights.jsx');
console.log('3. Re-run this script to verify changes');
console.log('4. Only real misspellings should remain after proper whitelisting\n');