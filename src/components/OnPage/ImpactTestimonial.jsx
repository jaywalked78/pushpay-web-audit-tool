import React from 'react';
import { Quote, ExternalLink, TrendingUp } from 'lucide-react';

const ImpactTestimonial = () => {
  return (
    <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white rounded-lg p-6 relative overflow-hidden border border-slate-600">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Quote className="w-6 h-6" />
            </div>
          </div>
          
          <div className="flex-1">
            <blockquote className="text-lg font-medium leading-relaxed mb-4">
              "Pushpay's accessibility improvements could significantly enhance 
              <span className="font-bold text-blue-300"> user experience and SEO rankings</span>. 
              Vodafone's Web Vitals optimization achieved an 
              <span className="font-bold text-blue-300"> 8% increase in sales</span>, while 
              <span className="font-bold text-blue-300"> 73.4% of websites experienced traffic growth </span>
              after implementing accessibility features."
            </blockquote>
            
            <div className="flex items-center justify-between">
              <cite className="text-sm opacity-90 not-italic">
                <div className="font-medium">Vodafone A/B Test & AccessibilityChecker.org Study</div>
                <div className="text-xs opacity-75">2024 Performance & Accessibility Impact Studies</div>
              </cite>
              
              <div className="flex items-center gap-2">
                <a 
                  href="https://www.rumvision.com/blog/benefits-of-optimizing-core-web-vitals/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
                >
                  <span>Vodafone</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a 
                  href="https://www.conductor.com/academy/organic-website-traffic-industry-benchmarks/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
                >
                  <span>Accessibility</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="grid grid-cols-2 gap-6">
            {/* Vodafone Case Study */}
            <div className="text-center bg-blue-900/20 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-300 mb-2">Vodafone A/B Test Results</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xl font-bold text-blue-300">8%</div>
                  <div className="text-xs opacity-75">Sales Increase</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-300">31%</div>
                  <div className="text-xs opacity-75">LCP Improvement</div>
                </div>
              </div>
            </div>
            
            {/* Accessibility Study */}
            <div className="text-center bg-green-900/20 rounded-lg p-4">
              <div className="text-sm font-medium text-green-300 mb-2">AccessibilityChecker.org Study</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xl font-bold text-green-300">73%</div>
                  <div className="text-xs opacity-75">Sites See Growth</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-300">12%</div>
                  <div className="text-xs opacity-75">Avg Traffic Increase</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactTestimonial;