import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RazorpayModal } from './components/RazorpayModal';
import { LoginModal } from './components/LoginModal';
import { EquipmentComparisonModal } from './components/EquipmentComparisonModal';
import { AIFactChecker } from './components/AIFactChecker';

import { LandingPage } from './pages/LandingPage';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { LabourDashboard } from './pages/LabourDashboard';
import { EquipmentHolderDashboard } from './pages/EquipmentHolderDashboard';
import { DealerPage } from './pages/DealerPage';
import { AdminDashboard } from './pages/AdminDashboard';

const MainContent = () => {
  const { activeTab, userRole, isAdminAccessGranted, isDataBlackoutActive, recoveryStatus, isRecoveryDataActive } = useApp();

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      
      case 'dashboard':
      case 'equipment':
      case 'equipment-list':
      case 'equipment-detail':
      case 'comparison':
      case 'history':
      case 'dealer-marketplace':
      case 'bookings':
      case 'location':
      case 'chat':
        if (userRole === 'Farmer') return <FarmerDashboard />;
        if (userRole === 'Labour') return <LabourDashboard />;
        if (userRole === 'EquipmentHolder') return <EquipmentHolderDashboard />;
        if (userRole === 'Dealer') return <DealerPage />;
        return <FarmerDashboard />;

      case 'labour':
      case 'labour-list':
      case 'labour-dashboard':
        return userRole === 'Labour' ? <LabourDashboard /> : <FarmerDashboard />;

      case 'holder-dashboard':
        return <EquipmentHolderDashboard />;

      case 'dealer':
        return <DealerPage />;

      case 'admin-dashboard':
        if (!isAdminAccessGranted) {
          if (userRole === 'Labour') return <LabourDashboard />;
          if (userRole === 'EquipmentHolder') return <EquipmentHolderDashboard />;
          if (userRole === 'Dealer') return <DealerPage />;
          return <FarmerDashboard />;
        }
        return <AdminDashboard />;

      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F4F7F4]">
      <div>
        <Navbar />
        {isDataBlackoutActive && (
          <div className="bg-amber-200 border-b border-amber-300 text-amber-950 text-center text-xs font-bold tracking-wide py-2 px-3 leading-relaxed">
            DATA BLACKOUT ACTIVE — Offline mode enabled.<br />
            Your data is safely preserved locally. No database records were deleted. {isRecoveryDataActive ? '(Recovery snapshot in use)' : ''} {recoveryStatus}
          </div>
        )}
        <main>
          {renderCurrentView()}
        </main>
      </div>

      <Footer />

      {/* Global Modals & Overlay Components */}
      <EquipmentComparisonModal />
      <RazorpayModal />
      <LoginModal />
      <AIFactChecker />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
