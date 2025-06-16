import React, { useRef, useEffect, useState } from 'react';
import { 
  formatAnalysisDate, 
  getAnalysisFreshness, 
  getPriorityBadgeClass, 
  getImpactEffortBadgeClass,
  sortOpportunities,
  sortQuickWins 
} from '../../utils/analysisHelpers';
import gsap from 'gsap';

const DetailedAnalysisCard = ({ analysis, onClose }) => {
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const [expandedPhases, setExpandedPhases] = useState({});

  useEffect(() => {
    // Animate card entrance
    gsap.fromTo(cardRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
    );

    // Animate content sections with stagger
    gsap.fromTo(contentRef.current?.children || [], 
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.2, ease: 'power2.out' }
    );
  }, []);

  const freshness = getAnalysisFreshness(analysis.auditDate);
  const sortedOpportunities = sortOpportunities(analysis.opportunities || []);
  const sortedQuickWins = sortQuickWins(analysis.quickWins || []);

  // Organize items into implementation phases
  const implementationPhases = [
    {
      id: 1,
      name: "Quick Wins (High Impact, Low Effort)",
      items: sortedQuickWins,
      type: "quickwins",
      color: "green"
    },
    {
      id: 2,
      name: "Core Improvements (Medium Complexity)",
      items: sortedOpportunities.filter(opp => 
        (opp.complexity?.toLowerCase() === 'moderate' || opp.complexity?.toLowerCase() === 'medium') &&
        (opp.impactLevel?.toLowerCase() === 'high' || opp.impactLevel?.toLowerCase() === 'strong')
      ),
      type: "opportunities",
      color: "blue"
    },
    {
      id: 3,
      name: "Strategic Enhancements (Complex Implementation)",
      items: sortedOpportunities.filter(opp => 
        opp.complexity?.toLowerCase() === 'complex' || opp.complexity?.toLowerCase() === 'high'
      ),
      type: "opportunities",
      color: "purple"
    },
    {
      id: 4,
      name: "Enhancement Opportunities (Lower Priority)",
      items: sortedOpportunities.filter(opp => 
        opp.impactLevel?.toLowerCase() === 'enhancement' || 
        (opp.complexity?.toLowerCase() === 'simple' && opp.impactLevel?.toLowerCase() !== 'high')
      ),
      type: "opportunities",
      color: "orange"
    }
  ].filter(phase => phase.items.length > 0);

  const togglePhase = (phaseId) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  const ScoreBar = ({ label, score, total = 100 }) => (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-20">{label}</span>
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${
            score >= 80 ? 'bg-green-500' : 
            score >= 60 ? 'bg-yellow-500' : 
            score >= 40 ? 'bg-orange-500' : 'bg-red-500'
          }`}
          style={{ width: `${Math.min((score / total) * 100, 100)}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 w-12">{score}/{total}</span>
    </div>
  );

  return (
    <div ref={cardRef} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="p-6" ref={contentRef}>
        
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              📊 Detailed AI Analysis
            </h3>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Last analyzed: {formatAnalysisDate(analysis.auditDate)}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                freshness.status === 'fresh' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                freshness.status === 'recent' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                freshness.status === 'aging' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200' :
                'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
              }`}>
                {freshness.message}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Executive Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-blue-900 dark:text-blue-100">
              📋 Executive Summary
            </h4>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  analysis.overallScore >= 90 ? 'text-green-600' : 
                  analysis.overallScore >= 75 ? 'text-yellow-600' : 
                  analysis.overallScore >= 60 ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {analysis.overallScore}/100
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Overall Score
                  {analysis.originalScore && analysis.originalScore !== analysis.overallScore && (
                    <div className="text-xs text-gray-500 mt-1">
                      (boosted from {analysis.originalScore})
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {analysis.summary?.quickWinCount || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Quick Wins</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {analysis.summary?.issueCount || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Issues</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Page Info</h5>
              <div className="space-y-1 text-sm">
                <div>Type: <span className="font-medium">{analysis.pageType || 'Unknown'}</span></div>
                <div>Priority: 
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${getPriorityBadgeClass(analysis.metadata?.priority || 'medium')}`}>
                    {(analysis.metadata?.priority || 'medium').charAt(0).toUpperCase() + (analysis.metadata?.priority || 'medium').slice(1)}
                  </span>
                </div>
                {analysis.metadata?.tags && analysis.metadata.tags.length > 0 && (
                  <div>Tags: 
                    <div className="flex flex-wrap gap-1 mt-1">
                      {analysis.metadata.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Score Breakdown</h5>
              <div className="space-y-2">
                {analysis.summary?.scoreBreakdown && (
                  <>
                    <ScoreBar label="Technical" score={analysis.summary.scoreBreakdown.technical || 0} />
                    <ScoreBar label="Content" score={analysis.summary.scoreBreakdown.content || 0} />
                    <ScoreBar label="Access" score={analysis.summary.scoreBreakdown.accessibility || 0} />
                    <ScoreBar label="Perf" score={analysis.summary.scoreBreakdown.performance || 0} />
                  </>
                )}
              </div>
            </div>
          </div>

          {analysis.summary?.performance && (
            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.summary.performance}</p>
            </div>
          )}
        </div>

        {/* Current Strengths */}
        {analysis.summary?.strengths && analysis.summary.strengths.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              🎯 Current Strengths
            </h4>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <ul className="space-y-2">
                {analysis.summary.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Quick Wins */}
        {sortedQuickWins.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              ⚡ Quick Wins (High Impact, Low Effort)
            </h4>
            <div className="grid gap-3">
              {sortedQuickWins.map((win, idx) => (
                <div key={idx} className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 dark:text-gray-100">{win.title}</h5>
                      {win.implementation && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Implementation: {win.implementation}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactEffortBadgeClass(
                        win.businessImpact === 'high' ? 8 : win.businessImpact === 'medium' ? 6 : 4
                      )}`}>
                        {win.businessImpact || 'medium'} impact
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optimization Opportunities */}
        {sortedOpportunities.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              🔧 Optimization Opportunities
            </h4>
            <div className="grid gap-3">
              {sortedOpportunities.map((opp, idx) => (
                <div key={idx} className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 dark:text-gray-100">{opp.title}</h5>
                      {opp.description && opp.description !== opp.title && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{opp.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactEffortBadgeClass(
                        opp.impactLevel === 'high' ? 8 : opp.impactLevel === 'medium' ? 6 : 4
                      )}`}>
                        {opp.impactLevel || 'medium'} impact
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        opp.complexity === 'low' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                        opp.complexity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                        'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      }`}>
                        {opp.complexity || 'medium'} effort
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Implementation Roadmap */}
        {implementationPhases.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              📋 Implementation Roadmap
            </h4>
            <div className="space-y-3">
              {implementationPhases.map((phase) => {
                const colorClasses = {
                  green: {
                    bg: 'bg-green-50 dark:bg-green-900/20',
                    border: 'border-green-200 dark:border-green-800',
                    hover: 'hover:bg-green-100 dark:hover:bg-green-800/30',
                    title: 'text-green-900 dark:text-green-100',
                    subtitle: 'text-green-700 dark:text-green-300',
                    icon: 'text-green-600 dark:text-green-400'
                  },
                  blue: {
                    bg: 'bg-blue-50 dark:bg-blue-900/20',
                    border: 'border-blue-200 dark:border-blue-800',
                    hover: 'hover:bg-blue-100 dark:hover:bg-blue-800/30',
                    title: 'text-blue-900 dark:text-blue-100',
                    subtitle: 'text-blue-700 dark:text-blue-300',
                    icon: 'text-blue-600 dark:text-blue-400'
                  },
                  purple: {
                    bg: 'bg-purple-50 dark:bg-purple-900/20',
                    border: 'border-purple-200 dark:border-purple-800',
                    hover: 'hover:bg-purple-100 dark:hover:bg-purple-800/30',
                    title: 'text-purple-900 dark:text-purple-100',
                    subtitle: 'text-purple-700 dark:text-purple-300',
                    icon: 'text-purple-600 dark:text-purple-400'
                  },
                  orange: {
                    bg: 'bg-orange-50 dark:bg-orange-900/20',
                    border: 'border-orange-200 dark:border-orange-800',
                    hover: 'hover:bg-orange-100 dark:hover:bg-orange-800/30',
                    title: 'text-orange-900 dark:text-orange-100',
                    subtitle: 'text-orange-700 dark:text-orange-300',
                    icon: 'text-orange-600 dark:text-orange-400'
                  }
                };
                const colors = colorClasses[phase.color] || colorClasses.blue;
                
                return (
                <div key={phase.id} className={`${colors.bg} rounded-lg border ${colors.border}`}>
                  <button
                    onClick={() => togglePhase(phase.id)}
                    className={`w-full p-4 text-left flex items-center justify-between ${colors.hover} transition-colors rounded-lg`}
                  >
                    <div>
                      <h5 className={`font-medium ${colors.title}`}>
                        Phase {phase.id}: {phase.name}
                      </h5>
                      <p className={`text-sm ${colors.subtitle} mt-1`}>
                        {phase.items.length} {phase.type === 'quickwins' ? 'quick wins' : 'opportunities'} identified
                      </p>
                    </div>
                    <svg 
                      className={`w-5 h-5 ${colors.icon} transform transition-transform ${
                        expandedPhases[phase.id] ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedPhases[phase.id] && (
                    <div className="px-4 pb-4">
                      <div className="space-y-3">
                        {phase.items.map((item, idx) => (
                          <div key={idx} className="bg-white dark:bg-gray-800 rounded p-3 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h6 className="font-medium text-gray-900 dark:text-gray-100">
                                  {item.title}
                                </h6>
                                {phase.type === 'quickwins' && item.implementation && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Implementation: {item.implementation}
                                  </p>
                                )}
                                {phase.type === 'opportunities' && item.description && item.description !== item.title && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex space-x-2 ml-3">
                                {phase.type === 'quickwins' ? (
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactEffortBadgeClass(
                                    item.businessImpact === 'high' ? 8 : item.businessImpact === 'medium' ? 6 : 4
                                  )}`}>
                                    {item.businessImpact || 'medium'} impact
                                  </span>
                                ) : (
                                  <>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactEffortBadgeClass(
                                      item.impactLevel === 'high' ? 8 : item.impactLevel === 'medium' ? 6 : 4
                                    )}`}>
                                      {item.impactLevel || 'medium'} impact
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      item.complexity === 'low' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                                      item.complexity === 'medium' || item.complexity === 'moderate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                                      'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                                    }`}>
                                      {item.complexity || 'medium'} effort
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>

            {analysis.implementation?.expectedOutcomes && analysis.implementation.expectedOutcomes.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Expected Outcomes</h5>
                <ul className="space-y-1">
                  {analysis.implementation.expectedOutcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">→</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Professional Assessment */}
        {analysis.professionalAssessment && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              🎯 Professional Assessment
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{analysis.professionalAssessment}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default DetailedAnalysisCard;