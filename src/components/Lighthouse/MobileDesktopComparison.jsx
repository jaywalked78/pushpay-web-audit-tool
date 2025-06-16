import React from 'react';
import { lighthouseData } from '../../data/lighthouseData';

function MobileDesktopComparison() {
  const desktopData = lighthouseData.desktop;
  const mobileData = lighthouseData.mobile;

  const ComparisonBar = ({ label, desktopValue, mobileValue, unit = '', format = 'score', reverse = false }) => {
    let desktopPercent, mobilePercent, desktopColor, mobileColor;

    if (format === 'score') {
      // For scores (0-100)
      desktopPercent = desktopValue;
      mobilePercent = mobileValue;
      desktopColor = desktopValue >= 90 ? '#10b981' : desktopValue >= 50 ? '#f59e0b' : '#ef4444';
      mobileColor = mobileValue >= 90 ? '#10b981' : mobileValue >= 50 ? '#f59e0b' : '#ef4444';
    } else if (format === 'time') {
      // For time metrics (normalize to show relative badness)
      const maxValue = Math.max(desktopValue, mobileValue, 5000); // Cap at 5s for visualization
      desktopPercent = (desktopValue / maxValue) * 100;
      mobilePercent = (mobileValue / maxValue) * 100;
      desktopColor = desktopValue <= 1000 ? '#10b981' : desktopValue <= 2500 ? '#f59e0b' : '#ef4444';
      mobileColor = mobileValue <= 1000 ? '#10b981' : mobileValue <= 2500 ? '#f59e0b' : '#ef4444';
    } else if (format === 'cls') {
      // For CLS (normalize to 0.6 max for visualization)
      desktopPercent = Math.min((desktopValue / 0.6) * 100, 100);
      mobilePercent = Math.min((mobileValue / 0.6) * 100, 100);
      desktopColor = desktopValue <= 0.1 ? '#10b981' : desktopValue <= 0.25 ? '#f59e0b' : '#ef4444';
      mobileColor = mobileValue <= 0.1 ? '#10b981' : mobileValue <= 0.25 ? '#f59e0b' : '#ef4444';
    }

    const getStatusLabel = (value, format) => {
      if (format === 'score') {
        return value >= 90 ? 'Excellent' : value >= 50 ? 'Opportunity' : 'High Impact';
      } else if (format === 'time') {
        return value <= 1000 ? 'Excellent' : value <= 2500 ? 'Opportunity' : 'High Impact';
      } else if (format === 'cls') {
        return value <= 0.1 ? 'Excellent' : value <= 0.25 ? 'Opportunity' : 'High Impact';
      }
    };

    const formatValue = (value, format, unit) => {
      if (format === 'time') {
        return value >= 1000 ? `${(value / 1000).toFixed(1)}s` : `${value}ms`;
      } else if (format === 'cls') {
        return value.toFixed(3);
      }
      return `${value}${unit}`;
    };

    return (
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">{label}</h4>
        
        {/* Desktop */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">🖥️ Desktop</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {formatValue(desktopValue, format, unit)}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                getStatusLabel(desktopValue, format) === 'Excellent' ? 'bg-green-100 text-green-800' :
                getStatusLabel(desktopValue, format) === 'Opportunity' ? 'bg-blue-100 text-blue-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {getStatusLabel(desktopValue, format)}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
            <div 
              className="h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${desktopPercent}%`,
                backgroundColor: desktopColor
              }}
            />
          </div>
        </div>

        {/* Mobile */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">📱 Mobile</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {formatValue(mobileValue, format, unit)}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                getStatusLabel(mobileValue, format) === 'Excellent' ? 'bg-green-100 text-green-800' :
                getStatusLabel(mobileValue, format) === 'Opportunity' ? 'bg-blue-100 text-blue-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {getStatusLabel(mobileValue, format)}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
            <div 
              className="h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${mobilePercent}%`,
                backgroundColor: mobileColor
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const getWorstMetric = () => {
    const mobileLCPRatio = mobileData.metrics.lcp / desktopData.metrics.lcp;
    const mobileTBTRatio = mobileData.metrics.tbt === 0 ? 1 : mobileData.metrics.tbt / Math.max(desktopData.metrics.tbt, 1);
    
    if (mobileLCPRatio >= mobileTBTRatio) {
      return {
        metric: 'LCP (Load Time)',
        desktop: `${(desktopData.metrics.lcp / 1000).toFixed(1)}s`,
        mobile: `${(mobileData.metrics.lcp / 1000).toFixed(1)}s`,
        ratio: `${mobileLCPRatio.toFixed(1)}x slower`,
        impact: 'Mobile users experience longer content loading times'
      };
    } else {
      return {
        metric: 'TBT (Interactivity)',
        desktop: `${desktopData.metrics.tbt}ms`,
        mobile: `${mobileData.metrics.tbt}ms`,
        ratio: `${mobileTBTRatio.toFixed(1)}x difference`,
        impact: 'Mobile interactivity has optimization potential'
      };
    }
  };

  const worstMetric = getWorstMetric();

  return (
    <div className="col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Mobile vs Desktop Performance</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Visual comparison reveals the mobile performance crisis affecting 60% of traffic
        </p>
      </header>
      
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Performance Scores */}
          <div>
            <ComparisonBar
              label="Overall Performance Score"
              desktopValue={desktopData.scores.performance}
              mobileValue={mobileData.scores.performance}
              format="score"
            />
            
            <ComparisonBar
              label="Largest Contentful Paint (LCP)"
              desktopValue={desktopData.metrics.lcp}
              mobileValue={mobileData.metrics.lcp}
              format="time"
            />
            
            <ComparisonBar
              label="Cumulative Layout Shift (CLS)"
              desktopValue={desktopData.metrics.cls}
              mobileValue={mobileData.metrics.cls}
              format="cls"
            />
          </div>

          {/* Key Insights */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Key Insights</h3>
            
            {/* Priority Optimization Callout */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">🎯 Priority Optimization</h4>
              <div className="text-sm text-blue-700 dark:text-blue-400">
                <div className="mb-2">
                  <strong>{worstMetric.metric}:</strong> Mobile is {worstMetric.ratio}
                </div>
                <div className="text-xs bg-blue-100 dark:bg-blue-800/30 p-2 rounded">
                  Desktop: {worstMetric.desktop} → Mobile: {worstMetric.mobile}
                </div>
                <div className="mt-2 text-xs">
                  <strong>Impact:</strong> {worstMetric.impact}
                </div>
              </div>
            </div>

            {/* Quick Wins */}
            <div className="space-y-3">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                <h5 className="font-medium text-yellow-800 dark:text-yellow-300 text-sm mb-1">⚡ Quick Fix #1</h5>
                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                  Remove lazy loading from main content = 2.4s faster mobile loading
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <h5 className="font-medium text-blue-800 dark:text-blue-300 text-sm mb-1">🎯 Business Impact</h5>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  60% of visitors use mobile - optimizing mobile experience = $180k revenue opportunity
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <h5 className="font-medium text-green-800 dark:text-green-300 text-sm mb-1">💡 Strategic Opportunity</h5>
                <p className="text-xs text-green-700 dark:text-green-400">
                  Create "Mobile Health Check" service for BDR's 10,000+ contractor members
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
              📊 Mobile Optimization Opportunity
            </h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-100">Desktop Users</div>
                <div className="text-gray-600 dark:text-gray-400">See content in 1.1s, stable layout</div>
                <div className="text-green-600 font-medium">✅ Optimized Experience</div>
              </div>
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-100">Mobile Users (60%)</div>
                <div className="text-gray-600 dark:text-gray-400">4.2s load time, layout adjustment needed</div>
                <div className="text-orange-600 font-medium">⚡ Optimization Opportunity</div>
              </div>
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-100">After Optimization</div>
                <div className="text-gray-600 dark:text-gray-400">1.5s load time, stable mobile layout</div>
                <div className="text-blue-600 font-medium">🚀 $180k Recovery</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileDesktopComparison;