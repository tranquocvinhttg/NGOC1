import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  Clock, 
  ExternalLink, 
  Search, 
  Navigation, 
  CheckCircle2, 
  Maximize2,
  X,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { ContentData, BranchItem } from '../types';

const data = contentData as ContentData;
const branchData = data.branches;

export const BranchLocations: React.FC = () => {
  const [selectedBranchId, setSelectedBranchId] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filteredBranches = branchData.items.filter(b => 
    b.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedBranch = branchData.items.find(b => b.id === selectedBranchId) || branchData.items[0];

  const handleCopyAddress = (b: BranchItem) => {
    navigator.clipboard.writeText(`${b.room} - ${b.address}`);
    setCopiedId(b.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003B70] via-[#00529C] to-[#0A66C2] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-blue-100 mb-3 border border-white/20">
            <Building2 className="w-3.5 h-3.5 text-blue-300" />
            Mạng lưới phục vụ chuyên nghiệp
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            {branchData.title}
          </h1>
          <p className="text-sm sm:text-base text-blue-100">
            {branchData.subtitle}
          </p>

          {/* Working hours banner on top */}
          <div className="mt-4 pt-4 border-t border-white/15 flex flex-wrap items-center gap-4 text-xs text-blue-100">
            <span className="flex items-center gap-1.5 font-bold text-emerald-300">
              <Clock className="w-4 h-4" />
              {branchData.workingHours.title}:
            </span>
            <span>{branchData.workingHours.details[0]}</span>
            <span className="text-amber-300">({branchData.workingHours.details[1]})</span>
          </div>
        </div>
      </div>

      {/* Search & Counter Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên PGD hoặc địa chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-xs sm:text-sm focus:border-[#003B70] focus:ring-2 focus:ring-blue-100 focus:outline-none bg-white shadow-xs"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500 self-end sm:self-auto">
          Tổng cộng: <strong className="text-[#003B70]">{branchData.items.length} Điểm giao dịch</strong>
        </div>
      </div>

      {/* Main Grid: Left Detailed Selected Branch View (5 cols) & Right List of Cards (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Selected Branch Detail Spotlight (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden sticky top-24">
          <div className="relative bg-slate-100 h-56 sm:h-64 flex items-center justify-center overflow-hidden group">
            <img
              src={selectedBranch.cleanImageUrl}
              alt={selectedBranch.room}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                // Fallback placeholder if image load fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-600 w-fit mb-1 shadow-xs">
                {selectedBranch.isHeadquarter ? 'Hội Sở Chi Nhánh' : 'Phòng Giao Dịch'}
              </span>
              <h3 className="text-xl font-extrabold text-white">
                {selectedBranch.room}
              </h3>
            </div>
            <button
              onClick={() => setPreviewImage(selectedBranch.cleanImageUrl)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 text-white hover:bg-black transition"
              title="Xem ảnh chi nhánh"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Address with Google Maps button */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Địa chỉ giao dịch
              </span>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed flex items-start gap-2">
                <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span>{selectedBranch.address}</span>
              </p>
            </div>

            {/* Google Maps link with Maps Icon per PDF */}
            <div className="pt-2">
              <a
                href={selectedBranch.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md"
              >
                {/* Google Maps Pin Icon */}
                <Navigation className="w-4 h-4" />
                <span>Mở chỉ đường trên Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>

            {/* Working Hotline: Bấm gọi được luôn per PDF */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Hotline chi nhánh:</span>
                <div className="font-extrabold text-base text-[#003B70]">
                  {selectedBranch.hotline}
                </div>
              </div>
              <a
                href={`tel:${selectedBranch.rawHotline}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ED1C24] hover:bg-red-700 text-white font-bold text-xs transition shadow-sm"
                title="Bấm để gọi hotline ngay"
              >
                <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                <span>Bấm để gọi</span>
              </a>
            </div>

            {/* Working hours reminder */}
            <div className="text-xs text-slate-500 space-y-1 border-t border-slate-100 pt-3">
              <div className="font-bold text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Thời gian làm việc:
              </div>
              <div>• Thứ 2 - Thứ 6: 07:30 - 11:30 | 13:30 - 16:30</div>
              <div>• Thứ 7 - Chủ nhật: Nghỉ</div>
            </div>
          </div>
        </div>

        {/* List of 6 Branch Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {filteredBranches.map((branch) => {
            const isSelected = selectedBranchId === branch.id;
            return (
              <div
                key={branch.id}
                onClick={() => setSelectedBranchId(branch.id)}
                className={`bg-white rounded-3xl p-5 border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row gap-4 items-start justify-between ${
                  isSelected
                    ? 'border-[#003B70] shadow-md ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Branch image thumbnail */}
                <div className="w-full sm:w-36 h-28 rounded-2xl bg-slate-100 overflow-hidden shrink-0 relative">
                  <img
                    src={branch.cleanImageUrl}
                    alt={branch.room}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-extrabold bg-black/60 text-white backdrop-blur-xs">
                    STT {branch.stt}
                  </span>
                </div>

                {/* Branch text details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-extrabold text-[#003B70]">
                      {branch.room}
                    </h4>
                    {branch.isHeadquarter && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        Hội sở
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {/* Google Maps link button with Icon per PDF */}
                    <a
                      href={branch.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold transition border border-slate-200"
                    >
                      <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Xem bản đồ</span>
                    </a>

                    {/* Working Hotline: Bấm để gọi luôn */}
                    <a
                      href={`tel:${branch.rawHotline}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition border border-red-200"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Gọi: {branch.hotline}</span>
                    </a>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyAddress(branch);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-600 transition"
                      title="Sao chép địa chỉ"
                    >
                      {copiedId === branch.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-white rounded-3xl p-4 shadow-2xl flex flex-col items-center"
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-slate-800 shadow-md flex items-center justify-center font-bold hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
            <img 
              src={previewImage} 
              alt="Chi nhánh VietinBank" 
              className="max-h-[80vh] w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
