Product Requirements Document (PRD)

  Detailed AI Analysis Integration for Page-Level Insights

  ---
  📋 Executive Summary

  Integrate real-time AI analysis data from Airtable into the existing
  Page-Level Insights dashboard by adding a "Detailed Analysis" feature
  that provides comprehensive, per-URL audit information through an
  expandable interface.

  ---
  🎯 Objectives

  Primary Goal

  Add a "Detailed Analysis" button to each URL row in the Page-Level
  Insights table that reveals comprehensive AI-generated audit data without
   impacting initial page load performance.

  Success Metrics

  - Lazy loading prevents performance degradation
  - Users can access detailed analysis for any of 110+ URLs
  - Data stays synchronized with Airtable updates
  - Seamless integration with existing UI/UX patterns

  ---
  🏗️ Technical Architecture

  Data Flow

  Airtable (110 URLs) → Sync Script → JSON File → Dashboard Component →
  User Interface

  Components Required

  1. Airtable Sync Script (scripts/sync-airtable-data.js)
  2. JSON Data Storage (src/data/aiAnalysisData.json)
  3. Enhanced Page-Level Insights Component
  4. Detailed Analysis Card Component
  5. Environment Configuration

  ---
  📊 Data Structure

  Airtable Schema (Input)

  interface AirtableRecord {
    id: string;
    createdTime: string;
    fields: {
      url: string;
      pageType: string;
      overallScore: number;
      auditDate: string;
      performanceSummary: string;
      scoreBreakdown: string;
      currentStrengths: string;
      optimizationOpportunities: string;
      recommendedActions: string;
      quickWins: string;
      executiveSummary: string;
      implementationApproach: string;
      siteWideContext: string;
      expectedOutcomes: string;
      professionalAssessment: string;
      pagePriority: string;
      projectTags: string;
      issueCount: number;
      quickWinCount: number;
      avgEffortScore: string;
      avgImpactScore: string;
    };
  }

  JSON Output Structure

  interface AIAnalysisData {
    lastUpdated: string;
    totalPages: number;
    pages: {
      [url: string]: ProcessedAnalysis;
    };
  }

  interface ProcessedAnalysis {
    url: string;
    pageType: string;
    overallScore: number;
    auditDate: string;
    summary: {
      performance: string;
      scoreBreakdown: ScoreBreakdown;
      strengths: string[];
      quickWinCount: number;
      issueCount: number;
    };
    opportunities: Opportunity[];
    actions: Action[];
    quickWins: QuickWin[];
    implementation: {
      phases: Phase[];
      siteWideContext: string;
      expectedOutcomes: string[];
    };
    metadata: {
      priority: string;
      tags: string[];
      effort: number;
      impact: number;
    };
  }

  ---
  🔧 Implementation Requirements

  1. Environment Configuration

  Create .env file with:
  AIRTABLE_PERSONAL_ACCESS_TOKEN=your_token_here
  AIRTABLE_BASE_ID=your_base_id_here
  AIRTABLE_TABLE_NAME=your_table_name_here

  2. Airtable Sync Script Specifications

  File: scripts/sync-airtable-data.js

  Functionality:
  - Fetch all records from specified Airtable base/table
  - Parse opportunity text (format: "Opportunity N: Title | Impact Level: X
   | Implementation Complexity: Y")
  - Parse action text (format: "Action N: Description")
  - Parse quick wins (format: "Quick Win N: Title | Implementation: X |
  Business Impact: Y")
  - Parse score breakdown (format: "Technical: X/100 | Content: Y/100 |
  Accessibility: Z/100 | Performance: W/100")
  - Generate optimized JSON structure for fast lookups
  - Include error handling and retry logic
  - Log sync status and statistics

  Command: npm run sync-airtable or node scripts/sync-airtable-data.js

  3. UI Component Integration

  Enhanced PageLevelInsights.jsx:
  - Add "Detailed Analysis" button to each table row
  - Implement lazy loading state management
  - Handle loading/error states
  - Maintain existing functionality

  New DetailedAnalysisCard.jsx:
  - Expandable card interface
  - Organized sections: Summary, Opportunities, Quick Wins, Implementation
  - Score visualizations
  - Priority indicators
  - Tag display
  - Print/export functionality

  4. Data Processing Requirements

  Text Parsing Functions:
  // Parse opportunities from concatenated string
  parseOpportunities(opportunityText) -> Opportunity[]

  // Parse actions from concatenated string  
  parseActions(actionText) -> Action[]

  // Parse quick wins from concatenated string
  parseQuickWins(quickWinText) -> QuickWin[]

  // Parse score breakdown
  parseScoreBreakdown(scoreText) -> ScoreBreakdown

  // Parse implementation phases
  parseImplementationPhases(phaseText) -> Phase[]

  ---
  🎨 User Experience Specifications

  Visual Design

  - Button Style: Secondary button with analytics icon
  - Card Style: Matches existing dashboard design system
  - Animation: Smooth expand/collapse with GSAP
  - Colors: Use existing color palette for consistency
  - Typography: Follow current font hierarchy

  Interaction Flow

  1. User clicks "Detailed Analysis" button in table row
  2. Loading spinner appears in button
  3. Analysis card smoothly expands below the row
  4. Content loads in sections with stagger animation
  5. User can collapse by clicking button again or clicking elsewhere

  Content Organization

  📊 Executive Summary
  ├── Overall Score (66/100)
  ├── Page Type & Priority
  ├── Last Audit Date
  └── Quick Stats (Issues, Quick Wins)

  🎯 Current Strengths
  ├── Bulleted list of strengths
  └── Confidence indicators

  ⚡ Quick Wins (High Impact, Low Effort)
  ├── Win 1: Title | Effort | Impact
  ├── Win 2: Title | Effort | Impact
  └── Win 3: Title | Effort | Impact

  🔧 Optimization Opportunities
  ├── Opportunity 1
  │   ├── Impact Level
  │   ├── Complexity
  │   └── Recommended Action
  └── [Additional opportunities...]

  📋 Implementation Roadmap
  ├── Phase 1: Quick Wins
  ├── Phase 2: Core Improvements
  ├── Phase 3: Strategic Enhancements
  └── Expected Outcomes

  🏷️ Metadata
  ├── Priority Level
  ├── Project Tags
  └── Effort/Impact Scores

  ---
  📁 File Structure

  src/
  ├── components/OnPage/
  │   ├── PageLevelInsights.jsx (enhanced)
  │   └── DetailedAnalysisCard.jsx (new)
  ├── data/
  │   └── aiAnalysisData.json (generated)
  └── utils/
      └── analysisHelpers.js (new)

  scripts/
  ├── sync-airtable-data.js (new)
  └── package.json (updated with new script)

  .env (new)

  ---
  ⚙️ Technical Specifications

  Performance Requirements

  - Initial page load time: No impact (lazy loading)
  - Analysis card load time: <500ms
  - JSON file size: <2MB (optimized structure)
  - Memory usage: Minimal (load only requested analysis)

  Error Handling

  - Network failures during Airtable sync
  - Missing or malformed data graceful degradation
  - Fallback to "Analysis not available" state
  - Retry mechanisms for failed requests

  Data Validation

  - URL matching between existing data and AI analysis
  - Required field validation
  - Score range validation (0-100)
  - Date format validation

  ---
  🚀 Implementation Phases

  Phase 1: Core Infrastructure (2-3 hours)

  1. Create Airtable sync script
  2. Implement data parsing functions
  3. Generate initial JSON file
  4. Test data integrity

  Phase 2: UI Integration (2-3 hours)

  1. Add Detailed Analysis button to table
  2. Implement loading states
  3. Create basic analysis card
  4. Test lazy loading functionality

  Phase 3: Enhanced UX (1-2 hours)

  1. Add animations and transitions
  2. Implement content organization
  3. Add score visualizations
  4. Polish styling and responsive design

  Phase 4: Testing & Optimization (1 hour)

  1. Test with all 110 URLs
  2. Performance optimization
  3. Error handling validation
  4. Cross-browser testing

  ---
  📋 Acceptance Criteria

  Must Have

  - Airtable sync script successfully fetches all 110 records
  - JSON file generates with proper structure and parsing
  - Detailed Analysis button appears in each table row
  - Clicking button reveals comprehensive analysis data
  - Lazy loading prevents initial performance impact
  - Data matches Airtable source accuracy
  - Error states handle missing/malformed data gracefully

  Should Have

  - Smooth animations for expand/collapse
  - Organized content sections with clear hierarchy
  - Score visualizations (progress bars/badges)
  - Responsive design for mobile devices
  - Print/export functionality for analysis reports

  Could Have

  - Search/filter within detailed analysis
  - Comparison between multiple page analyses
  - Historical trend tracking
  - Automated sync scheduling

  ---
  🔍 Testing Strategy

  Unit Tests

  - Data parsing functions
  - URL matching logic
  - Score validation
  - Error handling

  Integration Tests

  - Airtable API connection
  - JSON file generation
  - Component data loading
  - UI state management

  User Acceptance Tests

  - Click detailed analysis on various URLs
  - Verify data accuracy against Airtable
  - Test loading performance with large dataset
  - Validate responsive behavior

  ---
  📚 Documentation Requirements

  Developer Documentation

  - Airtable setup and configuration guide
  - Sync script usage and scheduling
  - Component API documentation
  - Troubleshooting common issues

  User Documentation

  - Feature overview and benefits
  - How to interpret analysis scores
  - Understanding recommendations
  - Using quick wins for prioritization

  ---
  🎯 Success Definition

  The implementation is successful when:
  1. Users can access detailed AI analysis for any URL without performance
  degradation
  2. Data stays synchronized with live Airtable updates
  3. Analysis provides actionable insights in an intuitive format
  4. Integration feels native to existing dashboard experience
  5. System handles edge cases and errors gracefully

  ---
  Ready for implementation! This PRD provides the complete foundation for 
  integrating your AI analysis data into the Page-Level Insights dashboard.
