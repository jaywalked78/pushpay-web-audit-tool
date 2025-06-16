#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found. Please create one with AIRTABLE_PERSONAL_ACCESS_TOKEN, AIRTABLE_BASE_ID, and AIRTABLE_TABLE_NAME');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  });

  return envVars;
}

const env = loadEnvFile();

const AIRTABLE_CONFIG = {
  token: env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
  baseId: env.AIRTABLE_BASE_ID,
  tableName: env.AIRTABLE_TABLE_NAME || 'AI Analysis Data'
};

// Validate configuration
if (!AIRTABLE_CONFIG.token || !AIRTABLE_CONFIG.baseId) {
  console.error('❌ Missing required environment variables. Please check your .env file.');
  console.error('Required: AIRTABLE_PERSONAL_ACCESS_TOKEN, AIRTABLE_BASE_ID');
  process.exit(1);
}

// Data parsing functions
function parseOpportunities(opportunityText) {
  if (!opportunityText) return [];
  
  const opportunities = [];
  const lines = opportunityText.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    const match = line.match(/Opportunity (\d+): (.+?) \| Impact Level: (.+?) \| Implementation Complexity: (.+)/);
    if (match) {
      opportunities.push({
        id: parseInt(match[1]),
        title: match[2].trim(),
        impactLevel: match[3].trim(),
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
  const lines = actionText.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    const match = line.match(/Action (\d+): (.+)/);
    if (match) {
      actions.push({
        id: parseInt(match[1]),
        description: match[2].trim(),
        priority: 'medium' // Default priority
      });
    }
  }
  
  return actions;
}

function parseQuickWins(quickWinText) {
  if (!quickWinText) return [];
  
  const quickWins = [];
  const lines = quickWinText.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    const match = line.match(/Quick Win (\d+): (.+?) \| Implementation: (.+?) \| Business Impact: (.+)/);
    if (match) {
      quickWins.push({
        id: parseInt(match[1]),
        title: match[2].trim(),
        implementation: match[3].trim(),
        businessImpact: match[4].trim(),
        effort: 'low' // Quick wins are typically low effort
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
  
  if (technicalMatch) breakdown.technical = parseInt(technicalMatch[1]);
  if (contentMatch) breakdown.content = parseInt(contentMatch[1]);
  if (accessibilityMatch) breakdown.accessibility = parseInt(accessibilityMatch[1]);
  if (performanceMatch) breakdown.performance = parseInt(performanceMatch[1]);
  
  return breakdown;
}

function parseImplementationPhases(implementationText) {
  if (!implementationText) return [];
  
  const phases = [];
  const lines = implementationText.split('\n').filter(line => line.trim());
  
  let currentPhase = null;
  for (const line of lines) {
    const phaseMatch = line.match(/Phase (\d+): (.+)/);
    if (phaseMatch) {
      if (currentPhase) phases.push(currentPhase);
      currentPhase = {
        id: parseInt(phaseMatch[1]),
        name: phaseMatch[2].trim(),
        tasks: []
      };
    } else if (currentPhase && line.trim().startsWith('-')) {
      currentPhase.tasks.push(line.trim().substring(1).trim());
    }
  }
  
  if (currentPhase) phases.push(currentPhase);
  return phases;
}

function parseStrengths(strengthsText) {
  if (!strengthsText) return [];
  
  return strengthsText
    .split('\n')
    .filter(line => line.trim())
    .map(line => line.trim().replace(/^[-•*]\s*/, ''));
}

function parseExpectedOutcomes(outcomesText) {
  if (!outcomesText) return [];
  
  return outcomesText
    .split('\n')
    .filter(line => line.trim())
    .map(line => line.trim().replace(/^[-•*]\s*/, ''));
}

// Fetch data from Airtable with retry logic
async function fetchAirtableData() {
  const maxRetries = 3;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      console.log(`🔄 Fetching data from Airtable (attempt ${retries + 1}/${maxRetries})...`);
      
      const response = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableName)}`,
        {
          headers: {
            'Authorization': `Bearer ${AIRTABLE_CONFIG.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Successfully fetched ${data.records.length} records from Airtable`);
      return data.records;
      
    } catch (error) {
      retries++;
      console.error(`❌ Attempt ${retries} failed:`, error.message);
      
      if (retries === maxRetries) {
        throw new Error(`Failed to fetch data after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, retries) * 1000;
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Process and transform data
function processAirtableData(records) {
  console.log('🔄 Processing Airtable data...');
  
  const processedData = {
    lastUpdated: new Date().toISOString(),
    totalPages: records.length,
    pages: {}
  };
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const record of records) {
    try {
      const fields = record.fields;
      
      // Validate required fields
      if (!fields.url) {
        console.warn(`⚠️  Skipping record ${record.id}: missing URL`);
        errorCount++;
        continue;
      }
      
      
      const processedAnalysis = {
        url: fields.url,
        pageType: fields.pageType || 'unknown',
        overallScore: fields.overallScore || 0,
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
      
      // Use URL as key for fast lookups (deduplicates automatically)
      processedData.pages[fields.url] = processedAnalysis;
      successCount++;
      
    } catch (error) {
      console.error(`❌ Error processing record ${record.id}:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`✅ Processing complete: ${successCount} successful, ${errorCount} errors`);
  return processedData;
}

// Convert URL to filename format (replace / with _ after domain)
function urlToFilename(url) {
  // Remove protocol and www if present
  let cleanUrl = url.replace(/^https?:\/\/(www\.)?/, '');
  
  // For pushpay.com URLs, replace / with _ after the domain
  if (cleanUrl.startsWith('pushpay.com')) {
    cleanUrl = cleanUrl.replace(/\//g, '_');
  }
  
  return cleanUrl + '.json';
}

// Generate and save JSON files (both master file and individual files)
function saveJSONFiles(data) {
  const outputDir = path.join(__dirname, '..', 'src', 'data');
  const enrichedDir = path.join(outputDir, 'Enriched URL Data');
  const masterOutputPath = path.join(outputDir, 'aiAnalysisData.json');
  
  try {
    // Ensure directories exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    if (!fs.existsSync(enrichedDir)) {
      fs.mkdirSync(enrichedDir, { recursive: true });
    }
    
    // Save master file
    fs.writeFileSync(masterOutputPath, JSON.stringify(data, null, 2), 'utf8');
    
    // Save individual files for each URL
    let individualFilesCount = 0;
    for (const [url, pageData] of Object.entries(data.pages)) {
      const filename = urlToFilename(url);
      const individualPath = path.join(enrichedDir, filename);
      
      // Add some metadata to individual files
      const individualData = {
        ...pageData,
        lastUpdated: data.lastUpdated,
        filename: filename
      };
      
      fs.writeFileSync(individualPath, JSON.stringify(individualData, null, 2), 'utf8');
      individualFilesCount++;
    }
    
    // Calculate file sizes
    const masterStats = fs.statSync(masterOutputPath);
    const masterFileSizeKB = Math.round(masterStats.size / 1024);
    
    console.log(`✅ Master data saved to ${masterOutputPath}`);
    console.log(`📊 Master file size: ${masterFileSizeKB} KB`);
    console.log(`✅ Individual files saved: ${individualFilesCount} files in ${enrichedDir}`);
    
    return { masterOutputPath, enrichedDir, individualFilesCount };
  } catch (error) {
    throw new Error(`Failed to save JSON files: ${error.message}`);
  }
}

// Validate data integrity
function validateData(data) {
  console.log('🔍 Validating data integrity...');
  
  const validation = {
    totalPages: data.totalPages,
    pagesWithData: Object.keys(data.pages).length,
    missingScores: 0,
    invalidDates: 0,
    emptyUrls: 0
  };
  
  for (const [url, page] of Object.entries(data.pages)) {
    if (!page.overallScore || page.overallScore < 0 || page.overallScore > 100) {
      validation.missingScores++;
    }
    
    if (!page.auditDate || isNaN(new Date(page.auditDate).getTime())) {
      validation.invalidDates++;
    }
    
    if (!url || url.trim() === '') {
      validation.emptyUrls++;
    }
  }
  
  console.log('📊 Validation Results:', validation);
  
  const hasErrors = validation.missingScores > 0 || validation.invalidDates > 0 || validation.emptyUrls > 0;
  if (hasErrors) {
    console.warn('⚠️  Data validation found issues. Please review the data.');
  } else {
    console.log('✅ Data validation passed');
  }
  
  return validation;
}

// Main execution function
async function main() {
  try {
    console.log('🚀 Starting Airtable sync process...');
    
    // Fetch data from Airtable
    const records = await fetchAirtableData();
    
    if (!records || records.length === 0) {
      console.warn('⚠️  No records found in Airtable');
      return;
    }
    
    // Process the data
    const processedData = processAirtableData(records);
    
    // Validate data integrity
    validateData(processedData);
    
    // Save to JSON files
    const result = saveJSONFiles(processedData);
    
    console.log('🎉 Sync completed successfully!');
    console.log(`📈 Total pages processed: ${processedData.totalPages}`);
    console.log(`💾 Master file: ${result.masterOutputPath}`);
    console.log(`📁 Individual files: ${result.individualFilesCount} files in ${result.enrichedDir}`);
    
  } catch (error) {
    console.error('💥 Sync failed:', error.message);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url.includes('sync-airtable-data.js') && process.argv[1].includes('sync-airtable-data.js')) {
  main();
}

export { main, fetchAirtableData, processAirtableData, validateData };