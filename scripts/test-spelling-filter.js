import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the component's whitelist (copy from PageLevelInsights.jsx)
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
  'bombbomb', 'ccbchimp', 'pastorsline', 'thomrainer', 'espace', 'serviceu', 'camino', 'lpi'
];

// Copy the exact function from the component
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

// Test specific pages with Pushpay's
console.log('=== Testing Pages with Pushpay\'s ===\n');

pages.forEach(page => {
  if (page.misspelled_words && page.misspelled_words.some(w => w.includes("Pushpay"))) {
    console.log(`\nURL: ${page.url}`);
    console.log('Misspelled words:', page.misspelled_words);
    
    // Test the filter function
    const hasIssues = hasRealSpellingIssues(page);
    console.log('Has real spelling issues:', hasIssues);
    
    // Show which words are being filtered
    const normalizedWhitelist = spellingWhitelist.map(word => word.toLowerCase());
    const realMisspellings = page.misspelled_words.filter(word => {
      const normalizedWord = word.toLowerCase().replace(/[\u2018\u2019]/g, "'");
      const inWhitelist = normalizedWhitelist.includes(normalizedWord);
      if (word.includes("Pushpay")) {
        console.log(`  - "${word}" -> "${normalizedWord}" -> In whitelist: ${inWhitelist}`);
      }
      return !inWhitelist;
    });
    
    if (realMisspellings.length > 0) {
      console.log('Real misspellings:', realMisspellings);
    }
  }
});

// Check if the regex is working
console.log('\n=== Direct Regex Test ===');
const testWord = "Pushpay's"; // with smart quote
console.log('Original:', testWord);
console.log('Character code:', testWord.charCodeAt(7));
console.log('After regex:', testWord.replace(/[\u2018\u2019]/g, "'"));
console.log('After full normalization:', testWord.toLowerCase().replace(/[\u2018\u2019]/g, "'"));