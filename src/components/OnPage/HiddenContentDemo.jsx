import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Eye, EyeOff } from 'lucide-react';
import gsap from 'gsap';

const HiddenContentDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [wordCount, setWordCount] = useState(355);
  
  // Scroll to top on component mount (page refresh)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Refs for DOM elements
  const containerRef = useRef(null);
  const visibleContentRef = useRef(null);
  const hiddenContentRef = useRef(null);
  const seoImpactRef = useRef(null);
  const tl = useRef(null);

  const resetDemo = () => {
    if (tl.current) {
      tl.current.kill();
    }
    setIsPlaying(false);
    setShowHidden(false);
    setWordCount(355);
    gsap.set(hiddenContentRef.current, { height: 0, opacity: 0 });
    // Scroll to top when resetting
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const showImpact = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setShowHidden(true);
    setWordCount(3400);
    
    tl.current = gsap.timeline({
      onComplete: () => {
        setIsPlaying(false);
      }
    });

    tl.current
      // Show hidden content expanding
      .to(hiddenContentRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out',
        onComplete: () => {
          // Scroll to hidden content section after animation
          hiddenContentRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      })
      // Show SEO impact metrics with stagger effect
      .fromTo(seoImpactRef.current?.children || [], 
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out'
        }, '-=0.5');
  };

  const hideImpact = () => {
    setShowHidden(false);
    setWordCount(355);
    gsap.to(hiddenContentRef.current, {
      height: 0,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut'
    });
    // Animation handled by conditional rendering
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Hidden Content Impact Demo</h3>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">
            Press Page: {wordCount.toLocaleString()} words loaded, 355 visible ({Math.round((wordCount - 355) / wordCount * 100)}% hidden){showHidden ? ' • 51 releases + 152 news hidden' : ''}
          </div>
          {!showHidden ? (
            <button 
              onClick={showImpact} 
              disabled={isPlaying} 
              className="flex items-center space-x-1 px-3 py-1 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              <Play className="w-3 h-3" /> <span>Show Impact</span>
            </button>
          ) : (
            <button 
              onClick={hideImpact} 
              className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
            >
              <EyeOff className="w-3 h-3" /> <span>Hide Impact</span>
            </button>
          )}
          <button 
            onClick={resetDemo} 
            className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <div ref={containerRef} className="relative rounded-lg overflow-hidden" style={{ backgroundColor: '#20284e' }}>
        {/* Pushpay Header */}
        <div className="bg-blue-900/50 backdrop-blur-sm border-b border-blue-700/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-900 font-bold text-sm">P</span>
              </div>
              <div className="font-bold text-xl text-white">Pushpay</div>
            </div>
            <div className="text-sm text-blue-200 opacity-90">Press & News</div>
          </div>
        </div>

        {/* Press Page Content */}
        <div ref={visibleContentRef} className="relative">
          {/* Hero Section */}
          <div className="text-center py-12 px-6">
            <h1 className="text-4xl font-bold text-white mb-4">Press</h1>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-8">
              Everything you need to know about what's happening at Pushpay, including press releases, news mentions, and industry awards.
            </p>
            
            {/* Navigation Tabs */}
            <div className="flex justify-center space-x-4 mb-8">
              <div className="bg-blue-400 hover:bg-blue-300 transition-colors px-6 py-2 rounded-full text-blue-900 font-medium cursor-pointer">
                Press Releases
              </div>
              <div className="bg-pink-400 hover:bg-pink-300 transition-colors px-6 py-2 rounded-full text-pink-900 font-medium cursor-pointer">
                In The News
              </div>
              <div className="bg-purple-400 hover:bg-purple-300 transition-colors px-6 py-2 rounded-full text-purple-900 font-medium cursor-pointer">
                Commentary
              </div>
            </div>
          </div>

          {/* Press Releases Section */}
          <div className="px-6 pb-8">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              <span className="inline-block border-b-2 border-blue-400 pb-2">Press Releases</span>
            </h2>
            
            {/* Visible Press Release Cards - 4 total visible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="p-6">
                <div className="text-sm mb-2" style={{ color: '#4b5374' }}>May 14, 2025</div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#e6e7eb' }}>
                  Pushpay Unveils New Strategic Partnerships and Integrations to Support Church Growth and Engagement
                </h3>
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-colors">
                  <span className="text-white">→</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-sm mb-2" style={{ color: '#4b5374' }}>April 30, 2025</div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#e6e7eb' }}>
                  Pushpay's 2025 State of Church Tech Report Reveals Digital Tools are Strengthening Faith, Fueling Connection, and Shaping the Future of Ministry
                </h3>
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-colors">
                  <span className="text-white">→</span>
                </div>
              </div>

              <div className="p-6">
                <div className="text-sm mb-2" style={{ color: '#4b5374' }}>March 19, 2025</div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#e6e7eb' }}>
                  Pushpay Announces Leadership Transition and the Appointment of Kenny Wyatt as New CEO
                </h3>
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-colors">
                  <span className="text-white">→</span>
                </div>
              </div>

              <div className="p-6">
                <div className="text-sm mb-2" style={{ color: '#4b5374' }}>January 30, 2025</div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#e6e7eb' }}>
                  Churches Cultivate Deeper Connections and Greater Generosity in 2024 with Pushpay
                </h3>
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-colors">
                  <span className="text-white">→</span>
                </div>
              </div>
            </div>

            {/* SEE MORE button */}
            <div className="text-center mt-8">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                SEE MORE
              </button>
            </div>
          </div>

          {/* Visible Content Counter */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-gray-700 flex items-center">
            <Eye className="w-4 h-4 mr-1 text-green-600" />
            355 words visible to users
          </div>

          {/* Accessibility Warning - Only show when showHidden is true */}
          {showHidden && (
            <div className="absolute top-4 right-4 bg-orange-100/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-orange-700 flex items-center">
              <span className="text-orange-600 mr-2">⚠️</span>
              Poor contrast: dates barely readable (#4b5374 on #20284e)
            </div>
          )}

          {/* Broken Slider Demo */}
          {wordCount > 355 && (
            <div className="absolute bottom-4 right-4 bg-red-100/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-red-700 flex items-center">
              <span className="text-red-600 mr-2">⚠️</span>
              Broken slider controls loaded but non-functional
            </div>
          )}
        </div>

        {/* Hidden Content (CSS hidden but loaded) */}
        <div 
          ref={hiddenContentRef} 
          className="bg-red-900/80 backdrop-blur-sm border-t-2 border-red-400 overflow-hidden"
          style={{ height: 0, opacity: 0 }}
        >
          <div className="p-6">
            <div className="flex items-center justify-center mb-6">
              <EyeOff className="w-6 h-6 text-red-300 mr-3" />
              <h3 className="text-xl font-semibold text-red-200">Hidden Content Loaded But Not Visible</h3>
            </div>
            
            {/* Hidden Press Release Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Historical Press Releases */}
              <div className="bg-red-800/50 rounded-lg p-4 border border-red-600">
                <div className="text-red-200 font-medium mb-3">Hidden Press Releases (51 total)</div>
                <div className="space-y-2 text-sm text-red-300">
                  <div className="bg-red-700/50 p-2 rounded text-xs">
                    <div className="font-medium">October 29, 2024</div>
                    <div>Awaken Greater Generosity Tools Enhanced</div>
                  </div>
                  <div className="bg-red-700/50 p-2 rounded text-xs">
                    <div className="font-medium">September 12, 2024</div>
                    <div>$10K Sunday Contest Winner - Carlo Acutis</div>
                  </div>
                  <div className="bg-red-700/50 p-2 rounded text-xs">
                    <div className="font-medium">July 16, 2024</div>
                    <div>Catholic Church Innovations at Congress</div>
                  </div>
                  <div className="text-center text-red-400 text-xs">
                    + 48 more hidden releases
                  </div>
                </div>
              </div>

              {/* Historical News */}
              <div className="bg-red-800/50 rounded-lg p-4 border border-red-600">
                <div className="text-red-200 font-medium mb-3">Hidden News Coverage (152 total)</div>
                <div className="space-y-2 text-sm text-red-300">
                  <div className="bg-red-700/50 p-2 rounded text-xs">
                    <div className="font-medium">Business Insider</div>
                    <div>Faith Meets Fintech: AI and Crypto</div>
                  </div>
                  <div className="bg-red-700/50 p-2 rounded text-xs">
                    <div className="font-medium">The Christian Post</div>
                    <div>Churches embrace AI in ministry</div>
                  </div>
                  <div className="bg-red-700/50 p-2 rounded text-xs">
                    <div className="font-medium">Worship Facility</div>
                    <div>Digital Tools Shaping Ministry Future</div>
                  </div>
                  <div className="text-center text-red-400 text-xs">
                    + 149 more hidden articles
                  </div>
                </div>
              </div>

              {/* Commentary Archive */}
              <div className="bg-red-800/50 rounded-lg p-4 border border-red-600">
                <div className="text-red-200 font-medium mb-3">Commentary Slider (Broken)</div>
                <div className="space-y-2 text-sm text-red-300">
                  <div className="bg-red-700/50 p-2 rounded text-xs flex items-center justify-between">
                    <div>
                      <div className="font-medium">Newsweek Quote</div>
                      <div>"For churches that also want to develop..."</div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-4 h-4 bg-red-600 rounded-full opacity-50"></div>
                      <div className="w-4 h-4 bg-red-600 rounded-full opacity-50"></div>
                    </div>
                  </div>
                  <div className="text-center text-red-400 text-xs">
                    Broken slider arrows • All quotes loaded at once
                  </div>
                </div>
              </div>
            </div>


            <div className="text-center bg-red-800/30 rounded-lg p-4 border border-red-500">
              <div className="flex items-center justify-center mb-2">
                <EyeOff className="w-5 h-5 text-red-300 mr-2" />
                <span className="text-lg font-semibold text-red-200">3,000+ additional words</span>
              </div>
              <div className="text-red-300 text-sm">
                All loaded in DOM but hidden with CSS • Broken sliders & pagination • Impacts SEO & Performance
              </div>
            </div>
          </div>
        </div>

        {/* SEO Impact Metrics - Only show when showHidden is true */}
        {showHidden && (
        <div ref={seoImpactRef} className="p-6 border-t border-blue-700/30" style={{ backgroundColor: '#20284e' }}>
          <h3 className="text-xl font-bold mb-1" style={{ color: '#e6e7eb' }}>Business Impact</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-800/30 p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-red-400">-23%</div>
              <div className="text-sm" style={{ color: '#e6e7eb' }}>Page Load Speed</div>
              <div className="text-xs text-blue-300 mt-1">484KB HTML vs 94KB needed</div>
            </div>
            
            <div className="bg-blue-800/30 p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-orange-400">-15%</div>
              <div className="text-sm" style={{ color: '#e6e7eb' }}>SEO Score</div>
              <div className="text-xs text-blue-300 mt-1">Google penalizes hidden content</div>
            </div>
            
            <div className="bg-blue-800/30 p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-400">-85%</div>
              <div className="text-sm" style={{ color: '#e6e7eb' }}>DOM Size Reduction</div>
              <div className="text-xs text-blue-300 mt-1">Reduced bandwidth & memory usage</div>
            </div>
          </div>

          <div className="mt-2 space-y-3">
            {/* Performance Impact Details */}
            <div className="p-4 bg-red-900/30 rounded-lg border border-red-600/50">
              <h5 className="font-semibold text-red-300 mb-2">🚨 Performance Impact Analysis</h5>
              <div className="text-sm text-red-200 space-y-2">
                <div><strong>DOM Bloat:</strong> 203 hidden elements increase initial parsing time by 340ms</div>
                <div><strong>Memory Usage:</strong> 2.4MB additional JavaScript heap size from unused content</div>
                <div><strong>Paint Performance:</strong> Large DOM trees cause layout thrashing and slower repaints</div>
                <div><strong>Network Waste:</strong> 384KB unnecessary HTML transfer on every page load</div>
              </div>
            </div>

            {/* SEO Impact Details */}
            <div className="p-4 bg-orange-900/30 rounded-lg border border-orange-600/50">
              <h5 className="font-semibold text-orange-300 mb-2">📉 SEO & Search Impact</h5>
              <div className="text-sm text-orange-200 space-y-2">
                <div><strong>Google Penalties:</strong> Excessive hidden content flagged as deceptive practice</div>
                <div><strong>Crawl Budget Waste:</strong> Googlebot processes 3,000+ unnecessary words per visit</div>
                <div><strong>Core Web Vitals:</strong> Poor LCP (2.3s vs target 1.2s) due to content blocking render</div>
                <div><strong>Mobile Rankings:</strong> -15% search visibility on mobile due to slow page speed</div>
              </div>
            </div>

            {/* Technical Debt Impact */}
            <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-600/50">
              <h5 className="font-semibold text-purple-300 mb-2">⚙️ Technical Debt Consequences</h5>
              <div className="text-sm text-purple-200 space-y-2">
                <div><strong>Maintenance Burden:</strong> CSS complexity increases with each new press release</div>
                <div><strong>JavaScript Conflicts:</strong> Slider library errors due to DOM manipulation</div>
                <div><strong>Cache Invalidation:</strong> Full page cache busting required for minor content updates</div>
                <div><strong>Developer Experience:</strong> Debugging complexity multiplied by hidden element interactions</div>
              </div>
            </div>

            {/* Comprehensive Solution */}
            <div className="p-4 bg-green-900/30 rounded-lg border border-green-600/50">
              <h5 className="font-semibold text-green-300 mb-3">💡 Comprehensive Solution Strategy</h5>
              
              <div className="space-y-3 text-sm text-green-200">
                <div>
                  <strong className="block">Phase 1: Immediate Performance Wins</strong>
                  <ul className="ml-4 mt-1 space-y-1 list-disc">
                    <li>Implement server-side pagination (10 releases per page)</li>
                    <li>Remove CSS display:none in favor of conditional rendering</li>
                    <li>Add API endpoints for /press/releases?page=1&limit=10</li>
                    <li>Implement URL-based navigation (/press/page/2)</li>
                  </ul>
                </div>

                <div>
                  <strong className="block">Phase 2: Advanced Optimization</strong>
                  <ul className="ml-4 mt-1 space-y-1 list-disc">
                    <li>Lazy loading with Intersection Observer API for infinite scroll</li>
                    <li>JSON API with client-side templating for faster subsequent loads</li>
                    <li>Image lazy loading for press release thumbnails</li>
                    <li>Service Worker caching for offline press archive access</li>
                  </ul>
                </div>

                <div>
                  <strong className="block">Phase 3: Infrastructure & Monitoring</strong>
                  <ul className="ml-4 mt-1 space-y-1 list-disc">
                    <li>CDN edge caching for paginated content with smart invalidation</li>
                    <li>Performance monitoring dashboard tracking LCP, CLS, FID metrics</li>
                    <li>A/B testing framework to measure user engagement improvements</li>
                    <li>Automated lighthouse auditing in CI/CD pipeline</li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-green-600/50">
                  <strong className="text-green-300">Expected Results:</strong>
                  <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
                    <div>• 70% faster page load (0.8s vs 2.3s)</div>
                    <div>• 85% reduction in DOM size</div>
                    <div>• +25% mobile search rankings</div>
                    <div>• 384KB bandwidth savings per page load</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default HiddenContentDemo;