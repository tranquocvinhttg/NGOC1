import React, { useState } from 'react';
import { 
  Sparkles, 
  Star, 
  Gift, 
  ChevronLeft, 
  ChevronRight, 
  PhoneCall, 
  CheckCircle2, 
  X, 
  Maximize2, 
  Building2, 
  CreditCard, 
  Store, 
  Layers, 
  Tag
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { ContentData, ProductItem } from '../types';

const data = contentData as ContentData;
const featData = data.featuredProducts;

export const FeaturedProducts: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [activeCarouselIndex, setActiveCarouselIndex] = useState<number>(0);
  const [interestedProduct, setInterestedProduct] = useState<ProductItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Filter products by chip
  const filteredProducts = featData.items.filter(item => {
    if (selectedCategory === 'Tất cả') return true;
    return item.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const handleNext = () => {
    setActiveCarouselIndex(prev => (prev + 1) % filteredProducts.length);
  };

  const handlePrev = () => {
    setActiveCarouselIndex(prev => (prev - 1 + filteredProducts.length) % filteredProducts.length);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner - nổi bật với viền đỏ mảnh & gradient xanh nhẹ per PDF */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-blue-900 via-[#003B70] to-[#0A66C2] text-white shadow-xl border-2 border-red-500/80 overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ED1C24] text-white text-xs font-black uppercase tracking-wider shadow-md">
              <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
              Nổi bật
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
              <Gift className="w-3.5 h-3.5 text-amber-300" />
              Ưu đãi độc quyền tại quầy
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            {featData.title}
          </h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            {featData.description}
          </p>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {featData.categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveCarouselIndex(0);
              }}
              className={`shrink-0 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#003B70] text-white shadow-md ring-2 ring-blue-300'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Mode 1: Poster Carousel Feature (as specified in PDF: "Nên dùng chế độ hiển thị Poster dạng carousel") */}
      {filteredProducts.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                Poster Giới Thiệu ({activeCarouselIndex + 1}/{filteredProducts.length})
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                aria-label="Previous poster"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full bg-[#003B70] hover:bg-blue-900 text-white flex items-center justify-center transition"
                aria-label="Next poster"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Carousel Active Item Card */}
          {(() => {
            const currentItem = filteredProducts[activeCarouselIndex];
            if (!currentItem) return null;

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Poster Image */}
                <div className="lg:col-span-6 bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-100 relative group">
                  <div 
                    onClick={() => setPreviewImage(currentItem.imageUrl)}
                    className="cursor-zoom-in max-w-sm rounded-xl overflow-hidden shadow-md bg-white border border-slate-200"
                  >
                    <img
                      src={currentItem.imageUrl}
                      alt={currentItem.title}
                      className="w-full max-h-[440px] object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <button
                    onClick={() => setPreviewImage(currentItem.imageUrl)}
                    className="absolute top-6 right-6 p-2 rounded-xl bg-black/60 text-white hover:bg-black transition"
                    title="Phóng to poster"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Poster Details & CTA */}
                <div className="lg:col-span-6 space-y-5">
                  <div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-[#003B70] inline-block mb-2">
                      {currentItem.category}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#003B70] leading-snug">
                      {currentItem.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {currentItem.subtitle}
                    </p>
                  </div>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {currentItem.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3 text-red-500" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Required "Tôi quan tâm" button */}
                  <div className="pt-4">
                    <button
                      onClick={() => setInterestedProduct(currentItem)}
                      className="px-8 py-3.5 rounded-2xl bg-[#ED1C24] hover:bg-red-700 text-white font-extrabold text-sm shadow-lg hover:shadow-red-500/20 hover:scale-105 transition flex items-center gap-2 group"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span>Tôi quan tâm sản phẩm này</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <span className="text-xs text-slate-400 block mt-2">
                      Bấm để nhận thông tin tư vấn nhanh từ cán bộ quầy
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Grid of All Posters for Fast Vertical Scrolling */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#003B70]" />
          <span>Danh sách tất cả sản phẩm & ưu đãi</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div 
                  onClick={() => setPreviewImage(prod.imageUrl)}
                  className="bg-slate-50 p-4 flex items-center justify-center cursor-zoom-in border-b border-slate-100 group relative"
                >
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="h-56 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/90 text-[#003B70] shadow-xs">
                    {prod.category}
                  </span>
                </div>

                <div className="p-5">
                  <h4 className="text-lg font-bold text-slate-800 mb-1 hover:text-[#003B70] transition">
                    {prod.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {prod.subtitle}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setInterestedProduct(prod)}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-[#003B70] text-[#003B70] hover:text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>Tôi quan tâm</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POPUP MODAL: Khi khách bấm "Tôi quan tâm" per PDF specs */}
      {interestedProduct && (
        <div 
          onClick={() => setInterestedProduct(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 relative text-center"
          >
            <button
              onClick={() => setInterestedProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">
              {interestedProduct.category}
            </span>
            <h3 className="text-xl font-black text-slate-900 mb-3">
              {interestedProduct.title}
            </h3>

            {/* Exactly formatted message per PDF prompt */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed mb-4 text-left">
              <p className="font-medium">
                Cảm ơn Quý khách đã quan tâm đến sản phẩm/dịch vụ này. Quý khách vui lòng liên hệ cán bộ VietinBank tại quầy để được tư vấn chi tiết.
              </p>
              <p className="mt-2 pt-2 border-t border-slate-200 text-slate-600">
                Hoặc liên hệ Chuyên viên tư vấn <strong>{data.brand.advisor.name}</strong> - <strong>{data.brand.advisor.phone}</strong>.
              </p>
            </div>

            <div className="flex gap-2">
              <a
                href={`tel:${data.brand.advisor.rawPhone}`}
                className="flex-1 py-3 px-4 rounded-xl bg-[#ED1C24] hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>Gọi tư vấn viên ngay</span>
              </a>
              <button
                onClick={() => setInterestedProduct(null)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xl w-full bg-white rounded-3xl p-4 shadow-2xl flex flex-col items-center"
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-slate-800 shadow-md flex items-center justify-center font-bold hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
            <img 
              src={previewImage} 
              alt="Poster Preview" 
              className="max-h-[80vh] w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
