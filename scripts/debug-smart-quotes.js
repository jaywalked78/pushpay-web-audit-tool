import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the data
const dataPath = path.join(__dirname, '../src/data/pushPayFilteredPageData.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('=== Debugging Smart Quote Issue ===\n');

// Find all instances of Pushpay variations
const pushpayVariations = new Set();
let examplePage = null;

// The data is an array with the first element containing summary and pages
const pages = data[0].pages;

pages.forEach(page => {
  if (page.misspelled_words) {
    page.misspelled_words.forEach(word => {
      if (word.toLowerCase().includes('pushpay')) {
        pushpayVariations.add(word);
        if (!examplePage && word.includes("'")) {
          examplePage = page.url;
        }
      }
    });
  }
});

console.log('Found Pushpay variations:');
pushpayVariations.forEach(word => {
  console.log(`\nWord: "${word}"`);
  console.log('Character codes:', Array.from(word).map((c, i) => `${c} (${c.charCodeAt(0)})`).join(', '));
  
  // Check for smart quotes
  const hasSmartQuote = word.includes('\u2019') || word.includes('\u2018');
  console.log('Has smart quote:', hasSmartQuote);
  
  // Test normalization
  const normalized = word.toLowerCase().replace(/['']/g, "'");
  console.log('Normalized:', normalized);
});

if (examplePage) {
  console.log(`\nExample page with smart quote issue: ${examplePage}`);
}

// Test the regex pattern
console.log('\n=== Testing Regex Pattern ===');
const testWords = ["Pushpay's", "Pushpay's", "pushpay's"];
testWords.forEach(word => {
  console.log(`\nOriginal: "${word}"`);
  console.log('After regex:', word.replace(/['']/g, "'"));
});

// Check whitelist
console.log('\n=== Checking Whitelist ===');
const spellingWhitelist = [
  'pushpay', "pushpay's", "Pushpay's", 'pushpays'
];

const normalizedWhitelist = spellingWhitelist.map(word => word.toLowerCase());
console.log('Normalized whitelist includes "pushpay\'s":', normalizedWhitelist.includes("pushpay's"));