/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ClaimsSection } from './components/ClaimsSection';
import { NewsSection } from './components/NewsSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingBotButton } from './components/FloatingBotButton';
import { ClaimBotModal } from './components/ClaimBotModal';
import { AdminPanelModal } from './components/AdminPanelModal';

export default function App() {
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [newsRefreshKey, setNewsRefreshKey] = useState(0);

  const handleOpenBot = () => {
    setIsBotOpen(true);
  };

  const handleCloseBot = () => {
    setIsBotOpen(false);
  };

  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
  };

  const handleNewsUpdated = () => {
    setNewsRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800 antialiased">
      {/* Top Institutional Navigation Bar */}
      <Navbar onOpenBot={handleOpenBot} onOpenAdmin={handleOpenAdmin} />

      {/* Main Single Page Content */}
      <main className="flex-1 bg-white">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. ¿Qué hacemos? - Grid of 8 Services */}
        <ServicesSection />

        {/* 3. Consultas y Reclamos - 'Estamos para escucharte' Form */}
        <ClaimsSection onOpenBot={handleOpenBot} />

        {/* 4. Novedades y Actividades - Generic Cards + Vaccination */}
        <NewsSection onOpenAdmin={handleOpenAdmin} refreshKey={newsRefreshKey} />

        {/* 5. Sobre la Delegación - Identity & Localities */}
        <AboutSection />

        {/* 6. Contacto y Horarios - Physical Address, Map, Hours, Direct Telephones */}
        <ContactSection onOpenBot={handleOpenBot} />
      </main>

      {/* Institutional Footer */}
      <Footer onOpenBot={handleOpenBot} onOpenAdmin={handleOpenAdmin} />

      {/* Floating Interactive Bot Button */}
      <FloatingBotButton onOpenBot={handleOpenBot} />

      {/* Interactive Conversational Claim & Consultation Bot Modal */}
      <ClaimBotModal
        isOpen={isBotOpen}
        onClose={handleCloseBot}
      />

      {/* Admin Panel Modal (PIN: 1422) for Claims and News */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
        onNewsUpdated={handleNewsUpdated}
      />
    </div>
  );
}
