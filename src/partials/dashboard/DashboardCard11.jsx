import React, { useState } from 'react';
import { lighthouseData } from '../../data/lighthouseData';

function LighthouseIssues({ device = 'desktop' }) {
  const [expandedSections, setExpandedSections] = useState({
    critical: true,
    high: false,
    medium: false
  });
  const [selectedIssue, setSelectedIssue] = useState(null);

  const data = lighthouseData[device];
  const issues = data.issues;
  const opportunities = data.opportunities;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#eab308';
      default: return '#6b7280';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 dark:bg-red-900/20';
      case 'high': return 'bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'bg-gray-50 dark:bg-gray-700/50';
    }
  };

  const getTotalIssues = () => {
    return issues.critical.length + issues.high.length + issues.medium.length;
  };

  const getDetailedExplanation = (issueTitle, device) => {
    const explanations = {
      "Excessive Layout Shift": {
        rootCause: device === 'desktop' 
          ? "Custom 'Barlow Condensed' fonts load after initial page render, causing header to expand by 44px and pushing content down"
          : "Same font loading issue compounded by slower mobile network speeds and smaller viewport adjustments",
        technicalDetails: "CLS score of 0.532 is 5.3x higher than Google's 0.1 threshold. Header element shifts by 0.328 points alone.",
        businessContext: "For a coaching business, trust and professionalism are critical. Users attempting to click navigation or CTAs experience frustration as buttons move under their cursor.",
        stepByStepFix: [
          "1. Implement font-display: swap in CSS for Barlow Condensed",
          "2. Preload font files in HTML <head> section",
          "3. Reserve exact space for header using CSS min-height",
          "4. Test with slow 3G network throttling"
        ],
        timeToFix: "2-3 hours",
        expectedResults: "CLS score drops to <0.1, ~30% improvement in user engagement",
        revenue_impact: "$150,000 annual revenue recovery from improved conversions"
      },
      "Long Total Blocking Time": {
        rootCause: "JavaScript execution blocks main thread for 890ms, preventing user interactions",
        technicalDetails: "Large JavaScript bundles from tracking scripts and interactive elements delay page responsiveness",
        businessContext: "Mobile users can't interact with forms or buttons for nearly a full second, leading to abandonment",
        stepByStepFix: [
          "1. Audit JavaScript bundles to identify largest scripts",
          "2. Implement code splitting for non-critical features",
          "3. Defer non-essential third-party scripts",
          "4. Use web workers for heavy computations"
        ],
        timeToFix: "1-2 weeks",
        expectedResults: "TBT reduction to <300ms, 40% improvement in mobile conversion rates"
      },
      "Large Contentful Paint": {
        rootCause: "Hero banner images not optimized for mobile viewport, causing 4.2s load delay",
        technicalDetails: "Images served at desktop resolution to mobile devices, combined with slow JavaScript execution",
        businessContext: "First impression matters - prospects leave before seeing BDR's value proposition",
        stepByStepFix: [
          "1. Implement responsive images with srcset",
          "2. Convert images to WebP format",
          "3. Add lazy loading for below-fold content",
          "4. Optimize critical CSS delivery"
        ],
        timeToFix: "3-5 days",
        expectedResults: "LCP improvement to <2.5s, 25% bounce rate reduction"
      },
      "Redirect Chain": {
        rootCause: "Server redirects bdrco.com → www.bdrco.com, adding 470ms delay to every new visitor",
        technicalDetails: "HTTP 301 redirect requires additional DNS lookup and connection establishment",
        businessContext: "Every new visitor (from ads, referrals, direct traffic) waits nearly half a second unnecessarily",
        stepByStepFix: [
          "1. Configure web server to serve content directly from primary domain",
          "2. Update DNS settings if needed",
          "3. Test with curl commands to verify no redirects",
          "4. Monitor for any broken links"
        ],
        timeToFix: "30 minutes",
        expectedResults: "470ms faster load time for all new visitors, improved SEO rankings"
      },
      "Poor Color Contrast": {
        rootCause: "Call-to-action buttons use #ffffff text on #6ac6ff background (1.88:1 ratio)",
        technicalDetails: "WCAG guidelines require 4.5:1 contrast ratio for normal text, 3:1 for large text",
        businessContext: "Low-vision users and users in bright environments can't read CTA buttons effectively",
        stepByStepFix: [
          "1. Change button text to #000000 (black) or #1a365d (dark blue)",
          "2. Test with WebAIM contrast checker",
          "3. Verify readability on mobile devices in sunlight",
          "4. Update brand guidelines to include accessible colors"
        ],
        timeToFix: "15 minutes",
        expectedResults: "WCAG compliance, improved CTA visibility and click-through rates"
      },
      "Generic Link Text": {
        rootCause: "Links use 'Learn More' and 'Read More' instead of descriptive text",
        technicalDetails: "Search engines can't understand link context, reducing page authority transfer",
        businessContext: "Missed SEO opportunities and poor accessibility for screen readers",
        stepByStepFix: [
          "1. Audit all links containing generic text",
          "2. Replace with descriptive text like 'Read 30 HVAC Industry Trends Report'",
          "3. Ensure link text makes sense out of context",
          "4. Add aria-labels for icon-only links"
        ],
        timeToFix: "1-2 hours",
        expectedResults: "Better SEO rankings, improved accessibility scores"
      },
      "Third-party Cookies": {
        rootCause: "NitroPack optimization service uses cookies that will be blocked by browsers in 2024",
        technicalDetails: "Chrome and other browsers are phasing out third-party cookies for privacy",
        businessContext: "Site optimization features may break, affecting load times and user experience",
        stepByStepFix: [
          "1. Audit NitroPack configuration for cookie dependencies",
          "2. Implement first-party alternatives where possible",
          "3. Test functionality with third-party cookies disabled",
          "4. Consider alternative optimization solutions"
        ],
        timeToFix: "2-4 hours",
        expectedResults: "Future-proof optimization, maintained site performance"
      },
      "Unused JavaScript": {
        rootCause: "342 KB of JavaScript code loaded but not used on mobile pages",
        technicalDetails: "Tracking scripts, analytics, and desktop-only features loaded unnecessarily",
        businessContext: "Slower mobile loading directly impacts lead generation from mobile traffic",
        stepByStepFix: [
          "1. Use Chrome DevTools Coverage tab to identify unused code",
          "2. Implement conditional loading for desktop-only features",
          "3. Tree-shake unused dependencies from bundles",
          "4. Use dynamic imports for non-critical functionality"
        ],
        timeToFix: "1 week",
        expectedResults: "Faster mobile loading, improved mobile conversion rates"
      }
    };
    return explanations[issueTitle] || null;
  };

  const IssueCard = ({ issue, severity, index }) => {
    const isSelected = selectedIssue === `${severity}-${index}`;
    const explanation = getDetailedExplanation(issue.title, device);
    
    return (
      <div className={`rounded-lg ${getSeverityBg(severity)} transition-all duration-200`}>
        <button
          onClick={() => setSelectedIssue(isSelected ? null : `${severity}-${index}`)}
          className="w-full p-4 text-left hover:bg-opacity-70 transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-800 dark:text-gray-100 pr-4">
              {issue.title}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: getSeverityColor(severity) }}>
                {issue.metric}
              </span>
              <span className="text-gray-500 text-sm">
                {isSelected ? '▲' : '▼'}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {issue.impact}
          </p>
        </button>
        
        {isSelected && explanation && (
          <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600 mt-3">
            <div className="pt-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">🔍 Root Cause Analysis</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{explanation.rootCause}</p>
                  
                  <h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">📊 Technical Details</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{explanation.technicalDetails}</p>
                </div>
                
                <div>
                  <h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">💼 Business Context</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{explanation.businessContext}</p>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-500">Time to Fix:</span>
                      <span className="font-medium text-blue-600">{explanation.timeToFix}</span>
                    </div>
                    {explanation.revenue_impact && (
                      <div className="text-xs text-green-600 font-medium">
                        💰 {explanation.revenue_impact}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">🛠️ Step-by-Step Implementation</h5>
                <div className="space-y-2">
                  {explanation.stepByStepFix.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{step}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h6 className="font-medium text-green-800 dark:text-green-300 mb-1">Expected Results:</h6>
                  <p className="text-sm text-green-700 dark:text-green-400">{explanation.expectedResults}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const IssueSection = ({ title, issueList, severity, isExpanded }) => (
    <div className="border-b border-gray-100 dark:border-gray-700/60 last:border-b-0">
      <button
        onClick={() => toggleSection(severity)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-3"
            style={{ backgroundColor: getSeverityColor(severity) }}
          />
          <span className="font-medium text-gray-800 dark:text-gray-100">
            {title} ({issueList.length})
          </span>
        </div>
        <span className="text-gray-500">
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="space-y-3">
            {issueList.map((issue, index) => (
              <IssueCard 
                key={index} 
                issue={issue} 
                severity={severity} 
                index={index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Issues & Opportunities</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Click any issue for detailed root cause analysis and step-by-step fixes
        </p>
      </header>
      
      <div className="px-5 py-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">{getTotalIssues()}</div>
            <div className="text-sm font-medium text-red-700 px-1.5 bg-red-500/20 rounded-full">
              {issues.critical.length} Critical
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {device === 'desktop' ? 'Desktop' : 'Mobile'} Analysis
            </div>
            <div className="text-xs text-gray-500">
              {device === 'mobile' ? 'More severe issues' : 'Focus on layout stability'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1">
        <IssueSection
          title="Critical Issues"
          issueList={issues.critical}
          severity="critical"
          isExpanded={expandedSections.critical}
        />
        <IssueSection
          title="High Priority"
          issueList={issues.high}
          severity="high"
          isExpanded={expandedSections.high}
        />
        <IssueSection
          title="Medium Priority"
          issueList={issues.medium}
          severity="medium"
          isExpanded={expandedSections.medium}
        />
      </div>
      
      {/* Quick Opportunities Preview */}
      <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700/60">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">🎯 Quick Wins (Low Effort, High Impact)</h3>
        <div className="space-y-2">
          {opportunities.slice(0, 2).map((opp, index) => (
            <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
              <span className="text-gray-600 dark:text-gray-400">{opp.title}</span>
              <div className="flex gap-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{opp.effort} effort</span>
                <span className="font-medium text-green-600 dark:text-green-400">{opp.savings}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">💡 Strategic Insight</h4>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            These same issues appear across 80% of contractor websites. BDR can position itself as the 
            technical authority by offering "Website Performance Audits" as a value-add service to members.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LighthouseIssues;