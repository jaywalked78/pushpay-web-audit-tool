import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load data
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/pushPayFilteredPageData.json'), 'utf8'));
const pages = data[0].pages;

// Get the full whitelist from the component (first 100+ terms for testing)
const spellingWhitelist = [
  'pushpay', "pushpay's", "Pushpay's", 'pushpays', 'chms', 'staq', 'parishstaq', 'churchstaq', 'resi', 'quickbooks',
  'autopay', 'fastpay', 'livestream', 'signups', 'everygift', 'integrations', 'checkr',
  'analytics', 'ebook', 'bgh', 'coram', 'deo', 'asbury', 'kozlowski', 'senneff',
  'chao', 'gruia', 'kamy', 'beattie', 'meaney', 'bellevue', 'reeltown', 'leone',
  'mailchimp', 'mychurch', 'lamontagne', 'pco', "pco's", 'penafort', 'subsplash', 'rainer'
];

// Implement the exact logic from the component
const hasRealSpellingIssues = (page) => {
  if (!page.misspelled_words || page.misspelled_words.length === 0) {
    return false;
  }
  
  const normalizedWhitelist = spellingWhitelist.map(word => word.toLowerCase());
  
  const realMisspellings = page.misspelled_words.filter(word => {
    const normalizedWord = word.toLowerCase().replace(/[\u2018\u2019]/g, "'");
    return !normalizedWhitelist.includes(normalizedWord);
  });
  
  return realMisspellings.length > 0;
};

console.log('=== Final Verification of Smart Quote Fix ===\n');

// Test pages with Pushpay's
let pushpayPages = 0;
let fixedPages = 0;

pages.forEach(page => {
  if (page.misspelled_words && page.misspelled_words.some(w => w.includes("Pushpay") && w.includes("'"))) {
    pushpayPages++;
    
    const beforeFix = page.misspelled_words.filter(word => {
      const normalizedWord = word.toLowerCase().replace(/['']/g, "'"); // Old regex
      return !spellingWhitelist.map(w => w.toLowerCase()).includes(normalizedWord);
    });
    
    const afterFix = page.misspelled_words.filter(word => {
      const normalizedWord = word.toLowerCase().replace(/[\u2018\u2019]/g, "'"); // New regex
      return !spellingWhitelist.map(w => w.toLowerCase()).includes(normalizedWord);
    });
    
    const pushpayWordsBefore = beforeFix.filter(w => w.includes("Pushpay"));
    const pushpayWordsAfter = afterFix.filter(w => w.includes("Pushpay"));
    
    if (pushpayWordsBefore.length > 0 && pushpayWordsAfter.length === 0) {
      fixedPages++;
      console.log(`✅ Fixed: ${page.url}`);
      console.log(`   Before: ${pushpayWordsBefore.join(', ')}`);
      console.log(`   After: None (properly filtered)\n`);
    }
  }
});

console.log(`\nSummary:`);
console.log(`- Found ${pushpayPages} pages with "Pushpay's"`);
console.log(`- Fixed ${fixedPages} pages where "Pushpay's" was incorrectly flagged`);

// Show first page stats
const homepage = pages.find(p => p.url === 'https://pushpay.com/');
if (homepage) {
  console.log('\n=== Homepage Test ===');
  console.log('Has real spelling issues (with fix):', hasRealSpellingIssues(homepage));
  
  const normalizedWhitelist = spellingWhitelist.map(word => word.toLowerCase());
  const realMisspellings = homepage.misspelled_words.filter(word => {
    const normalizedWord = word.toLowerCase().replace(/[\u2018\u2019]/g, "'");
    return !normalizedWhitelist.includes(normalizedWord);
  });
  
  console.log('Remaining real misspellings:', realMisspellings.filter(w => !w.includes('Pushpay')).slice(0, 5));
}