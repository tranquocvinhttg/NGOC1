import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Coins, 
  TrendingUp, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2, 
  Video, 
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { ContentData } from '../types';

const data = contentData as ContentData;
const svData = data.savings;

export const SavingsCalculator: React.FC = () => {
  // Input states
  const [amountStr, setAmountStr] = useState<string>('100,000,000');
  const [selectedMonths, setSelectedMonths] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(5.2);
  
  // Touched states for strict validation display
  const [amountTouched, setAmountTouched] = useState<boolean>(false);
  const [rateTouched, setRateTouched] = useState<boolean>(false);

  // Parse numeric amount
  const numericAmount = useMemo(() => {
    const clean = amountStr.replace(/[^0-9]/g, '');
    return clean ? parseInt(clean, 10) : 0;
  }, [amountStr]);

  // Validation rules per PDF
  const isAmountValid = numericAmount >= svData.minAmount;
  const isRateValid = interestRate >= 0 && interestRate <= 15;
  const isTermValid = selectedMonths > 0;

  // Real-time calculation: Tiền gửi thông thường trả lãi sau
  // Lãi = Số tiền * (Lãi suất / 100) * (Số tháng / 12)
  const interestEarned = useMemo(() => {
    if (!isAmountValid || !isRateValid || !isTermValid) return 0;
    return Math.round(numericAmount * (interestRate / 100) * (selectedMonths / 12));
  }, [numericAmount, interestRate, selectedMonths, isAmountValid, isRateValid, isTermValid]);

  const totalPayout = numericAmount + interestEarned;

  // Format currency VND
  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountTouched(true);
    // Disallow non-numeric characters completely
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    if (!rawVal) {
      setAmountStr('');
      return;
    }
    const num = parseInt(rawVal, 10);
    setAmountStr(new Intl.NumberFormat('en-US').format(num));
  };

  const handleTermSelect = (termMonths: number, defaultRate: number) => {
    setSelectedMonths(termMonths);
    setInterestRate(defaultRate);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003B70] via-[#00529C] to-[#0A66C2] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-blue-100 mb-3 border border-white/20">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Sinh lời tối đa - An tâm vững bền
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2">
            {svData.title}
          </h1>
          <p className="text-sm sm:text-base text-blue-100">
            {svData.subtitle}
          </p>
        </div>
      </div>

      {/* Main Calculation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Thông tin tiền gửi</span>
            <span className="text-xs font-semibold text-slate-400">Trả lãi cuối kỳ</span>
          </h2>

          {/* Input 1: Số tiền gửi */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700">
                Tiền gửi dự tính <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-400 font-medium">Tối thiểu: 1.000.000 VND</span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={amountStr}
                onChange={handleAmountChange}
                onBlur={() => setAmountTouched(true)}
                placeholder="Nhập số tiền gửi (VNĐ)"
                className={`w-full px-4 py-3.5 pr-16 rounded-2xl border text-base sm:text-lg font-extrabold transition focus:outline-none ${
                  amountTouched && !isAmountValid
                    ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-2 focus:ring-red-400'
                    : 'border-slate-300 bg-white text-[#003B70] focus:border-[#003B70] focus:ring-2 focus:ring-blue-100'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                VND
              </span>
            </div>

            {/* Error prompt per PDF */}
            {amountTouched && !isAmountValid && (
              <p className="text-xs font-semibold text-red-600 flex items-center gap-1 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5" />
                {svData.errorAmount}
              </p>
            )}

            {/* Quick Amount Suggestion Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[20000000, 50000000, 100000000, 300000000, 500000000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setAmountStr(new Intl.NumberFormat('en-US').format(val));
                    setAmountTouched(true);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-50 hover:text-[#003B70] text-slate-600 transition"
                >
                  +{formatVND(val)}
                </button>
              ))}
            </div>
          </div>

          {/* Input 2: Kỳ hạn gửi */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700">
                Kỳ hạn (Tháng) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-blue-600 font-semibold">Đang chọn: {selectedMonths} tháng</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {svData.presetTerms.map((t) => {
                const isSelected = selectedMonths === t.months;
                return (
                  <button
                    key={t.months}
                    type="button"
                    onClick={() => handleTermSelect(t.months, t.rate)}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-[#003B70] bg-blue-50/70 text-[#003B70] font-bold shadow-xs ring-1 ring-[#003B70]'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold">{t.label}</span>
                    <span className={`text-[11px] mt-0.5 ${isSelected ? 'text-red-600 font-extrabold' : 'text-slate-400'}`}>
                      {t.rate}%/năm
                    </span>
                  </button>
                );
              })}
            </div>

            {!isTermValid && (
              <p className="text-xs font-semibold text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {svData.errorTerm}
              </p>
            )}
          </div>

          {/* Input 3: Lãi suất */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700">
                Lãi suất (%/năm) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-400 font-medium">Biên độ chuẩn: 0.1% - 15.0%</span>
            </div>

            <div className="relative">
              <input
                type="number"
                step="0.05"
                min="0"
                max="15"
                value={interestRate}
                onChange={(e) => {
                  setRateTouched(true);
                  setInterestRate(parseFloat(e.target.value) || 0);
                }}
                onBlur={() => setRateTouched(true)}
                className={`w-full px-4 py-3 pr-16 rounded-2xl border text-base font-bold transition focus:outline-none ${
                  rateTouched && !isRateValid
                    ? 'border-red-400 bg-red-50/40 text-red-900'
                    : 'border-slate-300 bg-white text-slate-800 focus:border-[#003B70]'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                %/năm
              </span>
            </div>

            {rateTouched && !isRateValid && (
              <p className="text-xs font-semibold text-red-600 flex items-center gap-1 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5" />
                {svData.errorRate}
              </p>
            )}
          </div>
        </div>

        {/* Right Calculation Result Display (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Result Card */}
          <div className="bg-gradient-to-b from-[#003B70] to-[#00274D] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Kết quả dự tính
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {selectedMonths} Tháng
              </span>
            </div>

            {/* Interest Profit */}
            <div className="space-y-1 mb-6">
              <span className="text-xs text-blue-200 font-medium">Tiền lãi dự tính</span>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                {formatVND(interestEarned)} <span className="text-lg font-bold text-blue-200">VND</span>
              </div>
            </div>

            {/* Total Balance at Maturity */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3 mb-6">
              <div className="flex justify-between items-center text-xs">
                <span className="text-blue-200">Tiền gửi gốc:</span>
                <span className="font-bold text-white text-sm">{formatVND(numericAmount)} VND</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-blue-200">Lãi suất áp dụng:</span>
                <span className="font-bold text-yellow-300 text-sm">{interestRate}% / năm</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs font-bold text-blue-100">Tổng tiền nhận (Gốc + Lãi):</span>
                <span className="font-extrabold text-base sm:text-lg text-emerald-300">
                  {formatVND(totalPayout)} VND
                </span>
              </div>
            </div>

            <div className="text-[11px] text-blue-200/80 leading-relaxed">
              * Bảng tính mang tính chất tham khảo. Lãi suất thực tế có thể cao hơn khi gửi online trên App VietinBank iPay hoặc theo các chương trình ưu đãi hiện hành.
            </div>
          </div>

          {/* TikTok Tutorial Video Card per PDF */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-2">
                <Video className="w-4 h-4" />
                <span>Video Hướng Dẫn</span>
              </div>
              <h3 className="font-bold text-base text-slate-800 mb-1">
                Hướng dẫn gửi tiết kiệm VietinBank
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Xem clip hướng dẫn thao tác gửi tiết kiệm online trên ứng dụng VietinBank iPay để hưởng lãi suất cao nhất.
              </p>
            </div>

            <a
              href={svData.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Video className="w-4 h-4 text-rose-400" />
              <span>Xem video hướng dẫn trên TikTok</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
