import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the data
const dataPath = path.join(__dirname, '../src/data/pushPayFilteredPageData.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const pages = data[0].pages;

// Function to detect broken styling (copied from component)
const hasBrokenWordStyling = (page) => {
  // Detect broken words where styling splits legitimate words
  if (!page.misspelled_words || page.misspelled_words.length === 0) {
    return false;
  }
  
  // Known broken word patterns (confirmed cases)
  const brokenWordPatterns = [
    { parts: ['le', 'verage'], word: 'leverage' },
    // Add more confirmed patterns as discovered
  ];
  
  // Check for confirmed patterns first
  const hasConfirmedPattern = brokenWordPatterns.some(pattern => {
    return pattern.parts.every(part => 
      page.misspelled_words.some(word => word.toLowerCase() === part.toLowerCase())
    );
  });
  
  if (hasConfirmedPattern) return true;
  
  // Heuristic detection: look for suspicious combinations of very short fragments
  // excluding known technical terms and country names
  const excludedTerms = new Set([
    'chms', 'pre', 'resi', 'pci', 'dss', 'apis', 'ach', 'rms', 'pco', 'csv', 'rss',
    'gdpr', 'ccb', 'ncs', 'eea', 'saas', 'llc', 'vbs', 'acs', 'ui', 'sms', 'http',
    'ssl', 'tls', 'waf', 'ddos', 'dns', 'aup', 'ccpa', 'cvv', 'usd', 'aud', 'mms',
    'www', 'adr', 'sdk', 'pty', 'kb', 'hd', 'wi', 'fi', 'qbo', 'pex', 'hvac',
    // Country name fragments
    'sint', 'saba', 'faso', 'rica', 'el', 'niue', 'da', 'sao', 'sri', 'aland',
    'bonaire', 'eustatius', 'bouvet', 'darussalam', 'burkina', 'costa', 'cunha',
    'kitts', 'miquelon', 'marino', 'leone', 'maarten', 'mayen', 'leste', 'tokelau',
    'caicos', 'bolivarian', 'futuna'
  ]);
  
  // Count suspicious short words (2-3 chars, not in excluded list)
  const suspiciousShortWords = page.misspelled_words.filter(word => {
    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    return clean.length >= 2 && clean.length <= 3 && 
           clean.match(/^[a-z]+$/) && 
           !excludedTerms.has(clean);
  });
  
  // Flag as potential broken styling if there are 3+ suspicious short words
  // This suggests content may have styling issues splitting words
  return suspiciousShortWords.length >= 3;
};

console.log('=== Testing Enhanced Broken Styling Detection ===');

// Find the Catholic CHMS page specifically
const catholicChmsPage = pages.find(page => 
  page.url.includes('/product/catholic/chms-software') || 
  page.url.includes('chms-software')
);

if (catholicChmsPage) {
  console.log(`\nFound Catholic CHMS page: ${catholicChmsPage.url}`);
  console.log('Misspelled words:', catholicChmsPage.misspelled_words);
  console.log('Has broken styling:', hasBrokenWordStyling(catholicChmsPage));
  
  // Check for le and verage specifically
  const hasLe = catholicChmsPage.misspelled_words && catholicChmsPage.misspelled_words.includes('le');
  const hasVerage = catholicChmsPage.misspelled_words && catholicChmsPage.misspelled_words.includes('verage');
  console.log(`Has "le": ${hasLe}`);
  console.log(`Has "verage": ${hasVerage}`);
} else {
  console.log('Catholic CHMS page not found, checking all pages for broken styling...');
}

// Check all pages for broken styling
const pagesWithBrokenStyling = pages.filter(page => hasBrokenWordStyling(page));
console.log(`\nTotal pages with potential broken styling: ${pagesWithBrokenStyling.length}`);

pagesWithBrokenStyling.forEach(page => {
  console.log(`\n- ${page.url}`);
  
  // Check for confirmed patterns
  const knownPatterns = [
    { parts: ['le', 'verage'], word: 'leverage' }
  ];
  
  const confirmedPatterns = [];
  knownPatterns.forEach(pattern => {
    const hasAllParts = pattern.parts.every(part => 
      page.misspelled_words.some(word => word.toLowerCase() === part.toLowerCase())
    );
    if (hasAllParts) {
      confirmedPatterns.push(`\"${pattern.parts.join('\" + \"')}\" = \"${pattern.word}\"`);
    }
  });
  
  if (confirmedPatterns.length > 0) {
    console.log(`  CONFIRMED broken styling: ${confirmedPatterns.join('; ')}`);
  } else {
    // Show suspicious fragments
    const excludedTerms = new Set([
      'chms', 'pre', 'resi', 'pci', 'dss', 'apis', 'ach', 'rms', 'pco', 'csv', 'rss',
      'gdpr', 'ccb', 'ncs', 'eea', 'saas', 'llc', 'vbs', 'acs', 'ui', 'sms', 'http',
      'ssl', 'tls', 'waf', 'ddos', 'dns', 'aup', 'ccpa', 'cvv', 'usd', 'aud', 'mms',
      'www', 'adr', 'sdk', 'pty', 'kb', 'hd', 'wi', 'fi', 'qbo', 'pex', 'hvac',
      'sint', 'saba', 'faso', 'rica', 'el', 'niue', 'da', 'sao', 'sri', 'aland',
      'bonaire', 'eustatius', 'bouvet', 'darussalam', 'burkina', 'costa', 'cunha',
      'kitts', 'miquelon', 'marino', 'leone', 'maarten', 'mayen', 'leste', 'tokelau',
      'caicos', 'bolivarian', 'futuna'
    ]);
    
    const suspiciousFragments = page.misspelled_words.filter(word => {
      const clean = word.toLowerCase().replace(/[^a-z]/g, '');
      return clean.length >= 2 && clean.length <= 3 && 
             clean.match(/^[a-z]+$/) && 
             !excludedTerms.has(clean);
    });
    
    console.log(`  POTENTIAL broken styling: ${suspiciousFragments.length} suspicious fragments`);
    console.log(`  Fragments: ${suspiciousFragments.slice(0, 10).join(', ')}${suspiciousFragments.length > 10 ? '...' : ''}`);
  }
});