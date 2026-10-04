import React from 'react';
import { PhoneCall, Clock, ShieldCheck, MapPin, Building2, ExternalLink } from 'lucide-react';
import contentData from '../data/contentData.json';
import { ContentData } from '../types';

const data = contentData as ContentData;

export const Footer: React.FC<{ onSelectTab: (tabId: string) => void }> = ({ onSelectTab }) => {
  return (
    <footer className="bg-[#00274D] text-slate-300 text-xs border-t border-blue-950 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-base">
              <span className="text-red-500">VietinBank</span>
              <span className="text-slate-400 font-normal">| {data.brand.branchName}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {data.brand.fullName} - Điểm tựa tài chính tin cậy của Quý khách hàng cá nhân và doanh nghiệp.
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              {data.brand.slogan}
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-sm">Tính năng chính</h4>
            <ul className="space-y-1.5">
              {data.navigation.slice(0, 5).map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onSelectTab(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-400 hover:text-white transition text-xs"
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Consultant & Support Hotline */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-sm">Hỗ trợ khách hàng</h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block">Chuyên viên tư vấn:</span>
                <span className="font-bold text-white">{data.brand.advisor.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Hotline trực tiếp:</span>
                <a 
                  href={`tel:${data.brand.advisor.rawPhone}`}
                  className="font-extrabold text-red-400 hover:text-red-300 flex items-center gap-1 mt-0.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  {data.brand.advisor.phone}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block">Tổng đài CSKH 24/7:</span>
                <a 
                  href={`tel:${data.brand.advisor.hotline.replace(/\s+/g, '')}`}
                  className="font-bold text-blue-300 hover:underline"
                >
                  {data.brand.advisor.hotline}
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Working Hours */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-sm">Thời gian làm việc</h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-start gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Thứ 2 đến Thứ 6:<br />Sáng 07:30 - 11:30 | Chiều 13:30 - 16:30</span>
              </div>
              <div className="text-amber-300 pt-1">
                • Thứ 7 & Chủ nhật: Nghỉ giao dịch
              </div>
              <div className="pt-2 text-[11px] text-slate-500">
                Ứng dụng VietinBank iPay hoạt động 24/7 không gián đoạn
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Ngân hàng TMCP Công Thương Việt Nam (VietinBank). Quầy Giao Dịch Số.
          </div>
          <div className="flex items-center gap-4">
            <span>Bảo mật chuẩn quốc tế</span>
            <span>Xác thực sinh trắc học eKYC</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
