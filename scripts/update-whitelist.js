#!/usr/bin/env node

// High-frequency terms to add to whitelist
const highFrequencyTerms = [
  // Possessive forms
  "pushpay's", 'pushpays',
  
  // Geographic/Country names (likely from country dropdowns)
  'leone', 'aland', 'plurinational', 'bonaire', 'sint', 'eustatius', 'saba', 'bouvet',
  'darussalam', 'burkina', 'faso', 'costa', 'rica', "d'ivoire", 'curaçao', 'el',
  'malvinas', 'faroe', 'jamahiriya', 'mayotte', 'niue', 'papua', 'barthélemy', 'da',
  'cunha', 'kitts', 'miquelon', 'marino', 'sao', 'maarten', 'sri', 'mayen', 'leste',
  'tokelau', 'caicos', 'bolivarian', 'futuna',
  
  // Technical/Business terms
  'pci', 'dss', 'automations', 'preconfigured', 'impactful', 'rms', 'mychurch',
  'lamontagne', 'mailchimp', 'pco', 'penafort', 'gamechanger', 'uptime', 'cancelled',
  'conveniens', 'gdpr', 'livestreaming', 'mischarged', 'ccb', 'ncs', 'cancellable',
  'merchantability', 'anonymized', 'eea', 'llc', 'vbs', 'crypto', 'acs', 'subsplash',
  'rainer', 'generis', 'profitstars', 'churchco', 'virtus', 'sms', 'chargebacks',
  'pty', 'unlink', 'www', 'jamsadr', 'adr', 'arbitrations', 'severability',
  
  // Names (people/places)
  'isidore', 'sliker', 'padua', 'reeltown', 'bellevue', 'meaney'
];

console.log('🚀 Suggested whitelist additions for high-frequency terms:\n');
console.log('Add these to your spellingWhitelist array in PageLevelInsights.jsx:\n');

// Format for easy copying
const formatted = highFrequencyTerms.map(term => `'${term}'`).join(',\n  ');
console.log('  // High-frequency additions:');
console.log(`  ${formatted}`);

console.log('\n📋 Copy the above lines and paste them into your spellingWhitelist array.');
console.log('💡 After adding these, run the analyze-misspellings.js script again to see the results!');