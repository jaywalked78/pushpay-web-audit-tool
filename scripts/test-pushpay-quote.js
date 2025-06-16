// Test the exact issue with Pushpay's

// The word from the data with smart quote
const smartQuoteWord = "Pushpay's"; // This has Unicode 8217

// Test the regex
console.log('=== Testing Smart Quote Normalization ===');
console.log('Original word:', smartQuoteWord);
console.log('Character at position 7:', smartQuoteWord.charCodeAt(7));

// Test regex patterns
const pattern1 = /['']/g;
const pattern2 = /[\u2018\u2019]/g;
const pattern3 = /['']|[\u2018\u2019]/g;

console.log('\nRegex test results:');
console.log('Pattern /[\u2018\u2019]/g:', smartQuoteWord.replace(pattern1, "'"));
console.log('Pattern /[\\u2018\\u2019]/g:', smartQuoteWord.replace(pattern2, "'"));
console.log('Combined pattern:', smartQuoteWord.replace(pattern3, "'"));

// Test the whitelist
console.log('\n=== Testing Whitelist ===');
const testWhitelist = ['pushpay', "pushpay's", "Pushpay's", 'pushpays'];
const normalizedWhitelist = testWhitelist.map(word => word.toLowerCase());

console.log('Whitelist entries:');
testWhitelist.forEach((word, i) => {
  console.log(`  ${i}: "${word}" -> "${word.toLowerCase()}" (chars: ${[...word].map(c => c.charCodeAt(0)).join(',')})`);
});

// Test the normalization
const normalizedWord = smartQuoteWord.toLowerCase().replace(/['']/g, "'");
console.log('\nNormalized smart quote word:', normalizedWord);
console.log('Is in whitelist:', normalizedWhitelist.includes(normalizedWord));

// Direct comparison
console.log('\n=== Direct Comparison ===');
console.log('normalizedWord === "pushpay\'s":', normalizedWord === "pushpay's");
console.log('normalizedWord length:', normalizedWord.length);
console.log('"pushpay\'s" length:', "pushpay's".length);

// Character by character
console.log('\nCharacter comparison:');
for (let i = 0; i < Math.max(normalizedWord.length, "pushpay's".length); i++) {
  const c1 = normalizedWord[i] || 'undefined';
  const c2 = "pushpay's"[i] || 'undefined';
  console.log(`  Position ${i}: "${c1}" (${c1.charCodeAt ? c1.charCodeAt(0) : 'N/A'}) vs "${c2}" (${c2.charCodeAt ? c2.charCodeAt(0) : 'N/A'})`);
}