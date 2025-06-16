export const bdrData = {
  "onpage_score": 98.17,
  "url": "https://www.bdrco.com/",
  "meta": {
    "title": "BDR | Business Development Resources | Driving Profit & Growth",
    "description": "BDR coaching and training has helped thousands of HVAC contractors of all sizes, from all across North America, take control of business to drive profit & growth.",
    "cumulative_layout_shift": 0.4039837721090749,
    "content": {
      "plain_text_rate": 0.015764865811208832,
      "plain_text_word_count": 628,
      "automated_readability_index": 8.403355263157895
    },
    "render_blocking_stylesheets_count": 9,
    "internal_links_count": 62,
    "external_links_count": 6,
    "images_count": 6
  },
  "page_timing": {
    "time_to_interactive": 675,
    "dom_complete": 755,
    "largest_contentful_paint": 1004,
    "first_input_delay": 12.3046
  },
  "checks": {
    "has_render_blocking_resources": true,
    "low_content_rate": true,
    "has_misspelling": true,
    "duplicate_meta_tags": true
  },
  "criticalIssues": [
    {
      "title": "High Cumulative Layout Shift (CLS)",
      "impact": "High",
      "effort": "Medium",
      "description": "CLS score of 0.40 is significantly above the 0.1 threshold, causing visual instability",
      "businessImpact": "Users may accidentally click wrong elements, leading to poor user experience and reduced conversions",
      "recommendation": "Optimize image loading and reserve space for dynamic content"
    },
    {
      "title": "9 Render-Blocking Stylesheets",
      "impact": "Medium", 
      "effort": "Low",
      "description": "Multiple CSS files are blocking page rendering",
      "businessImpact": "Slower page loads hurt mobile users and SEO rankings",
      "recommendation": "Combine and minify CSS files, use critical CSS inlining"
    },
    {
      "title": "Low Content-to-HTML Ratio",
      "impact": "Medium",
      "effort": "Medium", 
      "description": "Only 1.6% of page is actual content vs HTML markup",
      "businessImpact": "Search engines prefer content-rich pages for better rankings",
      "recommendation": "Reduce unnecessary HTML markup and increase valuable content"
    }
  ]
};

export const recommendations = [
  {
    "title": "Fix Layout Stability Issues",
    "priority": "Critical",
    "estimatedImpact": "15-25% improvement in user engagement",
    "effort": "2-3 hours",
    "steps": [
      "Add explicit width/height to images",
      "Reserve space for dynamic elements",
      "Test with slow 3G network conditions"
    ]
  },
  {
    "title": "Optimize CSS Delivery",
    "priority": "High", 
    "estimatedImpact": "0.5-1s faster load time",
    "effort": "1-2 hours",
    "steps": [
      "Combine CSS files into one",
      "Inline critical CSS",
      "Load non-critical CSS asynchronously"
    ]
  }
];