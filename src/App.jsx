import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RazorpayModal } from './components/RazorpayModal';
import { LoginModal } from './components/LoginModal';
import { EquipmentComparisonModal } from './components/EquipmentComparisonModal';

import { LandingPage } from './pages/LandingPage';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { LabourDashboard } from './pages/LabourDashboard';
import { EquipmentHolderDashboard } from './pages/EquipmentHolderDashboard';
import { DealerPage } from './pages/DealerPage';
import { AdminDashboard } from './pages/AdminDashboard';

const MainContent = () => {
  const { activeTab, userRole } = useApp();

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
        if (userRole === 'Labour') return <LabourDashboard />;
        if (userRole === 'EquipmentHolder') return <EquipmentHolderDashboard />;
        if (userRole === 'Dealer') return <DealerPage />;
        if (userRole === 'Admin') return <AdminDashboard />;
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
        return <AdminDashboard />;

      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F4F7F4]">
      <div>
        <Navbar />
        <main>
          {renderCurrentView()}
        </main>
      </div>

      <Footer />

      {/* Global Modals & Overlay Components */}
      <EquipmentComparisonModal />
      <RazorpayModal />
      <LoginModal />
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
