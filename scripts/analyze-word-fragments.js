import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the data
const dataPath = path.join(__dirname, '../src/data/pushPayFilteredPageData.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const pages = data[0].pages;

// Common English words that could be split
const commonWords = [
  'leverage', 'coverage', 'advantage', 'knowledge', 'management', 'development', 'improvement',
  'performance', 'experience', 'conference', 'reference', 'preference', 'difference', 'intelligence',
  'excellence', 'influence', 'confidence', 'evidence', 'audience', 'guidance', 'distance',
  'assistance', 'resistance', 'persistence', 'existence', 'consistency', 'efficiency', 'proficiency',
  'technology', 'strategy', 'category', 'delivery', 'discovery', 'recovery', 'security',
  'community', 'opportunity', 'responsibility', 'accountability', 'availability', 'capability',
  'compatibility', 'reliability', 'functionality', 'accessibility', 'visibility', 'flexibility',
  'productivity', 'connectivity', 'creativity', 'activity', 'capacity', 'complexity',
  'simplicity', 'authenticity', 'authority', 'priority', 'majority', 'minority', 'community',
  'university', 'ministry', 'industry', 'history', 'memory', 'factory', 'directory',
  'territory', 'category', 'inventory', 'advisory', 'mandatory', 'voluntary', 'temporary'
];

// Function to generate possible splits for a word
const generateSplits = (word) => {
  const splits = [];
  for (let i = 1; i < word.length; i++) {
    const prefix = word.substring(0, i);
    const suffix = word.substring(i);
    if (prefix.length >= 2 && suffix.length >= 2) {
      splits.push({ prefix, suffix, original: word });
    }
  }
  return splits;
};

// Generate all possible splits
const allSplits = [];
commonWords.forEach(word => {
  allSplits.push(...generateSplits(word));
});

// Collect all misspellings across all pages
const allMisspellings = new Set();
pages.forEach(page => {
  if (page.misspelled_words) {
    page.misspelled_words.forEach(word => allMisspellings.add(word.toLowerCase()));
  }
});

console.log('=== Analyzing Word Fragments ===');
console.log(`Total unique misspellings: ${allMisspellings.size}`);
console.log(`Analyzing ${allSplits.length} possible word splits...`);

// Find matches
const potentialMatches = [];
allSplits.forEach(split => {
  const hasPrefix = allMisspellings.has(split.prefix.toLowerCase());
  const hasSuffix = allMisspellings.has(split.suffix.toLowerCase());
  
  if (hasPrefix && hasSuffix) {
    potentialMatches.push({
      original: split.original,
      prefix: split.prefix,
      suffix: split.suffix,
      confidence: 'high'
    });
  } else if (hasPrefix || hasSuffix) {
    potentialMatches.push({
      original: split.original,
      prefix: split.prefix,
      suffix: split.suffix,
      found: hasPrefix ? split.prefix : split.suffix,
      confidence: 'medium'
    });
  }
});

console.log(`\n=== High Confidence Matches (both parts found) ===`);
const highConfidence = potentialMatches.filter(m => m.confidence === 'high');
highConfidence.forEach(match => {
  console.log(`"${match.prefix}" + "${match.suffix}" = "${match.original}"`);
});

console.log(`\n=== Medium Confidence Matches (one part found) ===`);
const mediumConfidence = potentialMatches.filter(m => m.confidence === 'medium').slice(0, 20);
mediumConfidence.forEach(match => {
  console.log(`Found "${match.found}" (could be part of "${match.original}")`);
});

// Find pages with potential broken styling
console.log(`\n=== Pages with Potential Broken Styling ===`);
pages.forEach(page => {
  if (!page.misspelled_words) return;
  
  const pageMatches = [];
  highConfidence.forEach(match => {
    const hasPrefix = page.misspelled_words.some(w => w.toLowerCase() === match.prefix.toLowerCase());
    const hasSuffix = page.misspelled_words.some(w => w.toLowerCase() === match.suffix.toLowerCase());
    if (hasPrefix && hasSuffix) {
      pageMatches.push(match);
    }
  });
  
  if (pageMatches.length > 0) {
    console.log(`\n${page.url}`);
    pageMatches.forEach(match => {
      console.log(`  - "${match.prefix}" + "${match.suffix}" = "${match.original}"`);
    });
  }
});

// Generate JavaScript patterns for the component
console.log(`\n=== Generated Patterns for Component ===`);
console.log('const brokenWordPatterns = [');
highConfidence.forEach(match => {
  console.log(`  { parts: ['${match.prefix}', '${match.suffix}'], word: '${match.original}' },`);
});
console.log('  // Add more patterns as discovered');
console.log('];');