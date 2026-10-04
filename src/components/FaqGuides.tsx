import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronRight, 
  ArrowLeft, 
  Youtube, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  ExternalLink,
  RotateCcw,
  Sparkles,
  Maximize2,
  X,
  CreditCard,
  KeyRound,
  Fingerprint,
  FileSpreadsheet,
  Calendar
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { ContentData, GuideItem, GuideStep } from '../types';

const data = contentData as ContentData;

interface FaqGuidesProps {
  onBackToMenu?: () => void;
}

export const FaqGuides: React.FC<FaqGuidesProps> = ({ onBackToMenu }) => {
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'ok' | 'need_help' | 'ended'>('idle');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const selectedGuide = data.faq.guides.find(g => g.id === selectedGuideId);

  const handleSelectGuide = (id: string) => {
    setSelectedGuideId(id);
    setCurrentStepIndex(0);
    setFeedbackState('idle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedGuideId(null);
    setCurrentStepIndex(0);
    setFeedbackState('idle');
  };

  const getGuideIcon = (id: string) => {
    switch (id) {
      case 'quen-mat-khau':
        return <KeyRound className="w-6 h-6 text-amber-500" />;
      case 'dong-the':
        return <CreditCard className="w-6 h-6 text-red-500" />;
      case 'sinh-trac-hoc':
        return <Fingerprint className="w-6 h-6 text-blue-500" />;
      case 'nop-thue':
        return <FileSpreadsheet className="w-6 h-6 text-emerald-500" />;
      case 'dat-lich':
        return <Calendar className="w-6 h-6 text-purple-500" />;
      default:
        return <HelpCircle className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* If no guide selected: Show Card Selection Screen */}
      {!selectedGuide ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#003B70] via-[#00529C] to-[#0A66C2] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 mb-4 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                Hỗ trợ trực quan tại quầy
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
                {data.faq.title}
              </h1>
              <p className="text-lg sm:text-xl font-medium text-blue-100">
                "{data.faq.question}"
              </p>
              <p className="text-xs sm:text-sm text-blue-200/80 mt-2">
                Chọn nội dung bên dưới để xem từng bước hướng dẫn chi tiết kèm hình ảnh minh họa trên màn hình điện thoại.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.faq.guides.map((guide, idx) => (
              <div
                key={guide.id}
                onClick={() => handleSelectGuide(guide.id)}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-slate-50 group-hover:bg-blue-50 rounded-2xl transition-colors border border-slate-100">
                      {getGuideIcon(guide.id)}
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-[#003B70] transition-colors">
                      {guide.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#003B70] transition-colors mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-4">
                    {guide.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#003B70]">
                  <span>{guide.steps.length} bước chi tiết</span>
                  <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Xem hướng dẫn
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Help Line Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-amber-900 text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                Không tìm thấy câu hỏi của bạn? Hãy trao đổi với cán bộ quầy hoặc liên hệ hotline:
              </span>
            </div>
            <a
              href={`tel:${data.brand.advisor.rawPhone}`}
              className="inline-flex items-center gap-2 bg-[#ED1C24] hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Gọi {data.brand.advisor.name}: {data.brand.advisor.phone}
            </a>
          </div>
        </div>
      ) : (
        /* Detailed Step-by-Step Viewer Screen */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top navigation actions */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách câu hỏi
            </button>

            {selectedGuide.videoUrl && (
              <a
                href={selectedGuide.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition shadow-sm"
              >
                <Youtube className="w-4 h-4" />
                <span>Xem Video hướng dẫn trên YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            )}
          </div>

          {/* Guide Title Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
              <span>Nội dung hướng dẫn chi tiết</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#003B70]">
              {selectedGuide.title}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {selectedGuide.description}
            </p>

            {/* Stepper Navigation Pills */}
            <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {selectedGuide.steps.map((step, idx) => {
                const isActive = currentStepIndex === idx;
                return (
                  <button
                    key={step.step}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                      isActive 
                        ? 'bg-[#003B70] text-white shadow-md' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>Bước {step.step}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Step Showcase Card */}
          {selectedGuide.steps[currentStepIndex] && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Step instructions */}
              <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-blue-100 text-[#003B70] font-black text-sm">
                      #{selectedGuide.steps[currentStepIndex].step}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      Bước {currentStepIndex + 1} / {selectedGuide.steps.length}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-4">
                    {selectedGuide.steps[currentStepIndex].title}
                  </h3>

                  <div className="bg-blue-50/70 border-l-4 border-[#003B70] p-4 rounded-r-xl mb-6">
                    <p className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed whitespace-pre-line">
                      {selectedGuide.steps[currentStepIndex].text}
                    </p>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <span>💡 Mẹo: Nhấp vào ảnh bên phải để phóng to xem rõ nét các vị trí bấm trên màn hình.</span>
                  </div>
                </div>

                {/* Step next / prev buttons */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-6">
                  <button
                    disabled={currentStepIndex === 0}
                    onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                  >
                    Bước trước
                  </button>

                  <div className="text-xs text-slate-500 font-medium">
                    {currentStepIndex + 1} / {selectedGuide.steps.length}
                  </div>

                  <button
                    disabled={currentStepIndex === selectedGuide.steps.length - 1}
                    onClick={() => setCurrentStepIndex(prev => Math.min(selectedGuide.steps.length - 1, prev + 1))}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#003B70] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-900 transition flex items-center gap-1"
                  >
                    Bước tiếp theo
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Step Screenshot Image View */}
              <div className="lg:col-span-6 bg-slate-100/70 p-6 flex flex-col items-center justify-center relative min-h-[350px]">
                <div 
                  onClick={() => setPreviewImage(selectedGuide.steps[currentStepIndex].imageUrl)}
                  className="relative group cursor-zoom-in max-w-sm rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white"
                >
                  <img 
                    src={selectedGuide.steps[currentStepIndex].imageUrl} 
                    alt={`Bước ${selectedGuide.steps[currentStepIndex].step}`}
                    className="w-full max-h-[460px] object-contain group-hover:scale-[1.02] transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-xs gap-1.5">
                    <Maximize2 className="w-4 h-4" />
                    Bấm để phóng to
                  </div>
                </div>
                <div className="text-center text-[11px] text-slate-400 mt-3">
                  Hình ảnh minh họa giao diện App VietinBank iPay thực tế
                </div>
              </div>
            </div>
          )}

          {/* All Steps Thumbnail Strip for Fast Navigation */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200">
            <div className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">
              Tất cả các bước ({selectedGuide.steps.length} bước)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {selectedGuide.steps.map((st, i) => (
                <button
                  key={st.step}
                  onClick={() => setCurrentStepIndex(i)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition flex flex-col justify-between ${
                    currentStepIndex === i
                      ? 'border-[#003B70] bg-blue-50/70 ring-1 ring-[#003B70]'
                      : 'border-slate-100 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-bold text-[#003B70] mb-1">Bước {st.step}</div>
                  <div className="text-slate-600 text-[11px] line-clamp-2 leading-tight">
                    {st.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Required Feedback Prompt Section per user specs */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm">
            <h4 className="text-base sm:text-lg font-bold text-[#003B70] mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              {data.faq.promptFeedback}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Đánh giá của Quý khách giúp ngân hàng không ngừng cải tiến chất lượng phục vụ tại quầy và kênh số.
            </p>

            {/* Feedback Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setFeedbackState('ok')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition ${
                  feedbackState === 'ok'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Đã ổn (Quay lại menu chính)
              </button>

              <button
                onClick={() => setFeedbackState('need_help')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition ${
                  feedbackState === 'need_help'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                Chưa ổn (Cần hỗ trợ trực tiếp)
              </button>

              <button
                onClick={() => setFeedbackState('ended')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition ${
                  feedbackState === 'ended'
                    ? 'bg-slate-800 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                <span>Kết thúc cuộc trò chuyện</span>
              </button>
            </div>

            {/* Conditional Feedback Message Displays per Prompt specs */}
            {feedbackState === 'ok' && (
              <div className="mt-6 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 animate-in fade-in duration-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm">Tuyệt vời!</h5>
                    <p className="text-xs sm:text-sm mt-1">{data.faq.feedbackPositive}</p>
                    <button
                      onClick={handleBackToList}
                      className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Quay lại danh mục câu hỏi
                    </button>
                  </div>
                </div>
              </div>
            )}

            {feedbackState === 'need_help' && (
              <div className="mt-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 animate-in fade-in duration-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm">Thông tin hỗ trợ trực tiếp</h5>
                    <p className="text-xs sm:text-sm mt-1 font-medium leading-relaxed">
                      "{data.faq.feedbackNegative}"
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <a
                        href={`tel:${data.brand.advisor.rawPhone}`}
                        className="inline-flex items-center gap-2 bg-[#ED1C24] hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
                        Gọi ngay: {data.brand.advisor.phone} ({data.brand.advisor.name})
                      </a>
                      <button
                        onClick={handleBackToList}
                        className="px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-xs font-semibold text-amber-800 hover:bg-amber-100/70"
                      >
                        Xem hướng dẫn khác
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {feedbackState === 'ended' && (
              <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 animate-in fade-in duration-200">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm">Lời cảm ơn từ VietinBank</h5>
                    <p className="text-xs sm:text-sm mt-1 font-medium">
                      "{data.faq.endConversation}"
                    </p>
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          handleBackToList();
                          if (onBackToMenu) onBackToMenu();
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003B70] text-white text-xs font-bold hover:bg-blue-900 transition"
                      >
                        Về màn hình chính
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
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
              alt="Zoomed Step" 
              className="max-h-[80vh] w-auto object-contain rounded-xl"
            />
            <div className="text-center text-xs text-slate-500 mt-2">
              Chụp màn hình ứng dụng VietinBank iPay
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
