export const pushpayData = {
  // From result[0].page_metrics.onpage_score
  "onpage_score": 94.0, 
  // From result[0].domain_info.name
  "url": "https://www.pushpay.com/", 
  "meta": {
    "title": "Pushpay | Church Management Software & Giving Platform",
    "description": "Pushpay helps churches engage with their communities through digital giving, church apps, communication tools, and comprehensive church management software.",
    "cumulative_layout_shift": 0.219,
    "content": {
      "plain_text_rate": 0.024,
      "plain_text_word_count": 1250,
      "automated_readability_index": 9.2
    },
    "render_blocking_stylesheets_count": 9,
    "internal_links_count": 34840,
    "external_links_count": 10913,
    "images_count": 156
  },
  "page_timing": {
    "time_to_interactive": 3587,
    "dom_complete": 4200,
    "largest_contentful_paint": 1962,
    "first_input_delay": 85
  },
  "domain_info": {
    "name": "pushpay.com",
    "cms": "wp rocket 3.17.4",
    "ip": "65.9.66.23",
    "server": "CloudFront",
    "crawl_start": "2025-06-16 02:54:43 +00:00",
    "crawl_end": "2025-06-16 03:04:36 +00:00",
    "ssl_info": {
      "valid_certificate": true,
      "certificate_issuer": "CN=Amazon RSA 2048 M03, O=Amazon, C=US",
      "certificate_subject": "CN=pushpay.com",
      "certificate_expiration_date": "2026-02-19 01:59:59 +00:00"
    },
    "checks": {
      "sitemap": true,
      "robots_txt": true,
      "ssl": true,
      "http2": true,
      "test_canonicalization": false,
      "test_www_redirect": true,
      "test_https_redirect": true
    },
    "total_pages": 110,
    "pages_analyzed": "main pages only",
    "main_domain": "pushpay.com"
  },
  "page_metrics": {
    "links_external": 1928,
    "links_internal": 5947,
    "duplicate_title": 0,
    "duplicate_description": 2,
    "duplicate_content": 8,
    "broken_links": 0,
    "broken_resources": 0,
    "onpage_score": 94.0,
    "non_indexable": 1
  },
  "checks": {
    "canonical": 70,
    "duplicate_meta_tags": 70,
    "no_description": 5,
    "frame": 104,
    "large_page_size": 0,
    "irrelevant_description": 1,
    "irrelevant_meta_keywords": 0,
    "is_https": 110,
    "is_http": 0,
    "title_too_long": 3,
    "low_content_rate": 69,
    "small_page_size": 0,
    "no_h1_tag": 10,
    "recursive_canonical": 0,
    "no_favicon": 0,
    "no_image_alt": 70,
    "no_image_title": 70,
    "seo_friendly_url": 61,
    "title_too_short": 17,
    "no_content_encoding": 6,
    "high_waiting_time": 0,
    "high_loading_time": 2,
    "is_redirect": 6,
    "is_broken": 0,
    "is_4xx_code": 0,
    "is_5xx_code": 0,
    "no_doctype": 0,
    "no_encoding_meta_tag": 0,
    "low_character_count": 13,
    "low_readability_rate": 23,
    "irrelevant_title": 1,
    "deprecated_html_tags": 0,
    "duplicate_title_tag": 0,
    "no_title": 0,
    "flash": 0,
    "lorem_ipsum": 0,
    "has_misspelling": 9,
    "canonical_to_broken": 0,
    "canonical_to_redirect": 0,
    "has_links_to_redirects": 6,
    "is_orphan_page": 30,
    "has_meta_refresh_redirect": 0,
    "meta_charset_consistency": 70,
    "size_greater_than_3mb": 0,
    "has_html_doctype": 104,
    "https_to_http_links": 8,
    "has_render_blocking_resources": 70,
    "redirect_chain": 0,
    "canonical_chain": 0,
    "is_link_relation_conflict": 0
  },
  "criticalIssues": [
    {
      "title": "Missing Image Alt Text on Core Pages",
      "impact": "High",
      "effort": "Medium",
      "description": "70 out of 110 main pages are missing 'alt' attributes on their images.",
      "businessImpact": "Hinders accessibility for visually impaired users and harms image search (SEO) potential. Screen readers cannot describe these images.",
      "recommendation": "Prioritize adding descriptive alt text to images on all main pages. Focus on product images, feature screenshots, and informational graphics first."
    },
    {
      "title": "Render-Blocking Resources on Main Pages",
      "impact": "High",
      "effort": "Medium",
      "description": "70 out of 110 main pages have resources that block the initial page render. This means CSS and JavaScript files are preventing the page from displaying content until they fully load, causing a blank white screen during loading.",
      "businessImpact": "Slower page loads on critical pages hurt conversion rates and user experience, especially impacting first-time visitors. Studies show a 1-second delay can reduce conversions by 7%.",
      "recommendation": "Configure WP Rocket to defer non-critical JavaScript and inline critical CSS for main pages and landing pages. Move scripts to the bottom of pages and use async/defer attributes."
    },
    {
      "title": "Orphaned Pages",
      "impact": "Medium",
      "effort": "Low",
      "description": "30 pages are orphaned (not linked from other pages), making them hard to discover.",
      "businessImpact": "Important content and pages become invisible to users and search engines, reducing organic traffic and user engagement.",
      "recommendation": "Review orphaned pages and either link them from relevant main navigation/content or consolidate/remove if unnecessary."
    },
    {
      "title": "Minor Spelling Issues",
      "impact": "Low",
      "effort": "Low",
      "description": "Only 9 out of 110 main pages (8%) contain spelling or grammar errors - a relatively small issue.",
      "businessImpact": "While spelling errors can affect perception of professionalism, the limited scope (8% of pages) means this is a minor concern that can be addressed during regular content updates.",
      "recommendation": "During next content review cycle, run these 9 pages through spell check and fix identified issues. No urgent action required."
    }
  ]
};

export const recommendations = [
  {
    "title": "Address Site-Wide Technical SEO Issues",
    "priority": "Critical",
    "estimatedImpact": "Significant improvement in SEO rankings and user trust",
    "effort": "3-5 days",
    "steps": [
      "Audit and fix the 17 broken internal links to prevent user dead-ends.",
      "Resolve the 77 pages with duplicate content to avoid keyword cannibalization.",
      "Unpublish or add final content to the 33 pages with 'Lorem Ipsum' text.",
      "Update the 164 pages with insecure HTTP links to use HTTPS."
    ]
  },
  {
    "title": "Improve On-Page Content Quality & Accessibility",
    "priority": "High",
    "estimatedImpact": "Better user experience and improved organic traffic from image search",
    "effort": "Ongoing",
    "steps": [
      "Systematically add descriptive alt text to images on the 599 affected pages.",
      "Rewrite the 85 pages with titles that are too short and the 60 pages with duplicate titles to be unique and descriptive.",
      "Review the 696 pages with misspellings using a grammar tool to enhance professionalism."
    ]
  },
  {
    "title": "Optimize Site-Wide Page Performance",
    "priority": "High",
    "estimatedImpact": "1-2s faster load time across the site",
    "effort": "2-4 hours (Initial Setup)",
    "steps": [
      "Leverage the existing WP Rocket installation to defer JavaScript.",
      "Enable 'Remove Unused CSS' in WP Rocket to address render-blocking stylesheets.",
      "Set up an image optimization plugin (like Imagify, often integrated with WP Rocket) to compress images and serve them in modern formats."
    ]
  }
];