import React, { useState } from 'react';
import { 
  PhoneCall, 
  Clock, 
  MapPin, 
  Menu, 
  X, 
  ShieldCheck, 
  ExternalLink,
  HelpCircle,
  Smartphone,
  Gamepad2,
  Calculator,
  CalendarDays,
  Sparkles,
  Building2
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { ContentData } from '../types';

const data = contentData as ContentData;

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(true);

  const getNavIcon = (id: string) => {
    switch (id) {
      case 'faq':
        return <HelpCircle className="w-4 h-4" />;
      case 'download-app':
        return <Smartphone className="w-4 h-4" />;
      case 'games':
        return <Gamepad2 className="w-4 h-4" />;
      case 'savings':
        return <Calculator className="w-4 h-4" />;
      case 'loan-schedule':
        return <CalendarDays className="w-4 h-4" />;
      case 'featured-products':
        return <Sparkles className="w-4 h-4" />;
      case 'branches':
        return <Building2 className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200">
      {/* Top micro bar for banking info & hotline */}
      <div className="bg-[#003B70] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1 font-semibold text-blue-200">
              <Building2 className="w-3.5 h-3.5 text-blue-300" />
              {data.brand.fullName} - {data.brand.branchName}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-300">
              <Clock className="w-3 h-3 text-emerald-400" />
              {data.brand.workingHours.weekdays}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-blue-200">
              Tư vấn viên: <strong className="text-white">{data.brand.advisor.name}</strong>
            </span>
            <a 
              href={`tel:${data.brand.advisor.rawPhone}`}
              className="inline-flex items-center gap-1.5 bg-[#ED1C24] hover:bg-red-700 text-white px-2.5 py-0.5 rounded-full font-bold transition shadow-sm"
              title="Bấm để gọi ngay"
            >
              <PhoneCall className="w-3 h-3 animate-pulse" />
              <span>{data.brand.advisor.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo and title */}
          <div 
            onClick={() => setActiveTab('faq')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {logoLoaded ? (
              <img 
                src={data.brand.logoUrl} 
                alt="VietinBank" 
                onError={() => setLogoLoaded(false)}
                className="h-9 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="w-10 h-10 rounded-lg bg-[#003B70] flex items-center justify-center text-white font-extrabold text-xl shadow">
                  VB
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl tracking-tight text-[#003B70]">VietinBank</span>
                  <span className="text-[10px] text-red-600 font-semibold uppercase tracking-wider">Tây Tiền Giang</span>
                </div>
              </div>
            )}
            <div className="hidden lg:block border-l border-slate-200 pl-3">
              <div className="text-xs font-bold text-[#003B70] uppercase tracking-wide">
                Quầy Giao Dịch Số
              </div>
              <div className="text-[11px] text-slate-500">
                {data.brand.slogan}
              </div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {data.navigation.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-50 text-[#003B70] shadow-xs'
                      : 'text-slate-600 hover:text-[#003B70] hover:bg-slate-50'
                  }`}
                >
                  <span className={isActive ? 'text-[#003B70]' : 'text-slate-400'}>
                    {getNavIcon(item.id)}
                  </span>
                  <span>{item.title}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#003B70] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile menu toggle & Quick Hotline */}
          <div className="flex items-center gap-2 xl:hidden">
            <a
              href={`tel:${data.brand.advisor.rawPhone}`}
              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-1 text-xs font-bold"
            >
              <PhoneCall className="w-4 h-4" />
              <span className="hidden sm:inline">Hotline</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Secondary horizontal navigation for tablets and laptops */}
        <div className="hidden md:flex xl:hidden overflow-x-auto pb-2 gap-1 scrollbar-none border-t border-slate-100 pt-1.5">
          {data.navigation.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  isActive
                    ? 'bg-[#003B70] text-white shadow-sm'
                    : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {getNavIcon(item.id)}
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.navigation.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition ${
                    isActive
                      ? 'border-[#003B70] bg-blue-50/70 text-[#003B70] font-bold'
                      : 'border-slate-100 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-[#003B70] text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {getNavIcon(item.id)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{item.title}</div>
                      <div className="text-xs text-slate-400 font-normal">{item.shortDesc}</div>
                    </div>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Tư vấn viên: {data.brand.advisor.name}</span>
              <a 
                href={`tel:${data.brand.advisor.rawPhone}`} 
                className="font-bold text-red-600 flex items-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                {data.brand.advisor.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
