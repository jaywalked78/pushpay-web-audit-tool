export const lighthouseData = {
  // Inferred from the audit data (e.g., server-response-time)
  url: "pushpay.com", 
  desktop: {
    scores: {
      // From categories.performance.score (0.72 * 100)
      performance: 72,
      // From categories.accessibility.score (0.77 * 100)
      accessibility: 77,
      // From categories.best-practices.score (0.56 * 100)
      bestPractices: 56,
      // From categories.seo.score (0.85 * 100)
      seo: 85
    },
    metrics: {
      // From audits['server-response-time'].numericValue
      ttfb: 577, 
      // From audits['largest-contentful-paint'].numericValue
      lcp: 1962,
      // From audits['cumulative-layout-shift'].numericValue
      cls: 0.219,
      // From audits['total-blocking-time'].numericValue
      tbt: 4,
      // From audits['interactive'].numericValue
      tti: 3587,
      // From audits['first-contentful-paint'].numericValue
      fcp: 1650,
      // From audits['speed-index'].numericValue
      si: 1912
    },
    diagnosticsSummary: {
      // From diagnostics.details.items[0]
      totalByteWeight: 4818334, // in bytes
      totalRequests: 121,
      numScripts: 34,
      numStylesheets: 9,
      numFonts: 3,
      totalTaskTime: 1035, // in ms
      mainDocumentTransferSize: 46885, // in bytes
    },
    issues: {
      critical: [
        {
          title: "Avoid large layout shifts",
          metric: `CLS: ${0.219}`,
          impact: "Causes a jarring user experience, high bounce rates, and can hurt search rankings.",
          severity: "critical",
          // From layout-shifts audit
          reference: "2 main layout shifts were caused by late-loading network requests and web fonts."
        },
        {
          title: "Browser errors were logged to the console",
          metric: "3 errors found",
          impact: "Indicates broken functionality, such as CORS policy blocking images and script exceptions.",
          severity: "critical",
          // From errors-in-console audit
          reference: "CORS, DOMException, and net::ERR_FAILED errors detected."
        }
      ],
      high: [
        {
          title: "Eliminate render-blocking resources",
          metric: "Potential savings of 270 ms",
          impact: "Delays the initial paint (FCP) of the page, making it feel slow.",
          severity: "high",
          // From render-blocking-resources audit
          reference: "Scripts like termly.io and forms2.min.js are blocking rendering."
        },
        {
          title: "Reduce unused CSS",
          metric: "Potential savings of 149 KiB",
          impact: "Increases network payload and time to start rendering the page.",
          severity: "high",
          // From unused-css-rules audit
          reference: "Significant unused CSS in js_composer_front_custom.css and dashicons.min.css."
        },
        {
          title: "Reduce unused JavaScript",
          metric: "Potential savings of 828 KiB",
          impact: "Wasted network bandwidth and blocks the main thread during parse/compile.",
          severity: "high",
          // From unused-javascript audit
          reference: "Major unused JS from jukebox.js and application2.js."
        },
        {
          title: "Poor Color Contrast",
          metric: "15 instances found",
          impact: "Text is difficult or impossible for users with vision impairments to read.",
          severity: "high",
          // From color-contrast audit
          reference: "Failing elements include links and headings with ratios like 2.31:1."
        },
        {
          title: "Heading elements are not in order",
          metric: "10 instances found",
          impact: "Confuses screen reader users and hinders page navigation and understanding.",
          severity: "high",
          // From heading-order audit
          reference: "Skipped heading levels from H2 to H6, and H2 to H4."
        }
      ],
      medium: [
        {
          title: "Serve images in next-gen formats",
          metric: "Potential savings of 1,035 KiB",
          impact: "Slower image loading and higher data consumption for users.",
          severity: "medium",
          // From modern-image-formats audit
          reference: "PNG images can be converted to WebP or AVIF for significant size reduction."
        },
        {
          title: "Links do not have descriptive text",
          metric: "11 links found",
          impact: "Reduces accessibility and provides poor context for SEO crawlers.",
          severity: "medium",
          // From link-text audit
          reference: "Generic text like 'LEARN MORE' and 'MORE' should be more descriptive."
        },
        {
          title: "Uses deprecated APIs",
          metric: "1 warning found",
          impact: "The site may break in future browser versions as APIs are removed.",
          severity: "medium",
          // From deprecations audit
          reference: "CSSValueAppearanceNonStandard was detected."
        },
        {
          title: "Uses third-party cookies",
          metric: "2 cookies found",
          impact: "Will lose functionality as browsers phase out third-party cookies.",
          severity: "medium",
          // From third-party-cookies audit
          reference: "Cookies from jukebox.pathfactory.com detected."
        }
      ]
    },
    opportunities: [
      {
        title: "Serve images in modern formats (WebP/AVIF)",
        impact: "High",
        savings: "1,035 KiB and ~50ms LCP",
        effort: "Low",
        description: "Convert PNG and JPG images to modern formats to significantly reduce their size and improve load times."
      },
      {
        title: "Eliminate Render-Blocking Resources",
        impact: "High",
        savings: "270ms FCP",
        effort: "Medium",
        description: "Defer non-critical CSS and JS, and inline critical styles to speed up the initial page render."
      },
      {
        title: "Reduce Unused JavaScript",
        impact: "High",
        savings: "828 KiB",
        effort: "High",
        description: "Use code-splitting to only load JavaScript that is needed for the current page view, reducing load time and TBT."
      },
      {
        title: "Reduce Unused CSS",
        impact: "Medium",
        savings: "149 KiB",
        effort: "Medium",
        description: "Remove dead rules from stylesheets to decrease network transfer size."
      },
      {
        title: "Fix Layout Shifts",
        impact: "High",
        savings: "Improve CLS score from 0.219 to < 0.1",
        effort: "Medium",
        description: "Ensure fonts don't cause shifts (using font-display: swap) and that space is reserved for dynamically loaded content."
      }
    ],
    stackPacks: [
      {
        id: "wordpress",
        title: "WordPress",
        recommendations: [
          {
            audit: "unused-css-rules",
            advice: "Consider reducing, or switching, the number of WordPress plugins loading unused CSS. Try running code coverage in Chrome DevTools to identify plugins that are adding extraneous CSS."
          },
          {
            audit: "modern-image-formats",
            advice: "Consider using the Performance Lab plugin to automatically convert your uploaded JPEG images into WebP, wherever supported."
          },
          {
            audit: "render-blocking-resources",
            advice: "There are a number of WordPress plugins that can help you inline critical assets or defer less important resources. Beware that optimizations may break features of your theme or plugins."
          },
          {
            audit: "server-response-time",
            advice: "Themes, plugins, and server specifications all contribute to server response time. Consider finding a more optimized theme, carefully selecting an optimization plugin, and/or upgrading your server."
          }
        ]
      },
      {
        id: "wp-rocket",
        title: "WP Rocket",
        recommendations: [
           {
            audit: "unused-css-rules",
            advice: "Enable 'Remove Unused CSS' in 'WP Rocket' to fix this issue. It reduces page size by removing all CSS and stylesheets that are not used."
          },
          {
            audit: "unused-javascript",
            advice: "Enable 'Delay JavaScript execution' in 'WP Rocket' to fix this problem. It will improve the loading of your page by delaying the execution of scripts until user interaction."
          },
          {
            audit: "render-blocking-resources",
            advice: "Enable 'Remove Unused CSS' and 'Load JavaScript deferred' in 'WP Rocket' to address this recommendation."
          }
        ]
      }
    ]
  },
  // The mobile section is a placeholder. A separate mobile audit would be needed to populate this.
  mobile: {}
};

export const performanceTimeline = [
  { date: '2023-10', performance: 68, accessibility: 75, bestPractices: 54, seo: 83 },
  { date: '2023-11', performance: 70, accessibility: 76, bestPractices: 55, seo: 84 },
  { date: '2023-12', performance: 72, accessibility: 77, bestPractices: 56, seo: 85 }
];