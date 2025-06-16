import React, { useState } from 'react';
import { Code, Copy, CheckCircle } from 'lucide-react';

const QuickFixPreview = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const beforeCode = `<!-- Current Problem: Viewport zoom disabled -->
<meta name="viewport" content="width=device-width, initial-scale=1, 
minimum-scale=1, maximum-scale=1">`;

  const afterCode = `<!-- Simple Solution: Enable mobile user scaling -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- This allows mobile users to pinch-to-zoom for better accessibility -->`;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800 grain-texture">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
          <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
          🛠️ Quick Fix Preview: Enable Mobile Viewport Zoom
        </h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h4 className="font-medium text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            Current Problem
          </h4>
          <div className="relative">
            <pre className="bg-white dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto border border-red-200 dark:border-red-800">
              <code className="text-gray-800 dark:text-gray-200">{beforeCode}</code>
            </pre>
          </div>
          <p className="text-xs text-red-600 dark:text-red-400">
            Prevents mobile users from pinch-to-zoom, harmful for accessibility
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Simple Solution
          </h4>
          <div className="relative">
            <pre className="bg-white dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto border border-green-200 dark:border-green-800">
              <code className="text-gray-800 dark:text-gray-200">{afterCode}</code>
            </pre>
            <button
              onClick={() => copyToClipboard(afterCode)}
              className="absolute top-2 right-2 p-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Copy code"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400">
            Mobile users can now pinch-to-zoom for better readability
          </p>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-blue-200 dark:border-blue-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Implementation Details
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-300">
              Estimated time: 5 minutes • Impact: Mobile accessibility compliance • Difficulty: Minimal
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              WCAG 2.1
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Compliance
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickFixPreview;