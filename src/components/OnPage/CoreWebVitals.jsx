import React from 'react';
import { Clock, Zap, Move } from 'lucide-react';

const MetricCard = ({ icon: Icon, title, value, unit, status, threshold, description }) => {
  const statusColors = {
    good: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-700 dark:text-green-400',
      icon: 'text-green-600 dark:text-green-400'
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-700 dark:text-yellow-400',
      icon: 'text-yellow-600 dark:text-yellow-400'
    },
    'needs-improvement': {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-700 dark:text-red-400',
      icon: 'text-red-600 dark:text-red-400'
    }
  };

  const colors = statusColors[status];

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-lg p-4 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${colors.bg} ${colors.border} border`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${colors.text} ${colors.bg} border ${colors.border}`}>
          {status === 'needs-improvement' ? 'Needs Improvement' : status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
      
      <div className="mt-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        <div className="mt-1">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{unit}</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Threshold: {threshold}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
          {description}
        </p>
      </div>
    </div>
  );
};

const CoreWebVitals = ({ data }) => {
  // Calculate status based on thresholds
  const getLCPStatus = (value) => {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'warning';
    return 'needs-improvement';
  };

  const getFIDStatus = (value) => {
    if (value <= 100) return 'good';
    if (value <= 300) return 'warning';
    return 'needs-improvement';
  };

  const getCLSStatus = (value) => {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'warning';
    return 'needs-improvement';
  };

  const metrics = [
    {
      icon: Clock,
      title: 'Largest Contentful Paint',
      value: data.largest_contentful_paint,
      unit: 'ms',
      status: getLCPStatus(data.largest_contentful_paint),
      threshold: '≤ 2.5s',
      description: 'Time until the largest element is rendered'
    },
    {
      icon: Zap,
      title: 'First Input Delay',
      value: data.first_input_delay.toFixed(1),
      unit: 'ms',
      status: getFIDStatus(data.first_input_delay),
      threshold: '≤ 100ms',
      description: 'Time until the page becomes interactive'
    },
    {
      icon: Move,
      title: 'Cumulative Layout Shift',
      value: data.cumulative_layout_shift.toFixed(3),
      unit: '',
      status: getCLSStatus(data.cumulative_layout_shift),
      threshold: '≤ 0.1',
      description: 'Visual stability of page elements'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Core Web Vitals</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Real user experience metrics
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Performance Impact
            </h3>
            <div className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              Your CLS score needs attention. Layout shifts can cause users to accidentally click wrong elements, impacting conversions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreWebVitals;