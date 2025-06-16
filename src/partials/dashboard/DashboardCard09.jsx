import React from 'react';
import { lighthouseData, performanceTimeline } from '../../data/lighthouseData';

function LighthouseTimeline({ device = 'desktop' }) {
  const timeline = performanceTimeline[device];
  const metrics = lighthouseData[device].metrics;

  const getMetricColor = (time) => {
    if (device === 'desktop') {
      if (time <= 1000) return '#10b981'; // Green
      if (time <= 2500) return '#f59e0b'; // Orange
      return '#ef4444'; // Red
    } else {
      if (time <= 2500) return '#10b981'; // Green
      if (time <= 4000) return '#f59e0b'; // Orange
      return '#ef4444'; // Red
    }
  };

  const formatTime = (ms) => {
    if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
    return `${ms}ms`;
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Performance Timeline</h2>
      </header>
      
      <div className="p-6">
        {/* Core Web Vitals Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1" style={{ color: getMetricColor(metrics.lcp) }}>
              {formatTime(metrics.lcp)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">LCP</div>
            <div className="text-xs text-gray-500">Largest Contentful Paint</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold mb-1" style={{ color: metrics.cls > 0.1 ? '#ef4444' : '#10b981' }}>
              {metrics.cls.toFixed(3)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">CLS</div>
            <div className="text-xs text-gray-500">Cumulative Layout Shift</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold mb-1" style={{ color: getMetricColor(metrics.tbt) }}>
              {formatTime(metrics.tbt)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">TBT</div>
            <div className="text-xs text-gray-500">Total Blocking Time</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold mb-1" style={{ color: getMetricColor(metrics.tti) }}>
              {formatTime(metrics.tti)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">TTI</div>
            <div className="text-xs text-gray-500">Time to Interactive</div>
          </div>
        </div>
        
        {/* Timeline Visualization */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Loading Timeline</h3>
          <div className="space-y-3">
            {timeline.map((event, index) => (
              <div key={index} className="flex items-center">
                <div className="w-20 text-sm text-gray-600 dark:text-gray-400">
                  {formatTime(event.time)}
                </div>
                <div className="flex-1 mx-3">
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        backgroundColor: event.color,
                        width: `${Math.min((event.time / Math.max(...timeline.map(t => t.time))) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
                <div className="w-32 text-sm font-medium text-gray-800 dark:text-gray-100">
                  {event.name}
                </div>
              </div>
            ))}
          </div>
          
          {device === 'desktop' && metrics.ttfb > 100 && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-start">
                <div className="text-yellow-600 dark:text-yellow-400 mr-2">⚠️</div>
                <div>
                  <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Redirect Chain Detected
                  </div>
                  <div className="text-xs text-yellow-700 dark:text-yellow-300">
                    470ms delay from redirect chain - consider direct serving
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LighthouseTimeline;
