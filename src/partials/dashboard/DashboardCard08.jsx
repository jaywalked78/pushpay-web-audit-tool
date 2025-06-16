import React, { useState } from 'react';
import { lighthouseData } from '../../data/lighthouseData';

function LighthouseScores({ device = 'desktop' }) {
  const [selectedScore, setSelectedScore] = useState(null);
  const data = lighthouseData[device];
  const scores = data.scores;

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981'; // Green
    if (score >= 50) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Good';
    if (score >= 50) return 'Needs Improvement';
    return 'Needs Improvement';
  };

  const getScoreDetails = (category, score, device) => {
    const details = {
      performance: {
        title: 'Performance',
        description: device === 'desktop' 
          ? 'Strong server infrastructure (57ms TTFB) and fast content loading (1.1s LCP), but severely compromised by layout shifts.'
          : 'Mobile performance needs improvement with slow loading times and high blocking time. Critical for user experience.',
        impact: device === 'desktop'
          ? 'The 0.532 CLS score is causing users to miss clicks on navigation and CTAs, directly impacting conversions.'
          : 'Mobile users face 4.2s load times and 890ms blocking time, leading to 53% higher bounce rates on mobile.',
        fix: device === 'desktop'
          ? 'Preload fonts and reserve space for header elements to eliminate layout shifts.'
          : 'Implement code splitting, optimize images, and reduce JavaScript execution time.',
        effort: 'Medium',
        impact_level: 'Critical'
      },
      accessibility: {
        title: 'Accessibility',
        description: 'Good baseline with proper document structure, but critical contrast and navigation issues.',
        impact: 'Low contrast buttons (1.88:1 ratio) fail WCAG standards, making CTAs less effective for all users.',
        fix: 'Update button colors to meet 4.5:1 contrast ratio and add missing link labels.',
        effort: 'Low',
        impact_level: 'High'
      },
      bestPractices: {
        title: 'Best Practices',
        description: 'Modern codebase with HTTPS, but third-party cookie dependencies pose future risks.',
        impact: 'Third-party cookies will break in upcoming browser updates, potentially affecting site functionality.',
        fix: 'Audit and replace deprecated cookie usage, address console errors from NitroPack service.',
        effort: 'Medium',
        impact_level: 'Medium'
      },
      seo: {
        title: 'SEO',
        description: 'Excellent technical SEO foundation with proper crawlability and meta tags.',
        impact: 'Generic link text ("Learn More" x6) misses keyword opportunities and reduces page authority.',
        fix: 'Replace generic links with descriptive text like "Read 30 Home Service Industry Trends".',
        effort: 'Low',
        impact_level: 'Medium'
      }
    };
    return details[category];
  };

  const ScoreGauge = ({ title, score, category }) => {
    const isSelected = selectedScore === category;
    const details = getScoreDetails(category, score, device);
    
    return (
      <div className="flex flex-col items-center">
        <div 
          className={`relative w-24 h-24 mb-3 cursor-pointer transition-transform hover:scale-105 ${
            isSelected ? 'ring-4 ring-violet-500 rounded-full' : ''
          }`}
          onClick={() => setSelectedScore(isSelected ? null : category)}
        >
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              stroke={getScoreColor(score)}
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - score / 100)}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{score}</span>
          </div>
        </div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 text-center mb-1">{title}</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">{getScoreLabel(score)}</span>
        {details.impact_level === 'Critical' && (
          <span className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">Critical Issue</span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Lighthouse Scores</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Click any score for detailed analysis and business impact
        </p>
      </header>
      
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
          <ScoreGauge 
            title="Performance" 
            score={scores.performance} 
            category="performance"
          />
          <ScoreGauge 
            title="Accessibility" 
            score={scores.accessibility} 
            category="accessibility"
          />
          <ScoreGauge 
            title="Best Practices" 
            score={scores.bestPractices} 
            category="bestPractices"
          />
          <ScoreGauge 
            title="SEO" 
            score={scores.seo} 
            category="seo"
          />
        </div>

        {/* Detailed Analysis Panel */}
        {selectedScore && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mt-4">
            {(() => {
              const details = getScoreDetails(selectedScore, scores[selectedScore], device);
              return (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {details.title} Analysis
                    </h3>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        details.impact_level === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                        details.impact_level === 'High' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                      }`}>
                        {details.impact_level} Impact
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                        {details.effort} Effort
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">Analysis</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{details.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">Business Impact</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{details.impact}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">Recommended Fix</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{details.fix}</p>
                    </div>
                  </div>

                  {selectedScore === 'performance' && device === 'desktop' && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">🚨 Critical Issue: Layout Shift</h4>
                      <p className="text-sm text-red-700 dark:text-red-400">
                        The 0.532 CLS score is 5x higher than Google's threshold. Users trying to click "DISCOVER MORE" 
                        or navigation items will miss their target, creating frustration and lost conversions.
                      </p>
                      <div className="mt-3 flex gap-2">
                        <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">Immediate Action Required</span>
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">~30% Conversion Improvement Expected</span>
                      </div>
                    </div>
                  )}

                  {selectedScore === 'performance' && device === 'mobile' && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">📱 Mobile Performance Crisis</h4>
                      <p className="text-sm text-red-700 dark:text-red-400">
                        4.2s load time and 890ms blocking time create a severely poor mobile experience. 
                        With 60%+ of traffic on mobile, this is directly impacting lead generation.
                      </p>
                      <div className="mt-3 flex gap-2">
                        <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">High Priority Fix</span>
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">+$45k Annual Revenue Impact</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Executive Summary */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
            💡 Strategic Opportunity
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            This audit methodology can be packaged as "BDR Website Health Check" - a value-add service for your contractor clients. 
            Help them drive profit and growth through data-driven website optimization.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LighthouseScores;