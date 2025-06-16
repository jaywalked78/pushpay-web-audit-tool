import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Exact copy of the component's whitelist
const spellingWhitelist = [
  // Brand names and company terms (case insensitive)
  'pushpay', "pushpay's", "Pushpay's", 'pushpays', 'chms', 'staq', 'parishstaq', 'churchstaq', 'resi', 'quickbooks',
  'autopay', 'fastpay', 'livestream', 'signups', 'everygift', 'integrations', 'checkr',
  'analytics', 'ebook', 'bgh', 'coram', 'deo', 'asbury', 'kozlowski', 'senneff',
  'chao', 'gruia', 'kamy', 'beattie', 'meaney', 'bellevue', 'reeltown', 'leone',
  'mailchimp', 'mychurch', 'lamontagne', 'pco', "pco's", 'penafort', 'subsplash', 'rainer',
  'generis', 'profitstars', 'churchco', 'virtus', 'ccb', 'ncs', 'acs', 'isidore', 'sliker',
  'lovejoy', 'secret', 'blessing', 'o', "'secret", "'O", "'blessing", "pushpay's",
  
  // Smart quote variations and additional terms
  "'pushpay's", "pco's", "'pco's", "resi's", "'resi's", "everygift's", "'everygift's",
  "parishstaq's", "'parishstaq's", 'tis', "'tis", 'impactful', 'reimagining',
  'livestreaming', 'roadmap', 'financials', 'customizable', 'preconfigured', 'touchpoint',
  'onboarding', 'mischarged', 'passwordless', 'gamechanger', 'hust', 'padua', 'rees', 'pointe',
  'pitigoi', 'telles', 'svp', 'rothermel', 'yocum', 'schofield', 'gabrielsoft', 'ministryplatform',
  'bombbomb', 'ccbchimp', 'pastorsline', 'thomrainer', 'espace', 'serviceu', 'camino', 'lpi',
  'ly', "'s", "'refunded", 'dpf', "dpf's", 'le', 'verage',
  
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
  'vbs', 'evangelization'
];

// Exact copy of the component's function
const hasRealSpellingIssues = (page) => {
  if (!page.misspelled_words || page.misspelled_words.length === 0) {
    return false;
  }
  
  // Create a normalized whitelist for case-insensitive comparison
  const normalizedWhitelist = spellingWhitelist.map(word => word.toLowerCase());
  
  const realMisspellings = page.misspelled_words.filter(word => {
    // Normalize the word: lowercase and replace smart quotes with regular quotes
    const normalizedWord = word.toLowerCase().replace(/[\u2018\u2019]/g, "'");
    return !normalizedWhitelist.includes(normalizedWord);
  });
  
  return realMisspellings.length > 0;
};

// Load the data
const dataPath = path.join(__dirname, '../src/data/pushPayFilteredPageData.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const pages = data[0].pages;

// Filter valid pages (exclude redirects)
const validPages = pages.filter(page => 
  page.status_code !== 301 && page.status_code !== 302 && page.onpage_score > 0
);

// Count pages with real spelling issues
const pagesWithRealSpellingIssues = validPages.filter(page => hasRealSpellingIssues(page));

console.log('=== Spelling Error Count Summary ===');
console.log(`Total valid pages: ${validPages.length}`);
console.log(`Pages with real spelling issues: ${pagesWithRealSpellingIssues.length}`);
console.log(`Percentage with real spelling issues: ${(pagesWithRealSpellingIssues.length / validPages.length * 100).toFixed(1)}%`);

console.log('\n=== Sample of Real Misspellings ===');
pagesWithRealSpellingIssues.slice(0, 5).forEach(page => {
  const normalizedWhitelist = spellingWhitelist.map(word => word.toLowerCase());
  const realMisspellings = page.misspelled_words.filter(word => {
    const normalizedWord = word.toLowerCase().replace(/[\u2018\u2019]/g, "'");
    return !normalizedWhitelist.includes(normalizedWord);
  });
  
  console.log(`\nURL: ${page.url}`);
  console.log(`Real misspellings (${realMisspellings.length}): ${realMisspellings.slice(0, 10).join(', ')}${realMisspellings.length > 10 ? '...' : ''}`);
});