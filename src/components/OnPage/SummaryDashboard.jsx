import React from 'react';
import { AlertCircle, Clock, TrendingUp, Wrench, Info } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import Tooltip from '../ui/Tooltip';

const SummaryCard = ({ icon: Icon, value, label, color, delay, decimals = 0, suffix = '', tooltip }) => {
  const colorClasses = {
    green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    red: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    yellow: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-4 text-center hover:scale-105 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md`}>
      <div className="flex justify-center mb-2">
        <div className={`p-2 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-bold">
        <AnimatedNumber 
          value={value} 
          decimals={decimals} 
          delay={delay} 
          suffix={suffix}
          className={color === 'green' ? 'text-green-600 dark:text-green-400' : 
                    color === 'red' ? 'text-red-600 dark:text-red-400' :
                    color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                    color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    'text-purple-600 dark:text-purple-400'}
        />
      </div>
      <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-400 font-medium">
        {label}
        {tooltip && (
          <Tooltip content={tooltip}>
            <Info className="w-3 h-3 opacity-60 hover:opacity-100 transition-opacity" />
          </Tooltip>
        )}
      </div>
    </div>
  );
};

const SummaryDashboard = ({ data }) => {
  const criticalIssues = data.criticalIssues.filter(issue => issue.impact === 'High').length;
  const warnings = data.criticalIssues.filter(issue => issue.impact === 'Medium' || issue.impact === 'Low').length;
  
  // Calculate total technical issues needing attention
  const totalTechnicalIssues = data.criticalIssues.filter(issue => 
    issue.impact === 'High' || issue.impact === 'Medium'
  ).length;
  
  // Calculate pages with major SEO concerns
  const pagesWithIssues = Math.max(
    data.checks.no_image_alt || 0,
    data.checks.has_render_blocking_resources || 0
  );
  
  // Calculate performance impact score
  const performanceImpact = Math.round((100 - data.onpage_score) * 2.5); // Convert to impact percentage

  const technicalTooltip = (
    <div className="space-y-2">
      <h4 className="font-semibold text-white">Technical Issues Breakdown:</h4>
      <p className="text-sm">Main issues affecting site performance:</p>
      <ul className="text-xs space-y-1">
        <li>• Missing alt text: {data.checks.no_image_alt} pages</li>
        <li>• Render blocking resources: {data.checks.has_render_blocking_resources} pages</li>
        <li>• Orphaned pages: {data.checks.is_orphan_page} pages</li>
        <li>• Spelling issues: {data.checks.has_misspelling} pages</li>
      </ul>
      <p className="text-xs font-bold border-t border-gray-600 pt-2">
        Focus on high-impact fixes first
      </p>
    </div>
  );

  const summaryItems = [
    {
      icon: AlertCircle,
      value: criticalIssues,
      label: 'Critical Issues',
      color: 'red',
      delay: 0
    },
    {
      icon: AlertCircle,
      value: warnings,
      label: 'Warnings',
      color: 'yellow',
      delay: 200
    },
    {
      icon: Wrench,
      value: totalTechnicalIssues,
      label: 'Priority Fixes',
      color: 'blue',
      delay: 400,
      tooltip: technicalTooltip
    },
    {
      icon: TrendingUp,
      value: performanceImpact,
      label: 'Impact Score',
      color: 'purple',
      delay: 600,
      suffix: '%'
    }
  ];

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Quick Summary
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Key metrics and potential business impact
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryItems.map((item, index) => (
          <SummaryCard key={index} {...item} />
        ))}
      </div>
      
      <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 rounded-lg border border-violet-200 dark:border-violet-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-violet-800 dark:text-violet-200">
              Priority Action Required
            </h3>
            <p className="text-sm text-violet-700 dark:text-violet-300 mt-1">
              Focus on fixing missing alt text and render-blocking resources first - these affect {pagesWithIssues} pages and impact both accessibility and performance.
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-violet-600 dark:text-violet-400">
              Score: {data.onpage_score}
            </div>
            <div className="text-xs text-violet-500 dark:text-violet-400">
              Current rating
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDashboard;