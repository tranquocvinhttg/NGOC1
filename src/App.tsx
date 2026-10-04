import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { 
  HelpCircle, 
  Smartphone, 
  Gamepad2, 
  Calculator, 
  CalendarDays, 
  Sparkles, 
  Building2, 
  PhoneCall, 
  ChevronRight,
  ShieldCheck,
  Fuel,
  TrendingUp,
  Percent,
  MapPin,
  Clock
} from 'lucide-react';
import { Header } from './components/Header';
import { FaqGuides } from './components/FaqGuides';
import { DownloadApp } from './components/DownloadApp';
import { GameHub } from './components/MiniGames/GameHub';
import { SavingsCalculator } from './components/SavingsCalculator';
import { LoanRepaymentSchedule } from './components/LoanRepaymentSchedule';
import { FeaturedProducts } from './components/FeaturedProducts';
import { BranchLocations } from './components/BranchLocations';
import { Footer } from './components/Footer';
import contentData from './data/contentData.json';
import { ContentData } from './types';

const data = contentData as ContentData;

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('faq');
  const mainContentRef = useRef<HTMLDivElement | null>(null);

  // GSAP transition when switching tabs
  useEffect(() => {
    if (mainContentRef.current) {
      gsap.fromTo(
        mainContentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-[#003B70] selection:text-white">
      {/* 1. Header with brand identity and 7 tabs navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Top Quick Nav Ribbon for Touch Screens at the Counter */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {data.navigation.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#003B70] text-white shadow-sm ring-2 ring-blue-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-[#003B70]'
                }`}
              >
                <span>{item.title}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Dynamic Content Area */}
      <main ref={mainContentRef} className="flex-1">
        {activeTab === 'faq' && <FaqGuides onBackToMenu={() => setActiveTab('faq')} />}
        {activeTab === 'download-app' && <DownloadApp />}
        {activeTab === 'games' && <GameHub />}
        {activeTab === 'savings' && <SavingsCalculator />}
        {activeTab === 'loan-schedule' && <LoanRepaymentSchedule />}
        {activeTab === 'featured-products' && <FeaturedProducts />}
        {activeTab === 'branches' && <BranchLocations />}
      </main>

      {/* 4. Floating Hotline Button for Quick Assistance at Counter */}
      <aside aria-label="Hỗ trợ nhanh tại quầy" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <a
          href={`tel:${data.brand.advisor.rawPhone}`}
          className="group flex items-center gap-2.5 bg-[#ED1C24] hover:bg-red-700 text-white px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-200 border-2 border-white"
          title={`Gọi hỗ trợ: ${data.brand.advisor.name} (${data.brand.advisor.phone})`}
        >
          <PhoneCall className="w-5 h-5 animate-bounce" />
          <div className="flex flex-col text-left pr-1">
            <span className="text-[10px] font-bold text-red-100 leading-none">Cần hỗ trợ tại quầy?</span>
            <span className="text-xs font-black leading-tight">{data.brand.advisor.phone}</span>
          </div>
        </a>
      </aside>

      {/* 5. Professional Banking Footer */}
      <Footer onSelectTab={(tabId) => setActiveTab(tabId)} />
    </div>
  );
}
