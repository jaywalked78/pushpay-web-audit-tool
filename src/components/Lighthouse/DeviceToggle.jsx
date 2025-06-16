import React from 'react';

function DeviceToggle({ activeDevice, onDeviceChange }) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onDeviceChange('desktop')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          activeDevice === 'desktop'
            ? 'bg-violet-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        🖥️ Desktop
      </button>
      <button
        onClick={() => onDeviceChange('mobile')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          activeDevice === 'mobile'
            ? 'bg-violet-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        📱 Mobile
      </button>
    </div>
  );
}

export default DeviceToggle;