import React, { useState } from 'react';

import Header from '../partials/Header';
import TabNavigation from '../components/Layout/TabNavigation';
import OnPageAnalysis from '../components/OnPage/OnPageAnalysis';
import DashboardCard04 from '../partials/dashboard/DashboardCard04';
import DashboardCard05 from '../partials/dashboard/DashboardCard05';
import DashboardCard06 from '../partials/dashboard/DashboardCard06';
import LighthouseScores from '../partials/dashboard/DashboardCard08';
import LighthouseTimeline from '../partials/dashboard/DashboardCard09';
import LighthouseIssues from '../partials/dashboard/DashboardCard11';
import DeviceToggle from '../components/Lighthouse/DeviceToggle';
import ActionableRoadmap from '../components/Lighthouse/ActionableRoadmap';
import MobileDesktopComparison from '../components/Lighthouse/MobileDesktopComparison';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('onpage');
  const [lighthouseDevice, setLighthouseDevice] = useState('desktop');

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header remains for user controls and branding */}
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* New Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content Area */}
      <main className="grow overflow-y-auto bg-gray-100 dark:bg-gray-900">
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          
          {/* On-Page Analysis Tab */}
          {activeTab === 'onpage' && (
            <OnPageAnalysis />
          )}

          {/* Lighthouse Audit Tab */}
          {activeTab === 'lighthouse' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Lighthouse Audit</h1>
                <DeviceToggle 
                  activeDevice={lighthouseDevice} 
                  onDeviceChange={setLighthouseDevice} 
                />
              </div>
              
              {/* Lighthouse Score Cards */}
              <div className="grid grid-cols-12 gap-6 mb-8">
                {/* Lighthouse Scores */}
                <LighthouseScores device={lighthouseDevice} />
                
                {/* Performance Timeline */}
                <LighthouseTimeline device={lighthouseDevice} />
                
                {/* Issues & Opportunities */}
                <LighthouseIssues device={lighthouseDevice} />
              </div>
              
              {/* Mobile vs Desktop Comparison */}
              <div className="grid grid-cols-12 gap-6 mb-8">
                <MobileDesktopComparison />
              </div>
              
              {/* Actionable Roadmap */}
              <ActionableRoadmap device={lighthouseDevice} />
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}

export default Dashboard;