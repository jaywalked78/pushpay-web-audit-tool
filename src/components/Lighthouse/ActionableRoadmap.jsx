import React, { useState } from 'react';

function ActionableRoadmap({ device = 'desktop' }) {
  const [selectedPhase, setSelectedPhase] = useState(null);

  const getRoadmapData = (device) => {
    const baseRoadmap = {
      title: `${device === 'desktop' ? 'Desktop' : 'Mobile'} Performance Optimization Roadmap`,
      subtitle: 'Strategic implementation plan with measurable business outcomes',
      totalTimeframe: '1-2 weeks',
      totalInvestment: device === 'desktop' ? '$3,500 - $5,000' : '$5,500 - $8,000',
      expectedROI: device === 'desktop' ? '$150,000 annual revenue recovery' : '$180,000 annual revenue recovery from mobile optimization'
    };

    const phases = device === 'desktop' ? [
      {
        id: 1,
        title: 'Quick Wins & Foundation',
        duration: '1-2 Days',
        cost: '$800 - $1,200',
        priority: 'Critical',
        description: 'Address immediate accessibility and SEO issues with high impact, low effort fixes',
        tasks: [
          {
            task: 'Fix Color Contrast Issues',
            effort: '2 hours',
            impact: 'WCAG compliance + improved CTA visibility',
            technical: 'Update button CSS from #ffffff on #6ac6ff to meet 4.5:1 ratio',
            business: 'Increased click-through rates on call-to-action buttons'
          },
          {
            task: 'Replace Generic Link Text',
            effort: '3 hours', 
            impact: 'Better SEO rankings + accessibility',
            technical: 'Replace "Learn More" with descriptive text like "Read 30 HVAC Industry Trends"',
            business: 'Improved search rankings and screen reader accessibility'
          },
          {
            task: 'Eliminate Server Redirects',
            effort: '30 minutes',
            impact: '470ms faster load time for new visitors',
            technical: 'Configure server to serve www.bdrco.com directly without redirect',
            business: 'Faster first impression for prospects from ads and referrals'
          }
        ],
        businessOutcome: 'Immediate 15-20% improvement in accessibility score and faster loading for new visitors',
        revenue_impact: '$5,000 - $15,000 annual improvement'
      },
      {
        id: 2,
        title: 'Core Performance Fix',
        duration: '1 Week',
        cost: '$3,000 - $4,000',
        priority: 'Critical',
        description: 'Solve the primary layout shift issue that is destroying user experience',
        tasks: [
          {
            task: 'Implement Font Preloading',
            effort: '4 hours',
            impact: 'Eliminate font-related layout shifts',
            technical: 'Add <link rel="preload"> for Barlow Condensed fonts in HTML head',
            business: 'Prevent users from missing navigation clicks'
          },
          {
            task: 'Reserve Header Space',
            effort: '6 hours',
            impact: 'Prevent header expansion layout shift',
            technical: 'Set fixed min-height for header container in CSS',
            business: 'Stable navigation experience, improved trust'
          },
          {
            task: 'Optimize CSS Delivery',
            effort: '8 hours',
            impact: 'Faster style application, reduced layout shifts',
            technical: 'Inline critical CSS, defer non-critical stylesheets',
            business: 'Smoother page loading experience'
          },
          {
            task: 'Test & Validate',
            effort: '4 hours',
            impact: 'Ensure fixes work across devices and connections',
            technical: 'Test with slow 3G throttling and multiple devices',
            business: 'Consistent experience for all user conditions'
          }
        ],
        businessOutcome: 'CLS score drops from 0.532 to <0.1, achieving Google "Good" threshold',
        revenue_impact: '$120,000 - $150,000 annual recovery (30 leads/month × $5,000 avg value)'
      },
      {
        id: 3,
        title: 'Advanced Optimization',
        duration: '2-3 Days',
        cost: '$2,000 - $3,000',
        priority: 'High',
        description: 'Future-proof the site and create optimization framework for ongoing improvements',
        tasks: [
          {
            task: 'Resolve Third-Party Cookie Dependencies',
            effort: '6 hours',
            impact: 'Future-proof optimization tools',
            technical: 'Audit NitroPack configuration, implement first-party alternatives',
            business: 'Prevent future functionality breaks from browser updates'
          },
          {
            task: 'Performance Monitoring Setup',
            effort: '4 hours',
            impact: 'Ongoing performance visibility',
            technical: 'Implement Core Web Vitals monitoring and alerting',
            business: 'Proactive performance management'
          },
          {
            task: 'Create BDR Audit Tool Template',
            effort: '8 hours',
            impact: 'Reusable audit framework for BDR clients',
            technical: 'Document process, create templates for contractor website audits',
            business: 'Transform expense into new revenue stream for BDR members'
          }
        ],
        businessOutcome: 'Sustainable performance improvements plus reusable audit framework for BDR client services',
        revenue_impact: '$10,000 - $15,000 annual optimization value + $50,000+ potential from new audit service'
      }
    ] : [
      // Mobile roadmap
      {
        id: 1,
        title: 'Critical Mobile Performance Fix',
        duration: '3-4 Days',
        cost: '$2,500 - $3,500',
        priority: 'Critical',
        description: 'Fix the catastrophic mobile experience - 3.9s LCP and unstable layout affecting field technicians',
        tasks: [
          {
            task: 'Remove Lazy Loading from Main Content',
            effort: '2 hours',
            impact: 'Cut LCP from 3.9s to ~1.5s (2.4s improvement)',
            technical: 'Remove "nitro-offscreen lazyloaded" classes from primary content div',
            business: 'Contractors in field see content immediately instead of waiting 4 seconds'
          },
          {
            task: 'Fix Mobile Layout Shift',
            effort: '4 hours',
            impact: 'Reduce CLS from 0.21 to <0.1',
            technical: 'Same header fixes as desktop: font preloading + reserved space',
            business: 'Prevent mis-clicks on login/menu when technicians try to navigate'
          },
          {
            task: 'Eliminate Mobile Redirect Penalty',
            effort: '30 minutes',
            impact: 'Remove 990ms mobile redirect delay',
            technical: 'Configure server for direct mobile serving (same as desktop fix)',
            business: '1 second faster loading for mobile users from ads/referrals'
          },
          {
            task: 'Mobile-Specific Testing',
            effort: '4 hours',
            impact: 'Ensure fixes work on slow 4G connections',
            technical: 'Test with throttled mobile networks and real devices',
            business: 'Reliable experience for field workers with varying signal strength'
          }
        ],
        businessOutcome: 'Mobile LCP drops from 3.9s to ~1.5s, CLS below 0.1 - transforms mobile experience from "poor" to "good"',
        revenue_impact: '$100,000 - $140,000 annual recovery from mobile traffic (60% of visitors)'
      },
      {
        id: 2,
        title: 'Mobile UX & Accessibility Polish', 
        duration: '2-3 Days',
        cost: '$1,500 - $2,000',
        priority: 'High',
        description: 'Address mobile-specific UX issues and improve contractor field usability',
        tasks: [
          {
            task: 'Fix Mobile Color Contrast',
            effort: '2 hours',
            impact: 'Buttons readable in truck cabs and job sites with glare',
            technical: 'Update CTA button contrast for mobile environments',
            business: 'Higher tap-through rates on mobile CTAs in bright conditions'
          },
          {
            task: 'Optimize for Mobile-First SEO',
            effort: '3 hours',
            impact: 'Better mobile search rankings',
            technical: 'Replace generic "Learn More" links with descriptive mobile-friendly text',
            business: 'Improved Google mobile rankings for contractor-related searches'
          },
          {
            task: 'Add Missing Mobile Accessibility',
            effort: '1 hour',
            impact: 'Screen reader compatibility on mobile',
            technical: 'Add aria-labels for unlabeled mobile navigation elements',
            business: 'Full mobile accessibility compliance'
          },
          {
            task: 'Mobile Touch Target Optimization',
            effort: '4 hours',
            impact: 'Easier navigation for users with work gloves',
            technical: 'Ensure all buttons meet 44px minimum touch target size',
            business: 'Better usability for contractors accessing site in field'
          }
        ],
        businessOutcome: 'Mobile accessibility score 95+, optimized for contractor field use cases',
        revenue_impact: '$20,000 - $40,000 annual improvement from mobile UX optimization'
      },
      {
        id: 3,
        title: 'BDR Mobile Audit Service Creation',
        duration: '1 Week', 
        cost: '$1,500 - $2,500',
        priority: 'Strategic',
        description: 'Transform mobile audit expertise into scalable service for BDR contractor members',
        tasks: [
          {
            task: 'Create Mobile Audit Template',
            effort: '12 hours',
            impact: 'Reusable mobile performance audit for contractors',
            technical: 'Document mobile-specific audit process, create automated reports',
            business: 'New revenue stream: "Mobile Website Health Check" for BDR members'
          },
          {
            task: 'Field-Specific Optimization Guide',
            effort: '8 hours',
            impact: 'Contractor-focused mobile best practices',
            technical: 'Create mobile optimization guide for service industry websites',
            business: 'Position BDR as mobile technical authority for contractors'
          },
          {
            task: 'Mobile Performance Monitoring Setup',
            effort: '6 hours',
            impact: 'Ongoing mobile performance tracking',
            technical: 'Implement mobile Core Web Vitals monitoring for BDR',
            business: 'Demonstrate ROI and maintain competitive mobile experience'
          }
        ],
        businessOutcome: 'Mobile audit service ready to offer to 10,000+ BDR contractor members',
        revenue_impact: '$20,000 - $30,000 annual BDR performance value + $75,000+ potential from mobile audit service'
      }
    ];

    return { ...baseRoadmap, phases };
  };

  const roadmapData = getRoadmapData(device);

  const PhaseCard = ({ phase, index }) => {
    const isSelected = selectedPhase === phase.id;
    
    return (
      <div className="relative">
        
        <div 
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 transition-all duration-200 cursor-pointer ${
            isSelected ? 'border-blue-500 shadow-xl' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
          }`}
          onClick={() => setSelectedPhase(isSelected ? null : phase.id)}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Phase {phase.id}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    phase.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                    phase.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {phase.priority} Priority
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{phase.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{phase.description}</p>
              </div>
              <span className="text-gray-500 text-xl">
                {isSelected ? '▲' : '▼'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500">Duration</div>
                <div className="font-semibold text-gray-800 dark:text-gray-100">{phase.duration}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Revenue Impact</div>
                <div className="font-semibold text-green-600">{phase.revenue_impact}</div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Business Outcome:</h4>
              <p className="text-blue-700 dark:text-blue-400 text-sm">{phase.businessOutcome}</p>
            </div>
          </div>
          
          {isSelected && (
            <div className="border-t border-gray-200 dark:border-gray-600 p-6">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">📋 Detailed Implementation Tasks</h4>
              <div className="space-y-4">
                {phase.tasks.map((task, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="font-medium text-gray-800 dark:text-gray-100">{task.task}</h5>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{task.effort}</span>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">🔧 Technical:</div>
                        <div className="text-gray-600 dark:text-gray-400">{task.technical}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">💼 Business:</div>
                        <div className="text-gray-600 dark:text-gray-400">{task.business}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">📈 Impact:</div>
                        <div className="text-gray-600 dark:text-gray-400">{task.impact}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {roadmapData.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{roadmapData.subtitle}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="text-sm text-blue-600 dark:text-blue-400">Total Timeframe</div>
            <div className="text-xl font-bold text-blue-800 dark:text-blue-300">{roadmapData.totalTimeframe}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="text-sm text-green-600 dark:text-green-400">Expected ROI</div>
            <div className="text-xl font-bold text-green-800 dark:text-green-300">{roadmapData.expectedROI}</div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Timeline */}
        <div className="relative">
          
          <div className="space-y-8">
            {roadmapData.phases.map((phase, index) => (
              <PhaseCard key={phase.id} phase={phase} index={index} />
            ))}
          </div>
        </div>
        
        {/* Strategic Value Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
            🎯 Strategic Value for BDR
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Immediate Benefits</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Improved lead generation and conversion rates</li>
                <li>• Enhanced professional credibility and trust</li>
                <li>• Better user experience for coaching prospects</li>
                <li>• Competitive advantage in digital presence</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Scale Opportunity</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Package as "BDR Website Health Check" service</li>
                <li>• Offer to contractor members as value-add</li>
                <li>• Position BDR as technical authority in the industry</li>
                <li>• Create new revenue stream from audit services</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActionableRoadmap;