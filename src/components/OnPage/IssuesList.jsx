import React from 'react';
import { AlertCircle, AlertTriangle, Info, ChevronRight } from 'lucide-react';

const IssueCard = ({ issue, index }) => {
  const priorityConfig = {
    Critical: {
      icon: AlertCircle,
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      iconColor: 'text-red-600 dark:text-red-400',
      textColor: 'text-red-800 dark:text-red-200'
    },
    High: {
      icon: AlertTriangle,
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      iconColor: 'text-orange-600 dark:text-orange-400',
      textColor: 'text-orange-800 dark:text-orange-200'
    },
    Medium: {
      icon: Info,
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      textColor: 'text-yellow-800 dark:text-yellow-200'
    }
  };

  const config = priorityConfig[issue.impact] || priorityConfig.Medium;
  const Icon = config.icon;

  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-4 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${config.bg} ${config.border} border`}>
            <Icon className={`w-4 h-4 ${config.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {issue.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {issue.description}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${config.textColor} ${config.bg} border ${config.border}`}>
            {issue.impact}
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      
      <div className="mt-3 pl-11">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>Business Impact</span>
          <span>Effort: {issue.effort}</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
          {issue.businessImpact}
        </p>
        
        <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-2">
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Recommended Fix:
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {issue.recommendation}
          </div>
        </div>
      </div>
    </div>
  );
};

const IssuesList = ({ issues }) => {
  const sortedIssues = [...issues].sort((a, b) => {
    const priorityOrder = { Critical: 3, High: 2, Medium: 1 };
    return priorityOrder[b.impact] - priorityOrder[a.impact];
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Critical Issues Found
        </h2>
        <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm font-medium">
          {issues.length} Issues
        </div>
      </div>
      
      <div className="space-y-3">
        {sortedIssues.map((issue, index) => (
          <IssueCard key={index} issue={issue} index={index} />
        ))}
      </div>
      
      <div className="bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 border border-violet-200 dark:border-violet-800 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-violet-800 dark:text-violet-200">
              Priority Recommendation
            </h3>
            <div className="mt-1 text-sm text-violet-700 dark:text-violet-300">
              Focus on fixing the CLS issue first - it has the highest impact on user experience and can improve conversions by 15-25%.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuesList;