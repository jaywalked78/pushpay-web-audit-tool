import React, { useEffect, useRef } from 'react';
import ScoreCircle from './ScoreCircle';
import CoreWebVitals from './CoreWebVitals';
import IssuesList from './IssuesList';
import SummaryDashboard from './SummaryDashboard';
import HiddenContentDemo from './HiddenContentDemo';
import PerformanceTrend from './PerformanceTrend';
import QuickFixPreview from './QuickFixPreview';
import ImpactTestimonial from './ImpactTestimonial';
import PageLevelInsights from './PageLevelInsights';
import AnimatedNumber from './AnimatedNumber';
import { pushpayData } from '../../data/pushPayData';
import urlData from '../../data/pushPayFilteredPageData.json';
import gsap from 'gsap';

const OnPageAnalysis = () => {
  const { onpage_score, meta, page_timing, criticalIssues, domain_info, page_metrics, checks } = pushpayData;

  // Refs for progress bars
  const wordCountBarRef = useRef(null);
  const ttiBarRef = useRef(null);
  const linksBarRef = useRef(null);
  const cssBarRef = useRef(null);

  const webVitalsData = {
    largest_contentful_paint: page_timing.largest_contentful_paint,
    first_input_delay: page_timing.first_input_delay,
    cumulative_layout_shift: meta.cumulative_layout_shift
  };

  // Animate progress bars on mount
  useEffect(() => {
    gsap.fromTo(wordCountBarRef.current,
      { width: '0%' },
      { width: '76%', duration: 1.5, ease: 'power2.out', delay: 1.2 }
    );
    
    gsap.fromTo(ttiBarRef.current,
      { width: '0%' },
      { width: '68%', duration: 1.5, ease: 'power2.out', delay: 1.4 }
    );
    
    gsap.fromTo(linksBarRef.current,
      { width: '0%' },
      { width: '84%', duration: 1.5, ease: 'power2.out', delay: 1.6 }
    );
    
    gsap.fromTo(cssBarRef.current,
      { width: '0%' },
      { width: '90%', duration: 1.5, ease: 'power2.out', delay: 1.8 }
    );
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            On-Page Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive analysis of {pushpayData.url}
            <span className="text-sm text-blue-600 dark:text-blue-400 ml-2 font-medium">• Main Pages Focus</span>
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">Last analyzed</div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Summary Dashboard */}
      <SummaryDashboard data={pushpayData} />

      {/* Hero Score and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Circle */}
        <div className="lg:col-span-1">
          <ScoreCircle score={onpage_score} />
        </div>
        
        {/* Quick Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg hover:shadow-xl p-4 border border-gray-200 dark:border-gray-700 hover:scale-[1.02] transition-all duration-300">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              <AnimatedNumber value={meta.content.plain_text_word_count} delay={1200} duration={1500} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Word Count</div>
            <div className="text-xs text-gray-400 mt-1">
              <AnimatedNumber value={meta.content.plain_text_rate * 100} decimals={1} delay={1400} duration={1300} suffix="%" /> content ratio
            </div>
            {/* Mini progress bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>vs. Industry Avg</span>
                <span className="text-green-600">+12%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div ref={wordCountBarRef} className="bg-green-500 h-2 rounded-full" style={{width: '0%'}}></div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg hover:shadow-xl p-4 border border-gray-200 dark:border-gray-700 hover:scale-[1.02] transition-all duration-300">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              <AnimatedNumber value={page_timing.time_to_interactive} delay={1400} duration={1500} />ms
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Time to Interactive</div>
            <div className="text-xs text-gray-400 mt-1">
              Time until page is fully interactive
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>vs. Industry Avg</span>
                <span className="text-yellow-600">+8%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div ref={ttiBarRef} className="bg-yellow-500 h-2 rounded-full" style={{width: '0%'}}></div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg hover:shadow-xl p-4 border border-gray-200 dark:border-gray-700 hover:scale-[1.02] transition-all duration-300">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              <AnimatedNumber value={page_metrics.links_internal} delay={1600} duration={1500} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Internal Links</div>
            <div className="text-xs text-gray-400 mt-1">
              <AnimatedNumber value={page_metrics.links_external} delay={1800} duration={1300} /> external links
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>vs. Industry Avg</span>
                <span className="text-green-600">+24%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div ref={linksBarRef} className="bg-green-500 h-2 rounded-full" style={{width: '0%'}}></div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg hover:shadow-xl p-4 border border-gray-200 dark:border-gray-700 hover:scale-[1.02] transition-all duration-300">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              <AnimatedNumber value={meta.render_blocking_stylesheets_count} delay={1800} duration={1500} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Blocking CSS</div>
            <div className="text-xs text-gray-400 mt-1">
              Render-blocking stylesheets
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>vs. Industry Avg</span>
                <span className="text-red-600">+180%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div ref={cssBarRef} className="bg-red-500 h-2 rounded-full" style={{width: '0%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <CoreWebVitals data={webVitalsData} />
      </div>

      {/* Hidden Content Impact Demo */}
      <HiddenContentDemo />

      {/* Performance Trend Chart */}
      <PerformanceTrend />

      {/* Critical Issues */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <IssuesList issues={criticalIssues} />
      </div>

      {/* SEO Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:scale-[1.02] transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            SEO Health
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Title Length</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {meta.title.length} chars ✓
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Meta Description</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {meta.description.length} chars ✓
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Images Count</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {meta.images_count}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:scale-[1.02] transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Technical Health
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">HTTPS</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Enabled ✓
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Canonical URL</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Present ✓
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Broken Links</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                None ✓
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Fix Preview */}
      <QuickFixPreview />

      {/* Domain Health Overview */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Domain Health Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">SSL Certificate</span>
              <span className={`text-sm font-medium ${domain_info.ssl_info.valid_certificate ? 'text-green-600' : 'text-red-600'}`}>
                {domain_info.ssl_info.valid_certificate ? '✓ Valid' : '✗ Invalid'}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Expires: {new Date(domain_info.ssl_info.certificate_expiration_date).toLocaleDateString()}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">HTTP/2 Support</span>
              <span className={`text-sm font-medium ${domain_info.checks.http2 ? 'text-green-600' : 'text-red-600'}`}>
                {domain_info.checks.http2 ? '✓ Enabled' : '✗ Disabled'}
              </span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Robots.txt</span>
              <span className={`text-sm font-medium ${domain_info.checks.robots_txt ? 'text-green-600' : 'text-red-600'}`}>
                {domain_info.checks.robots_txt ? '✓ Present' : '✗ Missing'}
              </span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sitemap</span>
              <span className={`text-sm font-medium ${domain_info.checks.sitemap ? 'text-green-600' : 'text-red-600'}`}>
                {domain_info.checks.sitemap ? '✓ Present' : '✗ Missing'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Crawl Summary</h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Analyzed {domain_info.total_pages} {domain_info.pages_analyzed} • Server: {domain_info.server} • CMS: {domain_info.cms}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                <AnimatedNumber value={onpage_score} decimals={1} delay={500} duration={1500} suffix="%" />
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300">Overall Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Technical Issues */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Critical Technical Issues
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {checks.has_misspelling > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-red-900 dark:text-red-100">Spelling Errors</h4>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">{checks.has_misspelling}</span>
              </div>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">Pages with misspellings detected</p>
            </div>
          )}
          
          {checks.lorem_ipsum > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-red-900 dark:text-red-100">Lorem Ipsum Text</h4>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">{checks.lorem_ipsum}</span>
              </div>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">Pages with placeholder content</p>
            </div>
          )}
          
          {checks.no_image_alt > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Missing Alt Text</h4>
                <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{checks.no_image_alt}</span>
              </div>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">Pages with images missing alt attributes</p>
            </div>
          )}
          
          {checks.https_to_http_links > 0 && (
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-orange-900 dark:text-orange-100">Insecure Links</h4>
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{checks.https_to_http_links}</span>
              </div>
              <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">HTTPS pages linking to HTTP</p>
            </div>
          )}
          
          {checks.has_render_blocking_resources > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Render Blocking</h4>
                <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{checks.has_render_blocking_resources}</span>
              </div>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">Pages with render-blocking resources</p>
            </div>
          )}
          
          {checks.duplicate_meta_tags > 0 && (
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-orange-900 dark:text-orange-100">Duplicate Meta Tags</h4>
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{checks.duplicate_meta_tags}</span>
              </div>
              <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">Pages with duplicate meta descriptions</p>
            </div>
          )}
        </div>
      </div>

      {/* Page Quality Metrics */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Page Quality & SEO Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              <AnimatedNumber value={page_metrics.links_internal} delay={800} duration={1500} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Internal Links</div>
            <div className="text-xs text-gray-400 mt-1">
              <AnimatedNumber value={page_metrics.links_external} delay={1000} duration={1300} /> external
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              <AnimatedNumber value={page_metrics.duplicate_content} delay={1200} duration={1500} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Duplicate Content</div>
            <div className="text-xs text-gray-400 mt-1">
              <AnimatedNumber value={page_metrics.duplicate_title} delay={1400} duration={1300} /> duplicate titles
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              <AnimatedNumber value={page_metrics.broken_links} delay={1600} duration={1500} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Broken Links</div>
            <div className="text-xs text-gray-400 mt-1">
              <AnimatedNumber value={page_metrics.broken_resources} delay={1800} duration={1300} /> broken resources
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              <AnimatedNumber value={page_metrics.non_indexable} delay={2000} duration={1500} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Non-Indexable</div>
            <div className="text-xs text-gray-400 mt-1">Pages blocked from search engines</div>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Content Quality Issues</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {checks.low_readability_rate > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <span className="text-sm text-yellow-800 dark:text-yellow-200">Low Readability</span>
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{checks.low_readability_rate} pages</span>
              </div>
            )}
            
            {checks.title_too_short > 0 && (
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <span className="text-sm text-orange-800 dark:text-orange-200">Short Titles</span>
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">{checks.title_too_short} pages</span>
              </div>
            )}
            
            {checks.no_h1_tag > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <span className="text-sm text-red-800 dark:text-red-200">Missing H1 Tags</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">{checks.no_h1_tag} pages</span>
              </div>
            )}
            
            {checks.no_description > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <span className="text-sm text-red-800 dark:text-red-200">Missing Descriptions</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">{checks.no_description} pages</span>
              </div>
            )}
            
            {checks.low_content_rate > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <span className="text-sm text-yellow-800 dark:text-yellow-200">Low Content Rate</span>
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{checks.low_content_rate} pages</span>
              </div>
            )}
            
            {checks.is_redirect > 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm text-blue-800 dark:text-blue-200">Redirect Pages</span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{checks.is_redirect} pages</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page-Level Insights */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <PageLevelInsights data={urlData[0]} />
      </div>

      {/* Impact Testimonial */}
      <ImpactTestimonial />
    </div>
  );
};

export default OnPageAnalysis;