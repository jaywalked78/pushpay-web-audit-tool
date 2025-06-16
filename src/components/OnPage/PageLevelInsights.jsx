import React, { useState, useMemo, useRef, useEffect } from 'react';
import AnimatedNumber from './AnimatedNumber';
import DetailedAnalysisCard from './DetailedAnalysisCard';
import { loadAnalysisData, getAnalysisForUrl, loadAnalysisForUrl, urlToFilename } from '../../utils/analysisHelpers';
import gsap from 'gsap';

const PageLevelInsights = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('onpage_score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedRow, setExpandedRow] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState({});
  const [loadedAnalyses, setLoadedAnalyses] = useState({});
  const [availableAnalyses, setAvailableAnalyses] = useState(new Set());
  
  // Refs for animations
  const summaryCardsRef = useRef([]);
  const tableRef = useRef(null);

  // Comprehensive whitelist of acceptable "misspellings" (false positives)
  const spellingWhitelist = [
    // Brand names and company terms (case insensitive)
    'pushpay', "pushpay's", "Pushpay's", 'pushpays', 'chms', 'staq', 'parishstaq', 'churchstaq', 'resi', 'quickbooks',
    'autopay', 'fastpay', 'livestream', 'signups', 'everygift', 'integrations', 'checkr',
    'analytics', 'ebook', 'bgh', 'coram', 'deo', 'asbury', 'kozlowski', 'senneff',
    'chao', 'gruia', 'kamy', 'beattie', 'meaney', 'bellevue', 'reeltown', 'leone',
    'mailchimp', 'mychurch', 'lamontagne', 'pco', "pco's", 'penafort', 'subsplash', 'rainer',
    'generis', 'profitstars', 'churchco', 'virtus', 'ccb', 'ncs', 'acs', 'isidore', 'sliker',
    'lovejoy', 'secret', 'blessing', 'o', "'secret", "'O", "'blessing", "pushpay's",
    
    // Technical terms and abbreviations
    'api', 'apis', 'saas', 'crm', 'pos', 'ui', 'ux', 'rss', 'ach', 'pre', 'barcodes',
    'homescreen', 'customizable', 'covid', 'ssl', 'https', 'http', 'cms', 'seo',
    'url', 'urls', 'html', 'css', 'js', 'json', 'xml', 'pdf', 'csv', 'sql',
    'oauth', 'jwt', 'cdn', 'dns', 'vpn', 'ide', 'sdk', 'npm', 'github', 'gitlab',
    'pci', 'dss', 'gdpr', 'eea', 'llc', 'sms', 'vbs', 'crypto', 'www', 'usd', 'aud', 'nzd',
    'cvv', 'tls', 'ddos', 'waf', 'hdmi', 'hvac', 'hd', 'vr', 'npo', 'roi', 'svp', 'cfo',
    'ceo', 'cto', 'hr', 'it', 'pr', 'qbo', 'crm', 'erp', 'bi', 'ai', 'ml', 'iot',
    
    // Religious and church terms
    'christian', 'christianity', 'ministry', 'ministries', 'parish', 'parishes',
    'diocese', 'dioceses', 'congregation', 'congregations', 'baptist', 'methodist',
    'presbyterian', 'episcopal', 'catholic', 'lutheran', 'pentecostal', 'evangelical',
    'worship', 'sermons', 'bible', 'biblical', 'scripture', 'scriptures', 'tithe',
    'tithes', 'tithing', 'offering', 'offerings', 'stewardship', 'discipleship',
    'outreach', 'missions', 'missionary', 'missionaries', 'pastor', 'pastors',
    'reverend', 'chaplain', 'deacon', 'elder', 'elders', 'vestry', 'rcia', 'ocia',
    'vbs', 'evangelization',
    
    // Business and technical terms
    'app', 'apps', 'mobile', 'dashboard', 'admin', 'login', 'logout', 'signup',
    'username', 'password', 'email', 'emails', 'newsletter', 'blog', 'blogs',
    'webinar', 'webinars', 'podcast', 'podcasts', 'ebook', 'ebooks', 'whitepaper',
    'whitepapers', 'onboarding', 'offboarding', 'fundraising', 'fundraiser',
    'nonprofit', 'nonprofits', 'online', 'offline', 'realtime', 'real-time',
    'automations', 'preconfigured', 'impactful', 'gamechanger', 'uptime', 'cancelled',
    'livestreaming', 'mischarged', 'cancellable', 'merchantability', 'anonymized',
    'chargebacks', 'unlink', 'jamsadr', 'adr', 'arbitrations', 'severability',
    'transactional', 'enablement', 'preapproved', 'preauthorized', 'deliverability',
    'multisite', 'scalable', 'passwordless', 'touchpoint', 'personalization',
    'lifecycle', 'roadmap', 'financials', 'inclusivity', 'embeddable', 'frictionless',
    'autofill', 'timeframe', 'discoverability', 'preselected', 'templated', 'pdfs',
    'cybersecurity', 'fintech', 'hackathon', 'metaverse', 'blockchain', 'millennials',
    'digitalization', 'coronavirus', 'lockdowns', 'mentorship', 'chaperones',
    
    // Geographic locations and country names (from country dropdowns)
    'usa', 'uk', 'canada', 'australia', 'zealand', 'america', 'american',
    'california', 'texas', 'florida', 'york', 'seattle', 'portland', 'denver',
    'atlanta', 'chicago', 'boston', 'philadelphia', 'nashville', 'austin',
    'aland', 'plurinational', 'bonaire', 'sint', 'eustatius', 'saba', 'bouvet',
    'darussalam', 'burkina', 'faso', 'costa', 'rica', "d'ivoire", 'curaçao', 'el',
    'malvinas', 'faroe', 'jamahiriya', 'mayotte', 'niue', 'papua', 'barthélemy', 'da',
    'cunha', 'kitts', 'miquelon', 'marino', 'sao', 'maarten', 'sri', 'mayen', 'leste',
    'tokelau', 'caicos', 'bolivarian', 'futuna', 'padua', 'brentwood', 'bayside',
    'saddleback', 'northstar', 'stockbridge', 'idlewild',
    
    // Additional high-frequency terms from analysis
    'conveniens', 'decompile', 'ibc', "resi's", 'camino', 'ministryplatform', 'pds', 'vanco',
    "parishstaq's", "pco's", 'aplos', 'assessme', 'bluepay', 'bombbomb', 'ccbchimp', 'thom',
    'clearstream', 'dunham', 'espace', 'frontporch', 'inthrma', 'intulse', 'ministrysafe',
    'pastorsline', 'pex', 'servicereef', 'steier', 'intacct', 'aup', 'venturers', 'inactions',
    'nda', "everygift's", 'songselect', 'livestreams', 'preloaded', 'engiven',
    
    // Smart quote variations (handling both regular and Unicode apostrophes)
    "pushpay's", "'pushpay's", "pco's", "'pco's", "resi's", "'resi's", "everygift's", "'everygift's",
    "parishstaq's", "'parishstaq's", 'tis', "'tis", 'impactful', 'reimagining',
    'livestreaming', 'roadmap', 'financials', 'customizable', 'preconfigured', 'touchpoint',
    'onboarding', 'mischarged', 'passwordless', 'gamechanger', 'hust', 'padua', 'rees', 'pointe',
    'pitigoi', 'telles', 'svp', 'rothermel', 'yocum', 'schofield', 'gabrielsoft', 'ministryplatform',
    'bombbomb', "bombbomb's", "'bombbomb's", "bombomb's", 'ccbchimp', "ccb's", "'ccb's", "ccb's", 
    'pastorsline', 'thomrainer', 'espace', 'serviceu', 'camino', 'lpi', 
    'visitorrereach', "visitorrereach's", "'visitorrereach's", 'visitorreach', "visitorreach's", "'visitorreach's",
    "another's", "'another's", 'anothers', "'anothers",
    'ly', "'s", "'refunded", 'dpf', "dpf's", 'le', 'verage',
    
    // Common proper names that appear in content
    'hust', 'rees', 'pointe', 'pitigoi', 'telles', 'rothermel', 'yocum', 'schofield',
    'reimagining', 'tis', 'flocknote', 'lpi', 'gabrielsoft', 'parishsoft', 'kia', 'ora',
    'vero', 'centre', 'shortland', 'devs', 'quickbook', 'assessme', 'copywriting',
    'bombbomb', 'ccbchimp', 'pastorsline', 'thomrainer', 'espace', 'serviceu', 'lil',
    'regie', 'securesearch', 'studioc', 'rightdoing', 'visitorrereach', 'visitortap',
    'dunham', 'alpos', 'ccbpress', 'eads', 'esupport', 'promocode', 'bizible',
    'demandbase', 'doubleclick', 'vwo', 'pendo', 'bluebridge', 'cyber', 'dpfas',
    "ach's", 'dcn', 'filkins', 'rsvp', 'livestreams', 'dropdown', 'draggable',
    'blockout', 'fastmode', 'chordpro', "cta's", 'teruel', 'intentionality',
    'pastoring', 'broadhead', 'bedenaugh', 'bedenbaugh', 'briscoe', 'discipling',
    'kersten', 'kregel', 'jenn', 'overcomers', 'lionheart', 'andi', "andi's",
    'betron', 'tani', 'packiam', 'glennpackium', 'marotti', 'abled', 'whye',
    'shetler', 'churchkids', 'strom', 'churchhome', 'bofill', 'servanthood',
    'hailey', 'sauer', 'nils', 'touchpoints', 'kehayias', 'artt', 'woodyard',
    'zeeveld', 'mcmanus', 'venti', 'churchome', 'zollo', 'bowdle', 'amidst',
    'jelinek', 'jenni', 'catron', 'lukaszewski', 'cottle', 'shayla', 'kenworthy',
    'pleasants', 'lenahan', 'veturis', 'bogard', 'allred', 'reagin', 'everygifttm',
    "deloitte's", 'sumita', 'pandit', 'kuck', "inspired's", 'trpy', 'gramling',
    'zuckerberg', 'how', 'erisman', 'ppu', 'batey', 'kush', 'yabut', 'rubinkowski',
    'sacramenttracker', 'serafin', 'cristian', 'schaefer',
    
    // Technology platforms and services
    'ok', 'okay', 'wifi', 'wi-fi', 'smartphone', 'smartphones', 'tablet', 'tablets',
    'ipad', 'iphone', 'android', 'ios', 'mac', 'pc', 'laptop', 'desktop',
    'internet', 'intranet', 'extranet', 'website', 'websites', 'webpage', 'webpages',
    'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'google', 'microsoft',
    'apple', 'amazon', 'stripe', 'paypal', 'venmo', 'zelle', 'vimeo', 'chromecast',
    'alexa', 'mastercard', 'visa', 'amex', 'discover', 'gmail', 'outlook', 'zoom',
    'teams', 'slack', 'dropbox', 'onedrive', 'sharepoint', 'salesforce', 'hubspot',
    'marketo', 'mailchimp', 'constantcontact', 'aweber', 'convertkit', 'activecampaign',
    
    // Proper names (people, places, organizations)
    'veritas', 'auxano', 'linc', 'cnlp', 'ccli', 'fumc', 'acutis', 'rms',
    'vanderbloemen', 'vanderbloeman', 'vanderblomen', 'glassdoor', 'deloitte',
    'akamai', 'digicert', 'verasafe', 'gramm', 'bliley', 'nacha', 'ofac',
    'durbin', 'ponzi', 'forex', 'hipaa', 'ccpa', 'gdpr', 'coppa', 'ferpa',
    
    // Legal and business terms
    'amongst', 'analyse', 'authorised', 'behavioural', 'licence', 'annum',
    'proratable', 'setoff', 'withholdings', 'servicers', 'bona', 'fide',
    'summative', 'rata', 'duplicative', 'noninfringement', 'severable',
    'sublicensable', 'sublicense', 'licensable', 'licensors', 'merchantability',
    'cfr', 'sdks', 'mms', 'gifs', 'captcha', 'balancers', 'recordkeeping',
    'incentivize', 'geolocation', 'biometric', 'masse', 'et', 'de', 'pty', 'ltd',
    
    // Common abbreviations and acronyms that might be flagged
    'wi', 'fi', 'kb', 'mb', 'gb', 'tb', 'cpu', 'gpu', 'ram', 'ssd', 'hdd',
    'usb', 'hdmi', 'bluetooth', 'nfc', 'qr', 'ar', 'vr', 'ai', 'ml', 'iot',
    'saas', 'paas', 'iaas', 'b2b', 'b2c', 'b2b2c', 'p2p', 'api', 'rest',
    'soap', 'http', 'https', 'ftp', 'sftp', 'ssh', 'vpn', 'lan', 'wan'
  ];

  const hasRealSpellingIssues = (page) => {
    if (!page.misspelled_words || page.misspelled_words.length === 0) {
      return false;
    }
    
    // Create a normalized whitelist for case-insensitive comparison
    const normalizedWhitelist = spellingWhitelist.map(word => word.toLowerCase());
    
    const realMisspellings = page.misspelled_words.filter(word => {
      if (!word || word.trim() === '') return false;
      // Normalize the word: lowercase and replace smart quotes with regular quotes
      const normalizedWord = word.toLowerCase().replace(/[\u2018\u2019]/g, "'");
      return !normalizedWhitelist.includes(normalizedWord);
    });
    
    return realMisspellings.length > 0;
  };

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

  // Mapping from display names to filter values
  const issueFilterMap = {
    'No H1': 'missing-h1',
    'No Desc': 'missing-desc', 
    'Spelling': 'real-spelling',
    'Alt Text': 'no-alt-text',
    'Low Content': 'low-content',
    'Excessive Content': 'excessive-content',
    'Blocking': 'blocking-resources',
    'Orphan': 'orphan',
    'Slow': 'slow',
    'Short Title': 'short-title',
    'Long Title': 'long-title',
    'Duplicate Content': 'duplicate-content',
    'Duplicate Title': 'duplicate-title',
    'Duplicate Desc': 'duplicate-desc',
    'Broken Links': 'broken-links',
    'Broken Resources': 'broken-resources',
    'Low Readability': 'low-readability',
    'Insecure Links': 'insecure-links',
    'Broken Styling': 'broken-styling'
  };

  const getIssuesList = (issues, page) => {
    const issueTypes = [];
    if (issues.no_h1_tag) issueTypes.push('No H1');
    if (issues.no_description) issueTypes.push('No Desc');
    if (hasRealSpellingIssues(page)) issueTypes.push('Spelling');
    if (issues.no_image_alt) issueTypes.push('Alt Text');
    if (issues.low_content_rate) issueTypes.push('Low Content');
    if (page.word_count > 1000) issueTypes.push('Excessive Content');
    if (issues.has_render_blocking_resources) issueTypes.push('Blocking');
    if (issues.is_orphan_page) issueTypes.push('Orphan');
    if (issues.high_loading_time) issueTypes.push('Slow');
    if (issues.title_too_short) issueTypes.push('Short Title');
    if (issues.title_too_long) issueTypes.push('Long Title');
    if (issues.duplicate_content) issueTypes.push('Duplicate Content');
    if (issues.duplicate_title) issueTypes.push('Duplicate Title');
    if (issues.duplicate_description) issueTypes.push('Duplicate Desc');
    if (issues.broken_links) issueTypes.push('Broken Links');
    if (issues.broken_resources) issueTypes.push('Broken Resources');
    if (issues.low_readability_rate) issueTypes.push('Low Readability');
    if (issues.https_to_http_links) issueTypes.push('Insecure Links');
    if (hasBrokenWordStyling(page)) issueTypes.push('Broken Styling');
    return issueTypes;
  };

  // Calculate actual metrics excluding redirects
  const validPages = data.pages.filter(page => 
    page.status_code !== 301 && page.status_code !== 302 && page.onpage_score > 0
  );
  
  // Calculate real spelling issues count dynamically
  const realSpellingIssuesCount = validPages.filter(page => hasRealSpellingIssues(page)).length;
  
  const actualMetrics = {
    total_pages: data.summary?.total_pages || validPages.length,
    average_score: data.summary?.average_score || (validPages.reduce((sum, page) => sum + page.onpage_score, 0) / validPages.length).toFixed(1),
    pages_with_issues: validPages.filter(page => {
      const issues = getIssuesList(page.issues, page);
      return issues.length > 0;
    }).length,
    orphan_pages: validPages.filter(page => page.issues.is_orphan_page).length,
    pages_missing_h1: validPages.filter(page => page.issues.no_h1_tag).length,
    pages_missing_description: validPages.filter(page => page.issues.no_description).length,
    pages_with_slow_loading: validPages.filter(page => page.time_to_interactive > 2000).length,
    pages_with_real_spelling_issues: realSpellingIssuesCount,
    pages_with_excessive_content: validPages.filter(page => page.word_count > 1000).length,
    average_load_time: Math.round(validPages.reduce((sum, page) => sum + page.time_to_interactive, 0) / validPages.length)
  };


  // Load analysis data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadAnalysisData();
        setAnalysisData(data);
        
        // Also check which analyses are available based on the master data
        if (data && data.pages && validPages.length > 0) {
          const available = new Set();
          validPages.forEach(page => {
            // Check if URL exists in analysis data (with URL variants)
            const urlVariants = [
              page.url,
              page.url + '/',
              page.url.replace(/\/$/, ''),
              page.url.startsWith('/') ? `https://pushpay.com${page.url}` : page.url,
              page.url.startsWith('/') ? `https://pushpay.com${page.url}/` : page.url + '/'
            ];
            
            if (urlVariants.some(url => data.pages[url])) {
              available.add(page.url);
            }
          });
          setAvailableAnalyses(available);
        }
      } catch (error) {
        console.error('Failed to load analysis data:', error);
      }
    };
    
    loadData();
  }, [validPages.length]);

  useEffect(() => {
    // Animate summary cards
    gsap.fromTo(summaryCardsRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    );

    // Animate table
    gsap.fromTo(tableRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: 'power2.out' }
    );
  }, []);

  // Handle detailed analysis toggle
  const handleDetailedAnalysis = async (pageUrl, index) => {
    if (expandedRow === index) {
      setExpandedRow(null);
      return;
    }

    setLoadingAnalysis(prev => ({ ...prev, [index]: true }));
    
    try {
      // Try to load individual analysis file first
      if (!loadedAnalyses[pageUrl]) {
        const individualAnalysis = await loadAnalysisForUrl(pageUrl);
        if (individualAnalysis) {
          setLoadedAnalyses(prev => ({ ...prev, [pageUrl]: individualAnalysis }));
        } else {
          // Fallback to general analysis data with URL variants
          if (analysisData && analysisData.pages) {
            const urlVariants = [
              pageUrl,
              pageUrl + '/',
              pageUrl.replace(/\/$/, ''),
              pageUrl.startsWith('/') ? `https://pushpay.com${pageUrl}` : pageUrl,
              pageUrl.startsWith('/') ? `https://pushpay.com${pageUrl}/` : pageUrl + '/'
            ];
            
            let foundAnalysis = null;
            for (const variant of urlVariants) {
              if (analysisData.pages[variant]) {
                foundAnalysis = analysisData.pages[variant];
                break;
              }
            }
            
            if (foundAnalysis) {
              setLoadedAnalyses(prev => ({ ...prev, [pageUrl]: foundAnalysis }));
            }
          }
        }
      }
      
      setExpandedRow(index);
    } catch (error) {
      console.error('Failed to load detailed analysis:', error);
    } finally {
      setLoadingAnalysis(prev => ({ ...prev, [index]: false }));
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBadge = (score) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
    if (score >= 75) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
    return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
  };

  const getLoadTimeBadge = (time) => {
    if (time <= 1000) return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
    if (time <= 2000) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
    return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
  };

  const filteredAndSortedPages = useMemo(() => {
    let filtered = data.pages.filter(page => {
      // Exclude redirect pages (301/302 status codes) that have no content
      if (page.status_code === 301 || page.status_code === 302 || page.onpage_score === 0) {
        return false;
      }
      
      const matchesSearch = page.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           page.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      switch (filterType) {
        case 'high-score':
          return page.onpage_score >= 90;
        case 'needs-improvement':
          return page.onpage_score < 75;
        case 'orphan':
          return page.issues.is_orphan_page;
        case 'slow':
          return page.time_to_interactive > 2000;
        case 'excessive-content':
          return page.word_count > 1000;
        case 'missing-h1':
          return page.issues.no_h1_tag;
        case 'missing-desc':
          return page.issues.no_description;
        case 'real-spelling':
          return hasRealSpellingIssues(page);
        case 'no-alt-text':
          return page.issues.no_image_alt;
        case 'low-content':
          return page.issues.low_content_rate;
        case 'blocking-resources':
          return page.issues.has_render_blocking_resources;
        case 'short-title':
          return page.issues.title_too_short;
        case 'long-title':
          return page.issues.title_too_long;
        case 'duplicate-content':
          return page.issues.duplicate_content;
        case 'duplicate-title':
          return page.issues.duplicate_title;
        case 'duplicate-desc':
          return page.issues.duplicate_description;
        case 'broken-links':
          return page.issues.broken_links;
        case 'broken-resources':
          return page.issues.broken_resources;
        case 'low-readability':
          return page.issues.low_readability_rate;
        case 'insecure-links':
          return page.issues.https_to_http_links;
        case 'broken-styling':
          return hasBrokenWordStyling(page);
        default:
          return true;
      }
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'url':
          aValue = a.url;
          bValue = b.url;
          break;
        case 'onpage_score':
          aValue = a.onpage_score;
          bValue = b.onpage_score;
          break;
        case 'time_to_interactive':
          aValue = a.time_to_interactive;
          bValue = b.time_to_interactive;
          break;
        case 'word_count':
          aValue = a.word_count;
          bValue = b.word_count;
          break;
        default:
          aValue = a.onpage_score;
          bValue = b.onpage_score;
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [data.pages, searchTerm, filterType, sortBy, sortOrder]);

  const exportToCSV = () => {
    const headers = ['URL', 'Score', 'Load Time (ms)', 'Word Count', 'Issues', 'Last Modified'];
    const csvData = filteredAndSortedPages.map(page => [
      page.url,
      page.onpage_score,
      page.time_to_interactive,
      page.word_count,
      getIssuesList(page.issues).join('; '),
      page.last_modified
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pushpay-page-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Page-Level Insights
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Detailed analysis of {actualMetrics.total_pages} pages (excluding redirects)
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          ref={el => summaryCardsRef.current[0] = el}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            <AnimatedNumber value={actualMetrics.total_pages} delay={200} duration={1000} />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Pages</div>
          <div className="text-xs text-gray-400 mt-1">
            <AnimatedNumber value={actualMetrics.average_score} decimals={1} delay={400} duration={1200} suffix="%" /> avg score
          </div>
        </div>

        <div 
          ref={el => summaryCardsRef.current[1] = el}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            <AnimatedNumber value={actualMetrics.pages_with_issues} delay={400} duration={1000} />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Issues Found</div>
          <div className="text-xs text-gray-400 mt-1">
            <AnimatedNumber value={actualMetrics.orphan_pages} delay={600} duration={1200} /> orphan pages
          </div>
        </div>

        <div 
          ref={el => summaryCardsRef.current[2] = el}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            <AnimatedNumber value={actualMetrics.pages_with_slow_loading} delay={600} duration={1000} />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Slow Pages</div>
          <div className="text-xs text-gray-400 mt-1">
            <AnimatedNumber value={actualMetrics.average_load_time} delay={800} duration={1200} suffix="ms" /> avg load
          </div>
        </div>

        <div 
          ref={el => summaryCardsRef.current[3] = el}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            <AnimatedNumber value={actualMetrics.pages_with_real_spelling_issues} delay={800} duration={1000} />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Spelling Issues</div>
          <div className="text-xs text-gray-400 mt-1">
            <AnimatedNumber value={actualMetrics.pages_with_excessive_content} delay={1000} duration={1200} /> excessive content
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div 
        ref={tableRef}
        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Pages</option>
              <option value="blocking-resources">Blocking Resources</option>
              <option value="broken-links">Broken Links</option>
              <option value="broken-resources">Broken Resources</option>
              <option value="broken-styling">Broken Styling</option>
              <option value="duplicate-content">Duplicate Content</option>
              <option value="duplicate-desc">Duplicate Description</option>
              <option value="duplicate-title">Duplicate Title</option>
              <option value="excessive-content">Excessive Content (1k+ words)</option>
              <option value="high-score">High Score (90+)</option>
              <option value="insecure-links">Insecure Links</option>
              <option value="long-title">Long Title</option>
              <option value="low-content">Low Content Rate</option>
              <option value="low-readability">Low Readability</option>
              <option value="missing-desc">Missing Description</option>
              <option value="missing-h1">Missing H1</option>
              <option value="needs-improvement">Needs Improvement (&lt;75)</option>
              <option value="no-alt-text">Missing Alt Text</option>
              <option value="orphan">Orphan Pages</option>
              <option value="real-spelling">Real Spelling Issues</option>
              <option value="short-title">Short Title</option>
              <option value="slow">Slow Loading</option>
            </select>
          </div>

          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="onpage_score">Score</option>
              <option value="time_to_interactive">Load Time</option>
              <option value="word_count">Word Count</option>
              <option value="url">URL</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Showing {filteredAndSortedPages.length} of {actualMetrics.total_pages} pages
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">URL</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Load Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Issues</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Words</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Analysis</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedPages.map((page, index) => {
                const issues = getIssuesList(page.issues, page);
                const pageAnalysis = loadedAnalyses[page.url] || (analysisData ? getAnalysisForUrl(analysisData, page.url) : null);
                // Check if analysis file actually exists (check both with and without trailing slash)
                const urlVariants = [page.url, page.url + '/', page.url.replace(/\/$/, '')];
                const hasAnalysis = urlVariants.some(url => availableAnalyses.has(url)) || pageAnalysis;
                const isExpanded = expandedRow === index;
                const isLoading = loadingAnalysis[index];
                
                return (
                  <React.Fragment key={index}>
                    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4">
                        <div className="max-w-xs">
                          <a 
                            href={page.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 truncate block transition-colors"
                          >
                            {page.url === 'https://pushpay.com/' ? 'Homepage' : page.url.replace('https://pushpay.com', '')}
                          </a>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {page.title}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreBadge(page.onpage_score)}`}>
                          {page.onpage_score.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLoadTimeBadge(page.time_to_interactive)}`}>
                          {page.time_to_interactive}ms
                        </span>
                      </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {issues.slice(0, 3).map((issue, i) => {
                          if (issue === 'Spelling' && page.misspelled_words) {
                            const normalizedWhitelist = spellingWhitelist.map(word => word.toLowerCase());
                            const realMisspellings = page.misspelled_words.filter(word => {
                              if (!word || word.trim() === '') return false;
                              const normalizedWord = word.toLowerCase().replace(/[\u2018\u2019]/g, "'");
                              return !normalizedWhitelist.includes(normalizedWord);
                            });
                            return (
                              <span 
                                key={i} 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 cursor-pointer hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors relative group"
                                onClick={() => setFilterType('real-spelling')}
                                title={`Click to filter by ${issue}. Real misspellings: ${realMisspellings.join(', ')}`}
                              >
                                {issue}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg max-w-xs">
                                  Click to filter by {issue}<br/>Real misspellings: {realMisspellings.join(', ') || 'None (filtered out brand terms)'}
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                                </div>
                              </span>
                            );
                          }
                          if (issue === 'Broken Styling' && page.misspelled_words) {
                            // Show details about potential broken styling
                            const brokenWordFragments = [];
                            
                            // Check for confirmed patterns
                            const knownPatterns = [
                              { parts: ['le', 'verage'], word: 'leverage' }
                            ];
                            
                            knownPatterns.forEach(pattern => {
                              const hasAllParts = pattern.parts.every(part => 
                                page.misspelled_words.some(word => word.toLowerCase() === part.toLowerCase())
                              );
                              if (hasAllParts) {
                                brokenWordFragments.push(`"${pattern.parts.join('" + "')}" = "${pattern.word}"`);
                              }
                            });
                            
                            // If no confirmed patterns, show count of suspicious fragments
                            if (brokenWordFragments.length === 0) {
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
                              
                              if (suspiciousFragments.length >= 3) {
                                brokenWordFragments.push(`${suspiciousFragments.length} suspicious fragments: ${suspiciousFragments.slice(0, 5).join(', ')}${suspiciousFragments.length > 5 ? '...' : ''}`);
                              }
                            }
                            return (
                              <span 
                                key={i} 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-800/50 transition-colors relative group"
                                onClick={() => setFilterType('broken-styling')}
                                title={`Click to filter by ${issue}. Broken words: ${brokenWords.join(', ')}`}
                              >
                                {issue}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg max-w-xs">
                                  Click to filter by {issue}<br/>{brokenWordFragments.length > 0 ? brokenWordFragments.join('; ') : 'Potential styling issues detected'}
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                                </div>
                              </span>
                            );
                          }
                          const filterValue = issueFilterMap[issue];
                          return (
                            <span 
                              key={i} 
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 cursor-pointer hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                              onClick={() => filterValue && setFilterType(filterValue)}
                              title={`Click to filter by ${issue}`}
                            >
                              {issue}
                            </span>
                          );
                        })}
                        {issues.length > 3 && (
                          <span 
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-help relative group"
                            title={issues.slice(3).join(', ')}
                          >
                            +{issues.length - 3}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                              {issues.slice(3).join(', ')}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                            </div>
                          </span>
                        )}
                      </div>
                    </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {page.word_count?.toLocaleString() || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDetailedAnalysis(page.url, index)}
                          disabled={isLoading || !hasAnalysis}
                          className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                            hasAnalysis 
                              ? isExpanded
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800/50'
                                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-3 w-3" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Loading...
                            </>
                          ) : hasAnalysis ? (
                            <>
                              <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                              </svg>
                              {isExpanded ? 'Hide' : 'Analysis'}
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              No Analysis Yet
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Detailed Analysis Row */}
                    {isExpanded && pageAnalysis && (
                      <tr>
                        <td colSpan="6" className="p-0">
                          <DetailedAnalysisCard 
                            analysis={pageAnalysis}
                            onClose={() => setExpandedRow(null)}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAndSortedPages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500 dark:text-gray-400">No pages found matching your criteria</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageLevelInsights;