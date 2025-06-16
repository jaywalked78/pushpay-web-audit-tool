import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load data
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/pushPayFilteredPageData.json'), 'utf8'));
const homepage = data[0].pages.find(p => p.url === 'https://pushpay.com/');

console.log('=== Testing Homepage Pushpay\'s Issue ===\n');
console.log('Homepage misspelled words with Pushpay:');
homepage.misspelled_words.filter(w => w.includes('Pushpay')).forEach(word => {
  console.log(`\nWord: "${word}"`);
  console.log('Character codes:', [...word].map(c => `${c}(${c.charCodeAt(0)})`).join(' '));
  
  // Test normalization
  const normalized = word.toLowerCase().replace(/['']/g, "'");
  console.log('Normalized:', normalized);
  console.log('Normalized char codes:', [...normalized].map(c => `${c}(${c.charCodeAt(0)})`).join(' '));
});

// Test the exact regex pattern from the component
console.log('\n=== Testing Regex Pattern ===');
const testWord = 'Pushpay' + String.fromCharCode(8217) + 's';
console.log('Test word with smart quote:', testWord);
console.log('Char code at position 7:', testWord.charCodeAt(7));

// Test different regex patterns
const patterns = [
  /['']/g,
  /[\u2018\u2019]/g,
  /['']|[\u2018\u2019]/g,
  /[''']/g
];

patterns.forEach((pattern, i) => {
  const result = testWord.replace(pattern, "'");
  console.log(`Pattern ${i}: ${result} (char 7: ${result.charCodeAt(7)})`);
});

// Test if the issue is with the whitelist
console.log('\n=== Testing Whitelist Match ===');
const whitelist = ['pushpay', "pushpay's", "Pushpay's", 'pushpays'];
const normalizedWhitelist = whitelist.map(w => w.toLowerCase());

console.log('Whitelist (normalized):');
normalizedWhitelist.forEach((w, i) => {
  console.log(`  ${i}: "${w}" (length: ${w.length}, chars: ${[...w].map(c => c.charCodeAt(0)).join(',')})`);
});

const smartQuoteWord = 'Pushpay' + String.fromCharCode(8217) + 's';
const normalizedSmartQuote = smartQuoteWord.toLowerCase().replace(/['']/g, "'");
console.log(`\nSmart quote word normalized: "${normalizedSmartQuote}"`);
console.log('Is in whitelist:', normalizedWhitelist.includes(normalizedSmartQuote));

// Check if there's a hidden character issue
console.log('\n=== Checking for Hidden Characters ===');
console.log('Normalized smart quote word bytes:', Buffer.from(normalizedSmartQuote).toString('hex'));
console.log('Whitelist "pushpay\'s" bytes:', Buffer.from("pushpay's").toString('hex'));