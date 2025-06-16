export const lighthouseData = {
  url: "bdrco.com",
  desktop: {
    scores: {
      performance: 73,
      accessibility: 92,
      bestPractices: 78,
      seo: 92
    },
    metrics: {
      ttfb: 57,
      lcp: 1100,
      cls: 0.532,
      tbt: 0,
      tti: 1100,
      fcp: 800,
      si: 1200
    },
    issues: {
      critical: [
        {
          title: "Excessive Layout Shift",
          metric: "CLS: 0.532",
          impact: "High bounce rate, lost conversions",
          severity: "critical"
        }
      ],
      high: [
        {
          title: "Redirect Chain",
          metric: "470ms delay",
          impact: "Slower initial load",
          severity: "high"
        },
        {
          title: "Poor Color Contrast",
          metric: "1.88:1 ratio",
          impact: "Accessibility failure",
          severity: "high"
        }
      ],
      medium: [
        {
          title: "Generic Link Text",
          metric: "6 instances",
          impact: "Missed SEO opportunity",
          severity: "medium"
        },
        {
          title: "Third-party Cookies",
          metric: "3 found",
          impact: "Privacy concerns",
          severity: "medium"
        }
      ]
    },
    opportunities: [
      {
        title: "Eliminate Layout Shift",
        impact: "High",
        savings: "~30% bounce rate reduction",
        effort: "Medium",
        description: "Fix font loading and reserve space for dynamic content"
      },
      {
        title: "Remove Redirect Chain",
        impact: "Medium", 
        savings: "470ms",
        effort: "Low",
        description: "Configure direct www serving"
      },
      {
        title: "Optimize Images",
        impact: "Medium",
        savings: "0.8s LCP improvement",
        effort: "Low",
        description: "Use WebP format and proper sizing"
      }
    ]
  },
  mobile: {
    scores: {
      performance: 42,
      accessibility: 89,
      bestPractices: 75,
      seo: 91
    },
    metrics: {
      ttfb: 180,
      lcp: 4200,
      cls: 0.532,
      tbt: 890,
      tti: 4800,
      fcp: 2800,
      si: 4100
    },
    issues: {
      critical: [
        {
          title: "Excessive Layout Shift",
          metric: "CLS: 0.532",
          impact: "High bounce rate, lost conversions",
          severity: "critical"
        },
        {
          title: "Long Total Blocking Time",
          metric: "TBT: 890ms",
          impact: "Poor mobile interactivity",
          severity: "critical"
        }
      ],
      high: [
        {
          title: "Large Contentful Paint",
          metric: "LCP: 4.2s",
          impact: "Poor perceived performance",
          severity: "high"
        },
        {
          title: "Redirect Chain",
          metric: "470ms delay",
          impact: "Slower initial load",
          severity: "high"
        }
      ],
      medium: [
        {
          title: "Unused JavaScript",
          metric: "342 KB",
          impact: "Slower mobile loading",
          severity: "medium"
        },
        {
          title: "Generic Link Text",
          metric: "6 instances",
          impact: "Missed SEO opportunity",
          severity: "medium"
        }
      ]
    },
    opportunities: [
      {
        title: "Eliminate Layout Shift",
        impact: "High",
        savings: "~30% bounce rate reduction",
        effort: "Medium",
        description: "Fix font loading and reserve space for dynamic content"
      },
      {
        title: "Reduce JavaScript Execution",
        impact: "High",
        savings: "2.1s TBT reduction",
        effort: "High",
        description: "Code splitting and lazy loading"
      },
      {
        title: "Optimize Images",
        impact: "High",
        savings: "1.8s LCP improvement",
        effort: "Low",
        description: "Use WebP format and proper sizing"
      }
    ]
  }
};

export const performanceTimeline = {
  desktop: [
    { name: 'TTFB', time: 57, color: '#10b981' },
    { name: 'First Paint', time: 800, color: '#3b82f6' },
    { name: 'LCP', time: 1100, color: '#f59e0b' },
    { name: 'TTI', time: 1100, color: '#10b981' }
  ],
  mobile: [
    { name: 'TTFB', time: 180, color: '#f59e0b' },
    { name: 'First Paint', time: 2800, color: '#ef4444' },
    { name: 'LCP', time: 4200, color: '#ef4444' },
    { name: 'TTI', time: 4800, color: '#ef4444' }
  ]
};