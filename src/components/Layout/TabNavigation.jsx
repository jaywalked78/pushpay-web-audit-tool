import React, { useEffect } from 'react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const header = document.querySelector('.header-tabs');
      
      if (header) {
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          // Scrolling down - hide header
          header.classList.add('header-hidden');
          header.classList.remove('header-visible');
        } else {
          // Scrolling up - show header
          header.classList.remove('header-hidden');
          header.classList.add('header-visible');
        }
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabClasses = (tabName) => 
    `px-6 py-3 font-semibold rounded-lg text-sm transition-all duration-300 ease-in-out ${
      activeTab === tabName
        ? 'bg-violet-500 text-white shadow-lg transform scale-105'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-102'
    }`;

  return (
    <div className="header-tabs header-visible w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700/60 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-6 py-4">
          <button 
            className={tabClasses('onpage')} 
            onClick={() => onTabChange('onpage')}
          >
            On-Page Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;