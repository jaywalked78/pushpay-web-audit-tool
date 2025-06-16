export const pushpayData = {
  // From result[0].page_metrics.onpage_score
  "onpage_score": 93.43, 
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
    "ip": "65.9.66.10",
    "server": "CloudFront",
    "crawl_start": "2025-06-14 23:01:07 +00:00",
    "crawl_end": "2025-06-15 00:29:35 +00:00",
    "ssl_info": {
      "valid_certificate": true,
      "certificate_issuer": "CN=E5, O=Let's Encrypt, C=US",
      "certificate_subject": "CN=id.pushpay.com",
      "certificate_expiration_date": "2025-08-02 09:43:29 +00:00"
    },
    "checks": {
      "sitemap": false,
      "robots_txt": true,
      "ssl": true,
      "http2": true,
      "test_canonicalization": false,
      "test_www_redirect": true,
      "test_https_redirect": true
    },
    "total_pages": 1000,
    "main_domain": "pushpay.com"
  },
  "page_metrics": {
    "links_external": 10913,
    "links_internal": 34840,
    "duplicate_title": 60,
    "duplicate_description": 41,
    "duplicate_content": 77,
    "broken_links": 17,
    "broken_resources": 32,
    "onpage_score": 93.43,
    "non_indexable": 117
  },
  "checks": {
    "canonical": 599,
    "duplicate_meta_tags": 430,
    "no_description": 48,
    "frame": 682,
    "large_page_size": 0,
    "irrelevant_description": 7,
    "irrelevant_meta_keywords": 6,
    "is_https": 989,
    "is_http": 11,
    "title_too_long": 39,
    "low_content_rate": 598,
    "small_page_size": 0,
    "no_h1_tag": 23,
    "recursive_canonical": 0,
    "no_favicon": 0,
    "no_image_alt": 599,
    "no_image_title": 599,
    "seo_friendly_url": 454,
    "title_too_short": 85,
    "no_content_encoding": 302,
    "high_waiting_time": 7,
    "high_loading_time": 53,
    "is_redirect": 294,
    "is_broken": 9,
    "is_4xx_code": 4,
    "is_5xx_code": 5,
    "no_doctype": 0,
    "no_encoding_meta_tag": 81,
    "low_character_count": 38,
    "low_readability_rate": 106,
    "irrelevant_title": 2,
    "deprecated_html_tags": 1,
    "duplicate_title_tag": 0,
    "no_title": 1,
    "flash": 0,
    "lorem_ipsum": 33,
    "has_misspelling": 696,
    "canonical_to_broken": 0,
    "canonical_to_redirect": 80,
    "has_links_to_redirects": 294,
    "is_orphan_page": 0,
    "has_meta_refresh_redirect": 0,
    "meta_charset_consistency": 514,
    "size_greater_than_3mb": 0,
    "has_html_doctype": 697,
    "https_to_http_links": 164,
    "has_render_blocking_resources": 599,
    "redirect_chain": 10,
    "canonical_chain": 0,
    "is_link_relation_conflict": 8
  },
  "criticalIssues": [
    {
      "title": "Widespread Missing Image Alt Text",
      "impact": "High",
      "effort": "Medium",
      "description": "599 pages are missing 'alt' attributes on their images.",
      "businessImpact": "Hinders accessibility for visually impaired users and harms image search (SEO) potential. Screen readers cannot describe these images.",
      "recommendation": "Implement a process to add descriptive alt text to all informational images. Decorative images should have an empty alt attribute (alt=\"\")."
    },
    {
      "title": "Systemic Render-Blocking Resources",
      "impact": "High",
      "effort": "Medium",
      "description": "599 pages have resources that block the initial page render, slowing down the user experience across the entire site.",
      "businessImpact": "Site-wide slow performance negatively affects user engagement, bounce rates, and Core Web Vitals scores, which can lower search rankings.",
      "recommendation": "Configure WP Rocket to defer non-critical JavaScript and inline critical CSS. This will prioritize visible content and improve perceived load speed."
    },
    {
      "title": "Insecure HTTPS to HTTP Links",
      "impact": "Medium",
      "effort": "Low",
      "description": "164 pages link from a secure (https) page to an insecure (http) one, which can trigger browser warnings.",
      "businessImpact": "Reduces user trust and can cause some assets not to load due to mixed-content policies, creating a broken experience.",
      "recommendation": "Run a database search-and-replace to update all instances of 'http://pushpay.com' to 'https://pushpay.com' in page content and templates."
    },
    {
      "title": "Placeholder 'Lorem Ipsum' Content on Live Pages",
      "impact": "High",
      "effort": "Low",
      "description": "33 pages contain 'Lorem Ipsum' placeholder text, indicating they are unfinished or were published accidentally.",
      "businessImpact": "Appears highly unprofessional to users and search engines, signaling a low-quality site and potentially harming brand perception and SEO authority.",
      "recommendation": "Immediately identify and either unpublish these 33 pages or replace the placeholder text with final, approved content."
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