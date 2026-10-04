import React, { useState, useMemo } from 'react';
import { 
  CalendarDays, 
  Table, 
  Download, 
  HelpCircle, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  TrendingDown, 
  Coins, 
  X, 
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { ContentData } from '../types';

const data = contentData as ContentData;
const loanCfg = data.loans;

interface RepaymentRow {
  period: number;
  paymentDate: string;
  startingBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  remainingBalance: number;
}

export const LoanRepaymentSchedule: React.FC = () => {
  // Inputs per specs
  const [loanAmountStr, setLoanAmountStr] = useState<string>('500,000,000');
  const [loanTermMonths, setLoanTermMonths] = useState<number>(240); // 20 years or custom
  const [annualRate, setAnnualRate] = useState<number>(8.0);
  const [disbursementDateStr, setDisbursementDateStr] = useState<string>('2026-01-10');
  const [cycleId, setCycleId] = useState<string>('monthly');
  const [paymentDay, setPaymentDay] = useState<number>(25);
  const [roundingRule, setRoundingRule] = useState<'dong' | 'thousand'>('thousand');

  // Detailed Modal view state
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [modalPage, setModalPage] = useState<number>(1);
  const rowsPerPage = 12;

  // Clean numeric loan amount
  const numericLoanAmount = useMemo(() => {
    const clean = loanAmountStr.replace(/[^0-9]/g, '');
    return clean ? parseInt(clean, 10) : 0;
  }, [loanAmountStr]);

  // Selected cycle configuration
  const currentCycle = useMemo(() => {
    return loanCfg.cycles.find(c => c.id === cycleId) || loanCfg.cycles[0];
  }, [cycleId]);

  // Total periods count
  const totalPeriods = useMemo(() => {
    return Math.max(1, Math.round(loanTermMonths / currentCycle.stepMonths));
  }, [loanTermMonths, currentCycle.stepMonths]);

  // Generate repayment schedule
  const scheduleData = useMemo(() => {
    if (numericLoanAmount <= 0 || totalPeriods <= 0) {
      return { rows: [] as RepaymentRow[], totalInterest: 0, totalPrincipal: 0, totalPayment: 0 };
    }

    const rows: RepaymentRow[] = [];
    const periodRate = (annualRate / 100) / currentCycle.divisor;

    // Standard principal per period
    const rawPrincipalPerPeriod = numericLoanAmount / totalPeriods;
    let roundedPrincipalPerPeriod = Math.floor(rawPrincipalPerPeriod);

    if (roundingRule === 'thousand') {
      roundedPrincipalPerPeriod = Math.round(rawPrincipalPerPeriod / 1000) * 1000;
    }

    let currentBalance = numericLoanAmount;
    let accumulatedInterest = 0;
    let accumulatedPrincipal = 0;

    // Date generation helper:
    // Disbursement date parsed
    const [dYear, dMonth, dDay] = disbursementDateStr.split('-').map(Number);
    let startDate = new Date(dYear, dMonth - 1, dDay);

    // If disbursement day >= paymentDay, the first payment is scheduled for the next cycle
    for (let i = 1; i <= totalPeriods; i++) {
      const startBalanceForPeriod = currentBalance;
      
      // Calculate payment date
      // Advance by stepMonths each period
      const targetMonthDate = new Date(dYear, (dMonth - 1) + (i * currentCycle.stepMonths), paymentDay);
      // Ensure day handles month end overflow (e.g. Feb 28/29)
      const maxDaysInTargetMonth = new Date(targetMonthDate.getFullYear(), targetMonthDate.getMonth() + 1, 0).getDate();
      const actualDay = Math.min(paymentDay, maxDaysInTargetMonth);
      const actualPaymentDate = new Date(targetMonthDate.getFullYear(), targetMonthDate.getMonth(), actualDay);

      const dateFormatted = `${actualPaymentDate.getDate().toString().padStart(2, '0')}/${(actualPaymentDate.getMonth() + 1).toString().padStart(2, '0')}/${actualPaymentDate.getFullYear()}`;

      // Calculate interest for this period: Dư nợ đầu kỳ × Lãi suất kỳ
      let periodInterest = Math.round(startBalanceForPeriod * periodRate);
      if (roundingRule === 'thousand') {
        periodInterest = Math.round(periodInterest / 1000) * 1000;
      }

      // Principal for this period (last period absorbs any rounding difference)
      let periodPrincipal = roundedPrincipalPerPeriod;
      if (i === totalPeriods) {
        periodPrincipal = currentBalance; // absorb exact remaining
      } else {
        periodPrincipal = Math.min(periodPrincipal, currentBalance);
      }

      const totalPeriodPayment = periodPrincipal + periodInterest;
      const endingBalance = Math.max(0, currentBalance - periodPrincipal);

      rows.push({
        period: i,
        paymentDate: dateFormatted,
        startingBalance: startBalanceForPeriod,
        principal: periodPrincipal,
        interest: periodInterest,
        totalPayment: totalPeriodPayment,
        remainingBalance: endingBalance
      });

      accumulatedInterest += periodInterest;
      accumulatedPrincipal += periodPrincipal;
      currentBalance = endingBalance;
    }

    return {
      rows,
      totalInterest: accumulatedInterest,
      totalPrincipal: accumulatedPrincipal,
      totalPayment: accumulatedPrincipal + accumulatedInterest
    };
  }, [numericLoanAmount, totalPeriods, annualRate, currentCycle, disbursementDateStr, paymentDay, roundingRule]);

  // First & Last Month Summary
  const firstMonthPayment = scheduleData.rows[0]?.totalPayment || 0;
  const lastMonthPayment = scheduleData.rows[scheduleData.rows.length - 1]?.totalPayment || 0;

  const formatVND = (num: number) => new Intl.NumberFormat('vi-VN').format(num);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    if (!rawVal) {
      setLoanAmountStr('');
      return;
    }
    const num = parseInt(rawVal, 10);
    setLoanAmountStr(new Intl.NumberFormat('en-US').format(num));
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'Kỳ,Ngày trả nợ,Dư nợ đầu kỳ,Tiền gốc,Tiền lãi,Tổng thanh toán,Dư nợ còn lại\n';
    const content = scheduleData.rows.map(r => 
      `${r.period},${r.paymentDate},${r.startingBalance},${r.principal},${r.interest},${r.totalPayment},${r.remainingBalance}`
    ).join('\n');
    const blob = new Blob([headers + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Lich_tra_no_VietinBank_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Paginated rows for modal table
  const totalModalPages = Math.ceil(scheduleData.rows.length / rowsPerPage);
  const currentModalRows = scheduleData.rows.slice((modalPage - 1) * rowsPerPage, modalPage * rowsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#003B70] via-[#00529C] to-[#0A66C2] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-blue-100 mb-3 border border-white/20">
            <Coins className="w-3.5 h-3.5 text-amber-300" />
            Minh bạch - Linh hoạt - Tối ưu lãi vay
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2">
            {loanCfg.title}
          </h1>
          <p className="text-sm sm:text-base text-blue-100">
            {loanCfg.methodTitle} - {loanCfg.description}
          </p>
        </div>
      </div>

      {/* Main Grid: Inputs (7) & Summary (5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">
              Thông số khoản vay
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#003B70]">
              Dư nợ giảm dần
            </span>
          </div>

          {/* 1. Số tiền vay (dạng nhập text box, KHÔNG để thanh kéo theo yêu cầu) */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">
              Số tiền vay (VNĐ) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={loanAmountStr}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền vay..."
                className="w-full px-4 py-3 pr-16 rounded-2xl border border-slate-300 font-black text-lg text-[#003B70] focus:border-[#003B70] focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                VND
              </span>
            </div>

            {/* Quick buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[200000000, 500000000, 1000000000, 2000000000, 3000000000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setLoanAmountStr(new Intl.NumberFormat('en-US').format(val))}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-50 hover:text-[#003B70] text-slate-600 transition"
                >
                  {val >= 1000000000 ? `${val / 1000000000} Tỷ` : `${val / 1000000} Triệu`}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Thời gian vay (Tháng) & Lãi suất (%/năm) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Thời gian vay (Tháng) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="420"
                  value={loanTermMonths}
                  onChange={(e) => setLoanTermMonths(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2.5 pr-14 rounded-2xl border border-slate-300 font-bold text-slate-800 focus:border-[#003B70] focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  Tháng
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Tương đương {(loanTermMonths / 12).toFixed(1)} năm ({totalPeriods} kỳ)
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Lãi suất (%/năm) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="25"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 pr-16 rounded-2xl border border-slate-300 font-bold text-slate-800 focus:border-[#003B70] focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  %/năm
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Lãi suất kỳ: {(annualRate / currentCycle.divisor).toFixed(3)}%/{currentCycle.name.toLowerCase()}
              </span>
            </div>
          </div>

          {/* 3. Ngày giải ngân & Chu kỳ trả nợ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Ngày giải ngân <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={disbursementDateStr}
                onChange={(e) => setDisbursementDateStr(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 font-semibold text-slate-800 focus:border-[#003B70] focus:outline-none text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Chu kỳ trả nợ <span className="text-red-500">*</span>
              </label>
              <select
                value={cycleId}
                onChange={(e) => setCycleId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 font-semibold text-slate-800 focus:border-[#003B70] focus:outline-none text-sm bg-white"
              >
                {loanCfg.cycles.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Ngày trả nợ định kỳ & Quy tắc làm tròn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Ngày trả nợ định kỳ
              </label>
              <select
                value={paymentDay}
                onChange={(e) => setPaymentDay(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 font-semibold text-slate-800 focus:border-[#003B70] focus:outline-none text-sm bg-white"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>
                    Ngày {day} hàng tháng
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Quy tắc làm tròn
              </label>
              <select
                value={roundingRule}
                onChange={(e) => setRoundingRule(e.target.value as 'dong' | 'thousand')}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 font-semibold text-slate-800 focus:border-[#003B70] focus:outline-none text-sm bg-white"
              >
                <option value="thousand">Làm tròn đến 1.000 đồng</option>
                <option value="dong">Làm tròn đến đơn vị đồng</option>
              </select>
            </div>
          </div>

          {/* Formula summary note */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">Quy tắc nghiệp vụ ngân hàng:</span>
            <p>• <strong>Gốc trả mỗi kỳ:</strong> Số tiền vay / Tổng số kỳ trả nợ</p>
            <p>• <strong>Lãi kỳ:</strong> Dư nợ đầu kỳ × Lãi suất kỳ (lãi suất năm / {currentCycle.divisor})</p>
            <p>• <strong>Tổng tiền trả kỳ:</strong> Gốc kỳ + Lãi kỳ (tiền trả giảm dần qua từng kỳ)</p>
          </div>
        </div>

        {/* Right Summary Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-b from-[#003B70] to-[#00274D] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Dự tính trả nợ
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
                {totalPeriods} Kỳ thanh toán
              </span>
            </div>

            {/* Repayment Range */}
            <div className="space-y-4 mb-6">
              <div>
                <span className="text-xs text-blue-200 font-medium">Số tiền trả kỳ đầu (cao nhất)</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-300">
                  {formatVND(firstMonthPayment)} <span className="text-sm font-bold text-blue-200">VND</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-blue-200 font-medium">Số tiền trả kỳ cuối (thấp nhất)</span>
                <div className="text-xl sm:text-2xl font-black text-emerald-300">
                  {formatVND(lastMonthPayment)} <span className="text-sm font-bold text-blue-200">VND</span>
                </div>
              </div>
            </div>

            {/* Summary Details */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2.5 mb-6 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Tổng tiền vay gốc:</span>
                <span className="font-bold text-white text-sm">{formatVND(numericLoanAmount)} VND</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Tổng lãi phải trả:</span>
                <span className="font-bold text-amber-300 text-sm">{formatVND(scheduleData.totalInterest)} VND</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                <span className="font-bold text-blue-100">Tổng gốc + Lãi:</span>
                <span className="font-black text-base text-emerald-300">
                  {formatVND(scheduleData.totalPayment)} VND
                </span>
              </div>
            </div>

            {/* Action "Xem chi tiết" as requested in Step 2 of PDF */}
            <button
              onClick={() => {
                setModalPage(1);
                setShowDetailModal(true);
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#ED1C24] hover:bg-red-700 text-white font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2 group"
            >
              <Table className="w-4 h-4" />
              <span>Xem chi tiết lịch trả nợ</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Quick Schedule Preview Snippet */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-800">
                Xem nhanh 3 kỳ đầu tiên
              </h3>
              <span className="text-xs text-slate-400">Đơn vị: VNĐ</span>
            </div>

            <div className="space-y-2">
              {scheduleData.rows.slice(0, 3).map((r) => (
                <div key={r.period} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#003B70]">Kỳ {r.period}</span>
                    <span className="text-slate-400 ml-2">({r.paymentDate})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-800">{formatVND(r.totalPayment)}</span>
                    <div className="text-[10px] text-slate-400">
                      Gốc: {formatVND(r.principal)} | Lãi: {formatVND(r.interest)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* STEP 2 MODAL: Bảng tính lịch trả nợ với dư nợ giảm dần */}
      {showDetailModal && (
        <div 
          onClick={() => setShowDetailModal(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="bg-[#003B70] text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
              <div>
                <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">
                  VietinBank Amortization Schedule
                </div>
                <h3 className="text-lg sm:text-xl font-black">
                  Bảng Tính Lịch Trả Nợ Với Dư Nợ Giảm Dần
                </h3>
                <p className="text-xs text-blue-100 mt-1">
                  Khoản vay {formatVND(numericLoanAmount)} VND • {loanTermMonths} tháng ({totalPeriods} kỳ) • Lãi suất {annualRate}%/năm
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
                  title="Xuất bảng ra tệp CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  Xuất CSV
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Table Area */}
            <div className="overflow-x-auto p-4 sm:p-6 flex-1">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-3 rounded-l-xl">Kỳ</th>
                    <th className="py-3 px-3">Ngày trả nợ</th>
                    <th className="py-3 px-3 text-right">Dư nợ đầu kỳ</th>
                    <th className="py-3 px-3 text-right">Gốc trả</th>
                    <th className="py-3 px-3 text-right">Lãi trả</th>
                    <th className="py-3 px-3 text-right font-black text-[#003B70]">Tổng gốc + Lãi</th>
                    <th className="py-3 px-3 text-right rounded-r-xl">Dư nợ còn lại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentModalRows.map((row) => (
                    <tr key={row.period} className="hover:bg-blue-50/50 transition">
                      <td className="py-3 px-3 font-bold text-[#003B70]">{row.period}</td>
                      <td className="py-3 px-3 text-slate-600 font-medium">{row.paymentDate}</td>
                      <td className="py-3 px-3 text-right text-slate-700">{formatVND(row.startingBalance)}</td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-900">{formatVND(row.principal)}</td>
                      <td className="py-3 px-3 text-right text-amber-700 font-medium">{formatVND(row.interest)}</td>
                      <td className="py-3 px-3 text-right font-black text-[#003B70] bg-blue-50/30">
                        {formatVND(row.totalPayment)}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-600 font-medium">
                        {formatVND(row.remainingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                    <td colSpan={3} className="py-3 px-3 text-left uppercase">Tổng cộng:</td>
                    <td className="py-3 px-3 text-right text-[#003B70]">{formatVND(scheduleData.totalPrincipal)}</td>
                    <td className="py-3 px-3 text-right text-amber-700">{formatVND(scheduleData.totalInterest)}</td>
                    <td className="py-3 px-3 text-right text-emerald-700 text-sm">{formatVND(scheduleData.totalPayment)}</td>
                    <td className="py-3 px-3 text-right">0</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Modal Footer with Pagination */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-500">
                Hiển thị kỳ {(modalPage - 1) * rowsPerPage + 1} - {Math.min(scheduleData.rows.length, modalPage * rowsPerPage)} trên tổng số {scheduleData.rows.length} kỳ
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={modalPage === 1}
                  onClick={() => setModalPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100"
                >
                  Trang trước
                </button>
                <span className="text-xs font-bold text-slate-700">
                  {modalPage} / {totalModalPages}
                </span>
                <button
                  disabled={modalPage === totalModalPages}
                  onClick={() => setModalPage(p => Math.min(totalModalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100"
                >
                  Trang sau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
