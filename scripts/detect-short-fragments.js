import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the data
const dataPath = path.join(__dirname, '../src/data/pushPayFilteredPageData.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const pages = data[0].pages;

// Collect all misspellings and group by page
console.log('=== Analyzing Short Word Fragments ===');

// Common short fragments that could indicate broken styling
const suspiciousFragments = new Map();

pages.forEach(page => {
  if (!page.misspelled_words) return;
  
  // Look for very short "words" that could be fragments
  const shortWords = page.misspelled_words.filter(word => 
    word.length >= 2 && word.length <= 4 && 
    word.match(/^[a-zA-Z]+$/) && // Only letters
    !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'she', 'use', 'her', 'oil', 'sit', 'set', 'run', 'eat', 'far', 'sea', 'eye', 'ago', 'air', 'end', 'why'].includes(word.toLowerCase())
  );
  
  if (shortWords.length > 0) {
    shortWords.forEach(word => {
      const key = word.toLowerCase();
      if (!suspiciousFragments.has(key)) {
        suspiciousFragments.set(key, { word: key, count: 0, pages: [] });
      }
      const entry = suspiciousFragments.get(key);
      entry.count++;
      entry.pages.push(page.url);
    });
  }
});

// Sort by frequency and filter out very common ones
const sortedFragments = Array.from(suspiciousFragments.values())
  .filter(entry => entry.count >= 1 && entry.word.length >= 2)
  .sort((a, b) => b.count - a.count);

console.log(`Found ${sortedFragments.length} suspicious short fragments:`);
console.log('\n=== Most Frequent Short Fragments ===');
sortedFragments.slice(0, 30).forEach(entry => {
  console.log(`"${entry.word}" - ${entry.count} occurrence(s)`);
  if (entry.count <= 3) {
    entry.pages.forEach(url => console.log(`  - ${url}`));
  }
});

// Look for pages with multiple short fragments (more likely to have broken styling)
console.log('\n=== Pages with Multiple Short Fragments ===');
const pageFragmentCounts = new Map();

pages.forEach(page => {
  if (!page.misspelled_words) return;
  
  const shortFragments = page.misspelled_words.filter(word => 
    word.length >= 2 && word.length <= 4 && 
    word.match(/^[a-zA-Z]+$/) &&
    suspiciousFragments.has(word.toLowerCase())
  );
  
  if (shortFragments.length >= 2) {
    pageFragmentCounts.set(page.url, {
      count: shortFragments.length,
      fragments: shortFragments,
      allMisspellings: page.misspelled_words
    });
  }
});

Array.from(pageFragmentCounts.entries())
  .sort((a, b) => b[1].count - a[1].count)
  .slice(0, 10)
  .forEach(([url, data]) => {
    console.log(`\n${url}`);
    console.log(`  Short fragments (${data.count}): ${data.fragments.join(', ')}`);
    console.log(`  All misspellings: ${data.allMisspellings.slice(0, 10).join(', ')}${data.allMisspellings.length > 10 ? '...' : ''}`);
  });

// Look for patterns where short fragments appear together
console.log('\n=== Potential Word Reconstruction Patterns ===');
const commonFragmentPairs = [];

// Check for common 2-4 letter combinations that might form words
const fragmentList = sortedFragments.slice(0, 50).map(f => f.word);
for (let i = 0; i < fragmentList.length; i++) {
  for (let j = i + 1; j < fragmentList.length; j++) {
    const frag1 = fragmentList[i];
    const frag2 = fragmentList[j];
    
    // Check if these fragments appear together on any page
    const commonPages = pages.filter(page => 
      page.misspelled_words && 
      page.misspelled_words.some(w => w.toLowerCase() === frag1) &&
      page.misspelled_words.some(w => w.toLowerCase() === frag2)
    );
    
    if (commonPages.length > 0) {
      const combined1 = frag1 + frag2;
      const combined2 = frag2 + frag1;
      commonFragmentPairs.push({
        frag1, frag2, combined1, combined2,
        pageCount: commonPages.length,
        pages: commonPages.map(p => p.url)
      });
    }
  }
}

commonFragmentPairs
  .sort((a, b) => b.pageCount - a.pageCount)
  .slice(0, 10)
  .forEach(pair => {
    console.log(`"${pair.frag1}" + "${pair.frag2}" = "${pair.combined1}" or "${pair.combined2}" (${pair.pageCount} page(s))`);
    pair.pages.forEach(url => console.log(`  - ${url}`));
  });