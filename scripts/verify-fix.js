// Verify the fix for smart quotes

// Test the updated regex pattern
const testWord = 'Pushpay' + String.fromCharCode(8217) + 's'; // Pushpay's with smart quote
console.log('Test word:', testWord);
console.log('Character at position 7:', testWord.charCodeAt(7));

// Test the Unicode regex pattern
const normalizedWord = testWord.toLowerCase().replace(/[\u2018\u2019]/g, "'");
console.log('\nAfter normalization:', normalizedWord);
console.log('Character at position 7 after normalization:', normalizedWord.charCodeAt(7));

// Verify it matches the whitelist entry
const whitelistEntry = "pushpay's";
console.log('\nWhitelist entry:', whitelistEntry);
console.log('Match test:', normalizedWord === whitelistEntry);

// Test with actual whitelist logic
const spellingWhitelist = ['pushpay', "pushpay's", "Pushpay's", 'pushpays'];
const normalizedWhitelist = spellingWhitelist.map(word => word.toLowerCase());
console.log('\nIs in normalized whitelist:', normalizedWhitelist.includes(normalizedWord));

// Test with a page object
const testPage = {
  misspelled_words: ['Pushpay', testWord, 'analytics', 'sofware'] // sofware is a real misspelling
};

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

console.log('\n=== Testing with sample page ===');
console.log('Misspelled words:', testPage.misspelled_words);
console.log('Has real spelling issues:', hasRealSpellingIssues(testPage));

// Show which words are filtered
const realMisspellings = testPage.misspelled_words.filter(word => {
  const normalized = word.toLowerCase().replace(/[\u2018\u2019]/g, "'");
  const inWhitelist = normalizedWhitelist.includes(normalized);
  console.log(`  "${word}" -> "${normalized}" -> In whitelist: ${inWhitelist}`);
  return !inWhitelist;
});

console.log('\nReal misspellings:', realMisspellings);