/**
 * Analysis Helper Utilities
 * Functions for loading, processing, and working with AI analysis data
 */

// Convert URL to filename format (replace / with _ after domain)
export function urlToFilename(url) {
  // Handle both full URLs and path-only URLs
  let processUrl = url;
  
  // If it's a path-only URL (starts with /), prepend the domain
  if (url.startsWith('/')) {
    processUrl = 'https://pushpay.com' + url;
  }
  
  // Remove protocol and www if present
  let cleanUrl = processUrl.replace(/^https?:\/\/(www\.)?/, '');
  
  // For pushpay.com URLs, replace / with _ after the domain
  if (cleanUrl.startsWith('pushpay.com')) {
    cleanUrl = cleanUrl.replace(/\//g, '_');
  }
  
  return cleanUrl + '.json';
}

// Load AI analysis data with error handling
export async function loadAnalysisData() {
  try {
    const response = await fetch('/src/data/aiAnalysisData.json');
    if (!response.ok) {
      throw new Error(`Failed to load analysis data: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading analysis data:', error);
    return null;
  }
}

// Load individual analysis file for a specific URL
export async function loadAnalysisForUrl(url) {
  try {
    const filename = urlToFilename(url);
    const response = await fetch(`/src/data/Enriched URL Data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load analysis for URL: ${response.status}`);
    }
    const rawData = await response.json();
    
    // Handle the array format from your JSON file
    const record = Array.isArray(rawData) ? rawData[0] : rawData;
    
    if (!record || !record.fields) {
      throw new Error('Invalid data format');
    }
    
    // Transform the Airtable format to our expected structure
    const fields = record.fields;
    const processedAnalysis = transformAirtableRecord(fields);
    
    return processedAnalysis;
  } catch (error) {
    console.error(`Error loading analysis for URL ${url}:`, error);
    return null;
  }
}

// Apply weighted scoring boost
function applyWeightedScore(originalScore) {
  if (originalScore < 50) return Math.min(100, Math.round(originalScore * 1.65));
  if (originalScore >= 50 && originalScore < 60) return Math.min(100, Math.round(originalScore * 1.5));
  if (originalScore >= 60 && originalScore <= 80) return Math.min(100, Math.round(originalScore * 1.35));
  if (originalScore > 80) return Math.min(100, Math.round(originalScore * 1.2));
  return originalScore;
}

// Transform Airtable record to our expected format
function transformAirtableRecord(fields) {
  const originalScore = fields.overallScore || 0;
  const boostedScore = applyWeightedScore(originalScore);
  
  return {
    url: fields.url,
    pageType: fields.pageType || 'unknown',
    overallScore: boostedScore,
    originalScore: originalScore, // Keep original for reference
    auditDate: fields.auditDate || new Date().toISOString().split('T')[0],
    summary: {
      performance: fields.performanceSummary || '',
      scoreBreakdown: parseScoreBreakdown(fields.scoreBreakdown),
      strengths: parseStrengths(fields.currentStrengths),
      quickWinCount: fields.quickWinCount || 0,
      issueCount: fields.issueCount || 0
    },
    opportunities: parseOpportunities(fields.optimizationOpportunities),
    actions: parseActions(fields.recommendedActions),
    quickWins: parseQuickWins(fields.quickWins),
    implementation: {
      phases: parseImplementationPhases(fields.implementationApproach),
      siteWideContext: fields.siteWideContext || '',
      expectedOutcomes: parseExpectedOutcomes(fields.expectedOutcomes)
    },
    metadata: {
      priority: fields.pagePriority || 'medium',
      tags: fields.projectTags ? fields.projectTags.split(',').map(tag => tag.trim()) : [],
      effort: parseFloat(fields.avgEffortScore) || 5,
      impact: parseFloat(fields.avgImpactScore) || 5
    },
    executiveSummary: fields.executiveSummary || '',
    professionalAssessment: fields.professionalAssessment || ''
  };
}

// Helper parsing functions (moved from sync script for reuse)
function parseOpportunities(opportunityText) {
  if (!opportunityText) return [];
  
  const opportunities = [];
  const parts = opportunityText.split('||').filter(part => part.trim());
  
  for (const part of parts) {
    const match = part.match(/Opportunity (\d+): (.+?) \| Impact Level: (.+?) \| Implementation Complexity: (.+)/);
    if (match) {
      opportunities.push({
        id: parseInt(match[1]),
        title: match[2].trim(),
        impactLevel: match[3].trim().replace(' Opportunity', '').replace(' Impact', ''),
        complexity: match[4].trim(),
        description: match[2].trim()
      });
    }
  }
  
  return opportunities;
}

function parseActions(actionText) {
  if (!actionText) return [];
  
  const actions = [];
  const parts = actionText.split('||').filter(part => part.trim());
  
  for (const part of parts) {
    const match = part.match(/Action (\d+): (.+)/);
    if (match) {
      actions.push({
        id: parseInt(match[1]),
        description: match[2].trim(),
        priority: 'medium'
      });
    }
  }
  
  return actions;
}

function parseQuickWins(quickWinText) {
  if (!quickWinText) return [];
  
  const quickWins = [];
  const parts = quickWinText.split('||').filter(part => part.trim());
  
  for (const part of parts) {
    const match = part.match(/Quick Win (\d+): (.+?) \| Implementation: (.+?) \| Business Impact: (.+)/);
    if (match) {
      quickWins.push({
        id: parseInt(match[1]),
        title: match[2].trim(),
        implementation: match[3].trim(),
        businessImpact: match[4].trim(),
        effort: 'low'
      });
    }
  }
  
  return quickWins;
}

function parseScoreBreakdown(scoreText) {
  if (!scoreText) return { technical: 0, content: 0, accessibility: 0, performance: 0 };
  
  const breakdown = { technical: 0, content: 0, accessibility: 0, performance: 0 };
  
  const technicalMatch = scoreText.match(/Technical: (\d+)\/100/);
  const contentMatch = scoreText.match(/Content: (\d+)\/100/);
  const accessibilityMatch = scoreText.match(/Accessibility: (\d+)\/100/);
  const performanceMatch = scoreText.match(/Performance: (\d+)\/100/);
  
  if (technicalMatch) breakdown.technical = applyWeightedScore(parseInt(technicalMatch[1]));
  if (contentMatch) breakdown.content = applyWeightedScore(parseInt(contentMatch[1]));
  if (accessibilityMatch) breakdown.accessibility = applyWeightedScore(parseInt(accessibilityMatch[1]));
  if (performanceMatch) breakdown.performance = applyWeightedScore(parseInt(performanceMatch[1]));
  
  return breakdown;
}

function parseImplementationPhases(implementationText) {
  if (!implementationText) return [];
  
  const phases = [];
  const lines = implementationText.split('|').filter(line => line.trim());
  
  let phaseCount = 1;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('Phase')) {
      const match = trimmed.match(/Phase (\d+).*?: (.+)/);
      if (match) {
        phases.push({
          id: parseInt(match[1]),
          name: match[2].trim(),
          tasks: []
        });
      }
    } else if (trimmed && phases.length === 0) {
      // Handle cases where phases aren't clearly marked
      phases.push({
        id: phaseCount++,
        name: trimmed,
        tasks: []
      });
    }
  }
  
  return phases;
}

function parseStrengths(strengthsText) {
  if (!strengthsText) return [];
  
  return strengthsText
    .split('|')
    .filter(strength => strength.trim())
    .map(strength => strength.trim());
}

function parseExpectedOutcomes(outcomesText) {
  if (!outcomesText) return [];
  
  return outcomesText
    .split('|')
    .filter(outcome => outcome.trim())
    .map(outcome => outcome.trim());
}

// Get analysis for a specific URL
export function getAnalysisForUrl(analysisData, url) {
  if (!analysisData || !analysisData.pages) {
    return null;
  }
  
  // Direct lookup first
  if (analysisData.pages[url]) {
    return analysisData.pages[url];
  }
  
  // Try with and without trailing slash
  const urlWithSlash = url.endsWith('/') ? url : url + '/';
  const urlWithoutSlash = url.endsWith('/') ? url.slice(0, -1) : url;
  
  return analysisData.pages[urlWithSlash] || analysisData.pages[urlWithoutSlash] || null;
}

// Format score with color class
export function getScoreColorClass(score) {
  if (score >= 90) return 'text-green-600 dark:text-green-400';
  if (score >= 75) return 'text-yellow-600 dark:text-yellow-400';
  if (score >= 60) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

// Get priority badge class
export function getPriorityBadgeClass(priority) {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
    case 'medium':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
    case 'low':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
  }
}

// Get impact/effort badge class
export function getImpactEffortBadgeClass(score) {
  if (score >= 8) return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
  if (score >= 6) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
  if (score >= 4) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200';
  return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
}

// Format date for display
export function formatAnalysisDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Unknown date';
  }
}

// Calculate days since analysis
export function getDaysSinceAnalysis(dateString) {
  try {
    const analysisDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - analysisDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {
    return null;
  }
}

// Get freshness indicator
export function getAnalysisFreshness(dateString) {
  const days = getDaysSinceAnalysis(dateString);
  if (days === null) return { status: 'unknown', message: 'Unknown date' };
  
  if (days <= 7) return { status: 'fresh', message: `${days} days ago` };
  if (days <= 30) return { status: 'recent', message: `${days} days ago` };
  if (days <= 90) return { status: 'aging', message: `${days} days ago` };
  return { status: 'stale', message: `${days} days ago` };
}

// Sort opportunities by impact and complexity
export function sortOpportunities(opportunities) {
  const impactOrder = { 'high': 3, 'medium': 2, 'low': 1 };
  const complexityOrder = { 'low': 3, 'medium': 2, 'high': 1 };
  
  return [...opportunities].sort((a, b) => {
    const aImpact = impactOrder[a.impactLevel?.toLowerCase()] || 0;
    const bImpact = impactOrder[b.impactLevel?.toLowerCase()] || 0;
    const aComplexity = complexityOrder[a.complexity?.toLowerCase()] || 0;
    const bComplexity = complexityOrder[b.complexity?.toLowerCase()] || 0;
    
    // Sort by impact first (higher is better), then by complexity (lower is better)
    if (aImpact !== bImpact) return bImpact - aImpact;
    return bComplexity - aComplexity;
  });
}

// Sort quick wins by business impact
export function sortQuickWins(quickWins) {
  const impactOrder = { 'high': 3, 'medium': 2, 'low': 1 };
  
  return [...quickWins].sort((a, b) => {
    const aImpact = impactOrder[a.businessImpact?.toLowerCase()] || 0;
    const bImpact = impactOrder[b.businessImpact?.toLowerCase()] || 0;
    return bImpact - aImpact;
  });
}

// Generate summary statistics
export function generateAnalysisSummary(analysisData) {
  if (!analysisData || !analysisData.pages) {
    return null;
  }
  
  const pages = Object.values(analysisData.pages);
  const totalPages = pages.length;
  
  if (totalPages === 0) return null;
  
  const avgScore = pages.reduce((sum, page) => sum + (page.overallScore || 0), 0) / totalPages;
  const highPriorityPages = pages.filter(page => page.metadata?.priority === 'high').length;
  const totalQuickWins = pages.reduce((sum, page) => sum + (page.summary?.quickWinCount || 0), 0);
  const totalIssues = pages.reduce((sum, page) => sum + (page.summary?.issueCount || 0), 0);
  
  // Score distribution
  const scoreRanges = {
    excellent: pages.filter(page => (page.overallScore || 0) >= 90).length,
    good: pages.filter(page => (page.overallScore || 0) >= 75 && (page.overallScore || 0) < 90).length,
    needsWork: pages.filter(page => (page.overallScore || 0) >= 60 && (page.overallScore || 0) < 75).length,
    poor: pages.filter(page => (page.overallScore || 0) < 60).length
  };
  
  return {
    totalPages,
    avgScore: Math.round(avgScore * 10) / 10,
    highPriorityPages,
    totalQuickWins,
    totalIssues,
    scoreRanges,
    lastUpdated: analysisData.lastUpdated
  };
}

// Validate analysis data structure
export function validateAnalysisData(data) {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Data is not an object'] };
  }
  
  const errors = [];
  
  if (!data.pages || typeof data.pages !== 'object') {
    errors.push('Missing or invalid pages object');
  }
  
  if (!data.lastUpdated) {
    errors.push('Missing lastUpdated field');
  }
  
  if (data.totalPages !== undefined && typeof data.totalPages !== 'number') {
    errors.push('totalPages should be a number');
  }
  
  // Validate a sample of pages
  if (data.pages) {
    const pageUrls = Object.keys(data.pages);
    const sampleSize = Math.min(5, pageUrls.length);
    
    for (let i = 0; i < sampleSize; i++) {
      const url = pageUrls[i];
      const page = data.pages[url];
      
      if (!page.url) errors.push(`Page ${url}: missing url field`);
      if (page.overallScore !== undefined && (typeof page.overallScore !== 'number' || page.overallScore < 0 || page.overallScore > 100)) {
        errors.push(`Page ${url}: invalid overallScore`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Export utility for downloading analysis data
export function exportAnalysisToCSV(analysisData, selectedUrls = null) {
  if (!analysisData || !analysisData.pages) {
    throw new Error('Invalid analysis data');
  }
  
  const pages = selectedUrls 
    ? selectedUrls.map(url => analysisData.pages[url]).filter(Boolean)
    : Object.values(analysisData.pages);
  
  const headers = [
    'URL',
    'Page Type',
    'Overall Score',
    'Audit Date',
    'Priority',
    'Quick Wins',
    'Issues',
    'Performance Summary',
    'Effort Score',
    'Impact Score'
  ];
  
  const csvData = pages.map(page => [
    page.url || '',
    page.pageType || '',
    page.overallScore || 0,
    page.auditDate || '',
    page.metadata?.priority || '',
    page.summary?.quickWinCount || 0,
    page.summary?.issueCount || 0,
    (page.summary?.performance || '').replace(/\n/g, ' ').replace(/,/g, ';'),
    page.metadata?.effort || '',
    page.metadata?.impact || ''
  ]);
  
  const csvContent = [headers, ...csvData]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  return csvContent;
}

// Check if analysis data is stale and needs refresh
export function isAnalysisStale(analysisData, maxAgeHours = 24) {
  if (!analysisData || !analysisData.lastUpdated) {
    return true;
  }
  
  try {
    const lastUpdate = new Date(analysisData.lastUpdated);
    const now = new Date();
    const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60);
    
    return hoursSinceUpdate > maxAgeHours;
  } catch (error) {
    return true;
  }
}