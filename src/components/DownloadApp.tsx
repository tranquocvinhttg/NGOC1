import React, { useState } from 'react';
import { 
  Smartphone, 
  Apple, 
  ExternalLink, 
  QrCode, 
  ShieldCheck, 
  Zap, 
  Percent, 
  Receipt, 
  ArrowRight,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { ContentData } from '../types';

const data = contentData as ContentData;

export const DownloadApp: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopy = (url: string, label: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  // QR code generator using public high-availability qr-code api
  const iosQr = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(data.appDownload.iosUrl)}`;
  const androidQr = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(data.appDownload.androidUrl)}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#003B70] via-[#004b8f] to-[#0A66C2] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 mb-4 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            Ngân hàng số dẫn đầu xu hướng
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {data.appDownload.title}
          </h1>
          <p className="text-base sm:text-lg text-blue-100 leading-relaxed max-w-2xl">
            {data.appDownload.subtitle}
          </p>
        </div>
      </div>

      {/* Main Download Cards with QR Codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* iOS App Store Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-md">
                  <Apple className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">VietinBank iPay cho iOS</h3>
                  <span className="text-xs font-medium text-slate-400">Dành cho iPhone & iPad (App Store)</span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                iOS 12.0+
              </span>
            </div>

            {/* QR Scan Area */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-6 flex flex-col items-center justify-center mb-6">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mb-3">
                <img 
                  src={iosQr} 
                  alt="QR Code iOS" 
                  className="w-40 h-40 object-contain"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <QrCode className="w-4 h-4 text-[#003B70]" />
                Mở camera điện thoại quét để tải ngay
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <a
              href={data.appDownload.iosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Apple className="w-5 h-5" />
              <span>Tải trên App Store</span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>

            <button
              onClick={() => handleCopy(data.appDownload.iosUrl, 'ios')}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 transition"
            >
              {copiedLink === 'ios' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Đã sao chép liên kết App Store</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Sao chép liên kết App Store
                </>
              )}
            </button>
          </div>
        </div>

        {/* Android Google Play Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#003B70] text-white flex items-center justify-center shadow-md">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">VietinBank iPay cho Android</h3>
                  <span className="text-xs font-medium text-slate-400">Samsung, Xiaomi, Oppo,... (Google Play)</span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                Android 7.0+
              </span>
            </div>

            {/* QR Scan Area */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-6 flex flex-col items-center justify-center mb-6">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mb-3">
                <img 
                  src={androidQr} 
                  alt="QR Code Android" 
                  className="w-40 h-40 object-contain"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <QrCode className="w-4 h-4 text-[#003B70]" />
                Mở camera điện thoại quét để tải ngay
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <a
              href={data.appDownload.androidUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-[#003B70] hover:bg-blue-900 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Smartphone className="w-5 h-5" />
              <span>Tải trên Google Play</span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>

            <button
              onClick={() => handleCopy(data.appDownload.androidUrl, 'android')}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 transition"
            >
              {copiedLink === 'android' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Đã sao chép liên kết Google Play</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Sao chép liên kết Google Play
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            Tính năng ưu việt
          </span>
          <h2 className="text-2xl font-extrabold text-[#003B70] mt-1">
            Vì sao nên sử dụng VietinBank iPay Mobile?
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Ứng dụng số được hàng triệu khách hàng tin chọn mỗi ngày với tiện ích vượt trội và độ bảo mật cao nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.appDownload.features.map((feat, index) => {
            const icons = [
              <Zap key="1" className="w-6 h-6 text-amber-500" />,
              <Percent key="2" className="w-6 h-6 text-emerald-500" />,
              <Receipt key="3" className="w-6 h-6 text-blue-500" />,
              <ShieldCheck key="4" className="w-6 h-6 text-purple-500" />
            ];
            return (
              <div 
                key={index}
                className="p-5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center mb-4">
                  {icons[index % icons.length]}
                </div>
                <h4 className="text-base font-bold text-slate-800 mb-2">
                  {feat.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activation Steps */}
      <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-3xl p-6 sm:p-8 border border-blue-100">
        <h3 className="text-lg font-bold text-[#003B70] mb-4 flex items-center gap-2">
          <span>3 Bước kích hoạt nhanh chóng ngay tại quầy giao dịch</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
            <span className="w-8 h-8 rounded-full bg-[#003B70] text-white flex items-center justify-center font-bold text-xs shrink-0">
              1
            </span>
            <div>
              <div className="font-bold text-sm text-slate-800">Tải & Cài đặt App</div>
              <div className="text-xs text-slate-500 mt-1">Quét mã QR phía trên để tải về điện thoại chỉ trong 30 giây.</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
            <span className="w-8 h-8 rounded-full bg-[#003B70] text-white flex items-center justify-center font-bold text-xs shrink-0">
              2
            </span>
            <div>
              <div className="font-bold text-sm text-slate-800">Đăng ký & eKYC</div>
              <div className="text-xs text-slate-500 mt-1">Nhập số điện thoại, chụp CCCD gắn chip và quét sinh trắc học khuôn mặt.</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
            <span className="w-8 h-8 rounded-full bg-[#003B70] text-white flex items-center justify-center font-bold text-xs shrink-0">
              3
            </span>
            <div>
              <div className="font-bold text-sm text-slate-800">Trải nghiệm ngay</div>
              <div className="text-xs text-slate-500 mt-1">Chuyển tiền, mở sổ tiết kiệm hoặc quét mã VietQR thanh toán 0 đồng phí.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
