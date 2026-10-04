import React, { useState } from 'react';
import { 
  Gamepad2, 
  Flame, 
  Trophy, 
  Sparkles, 
  ChevronRight, 
  Fuel, 
  ShieldCheck, 
  Gift, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { FlappyBirdGame } from './FlappyBirdGame';
import { SnakeGame } from './SnakeGame';
import contentData from '../../data/contentData.json';
import { ContentData } from '../../types';

const data = contentData as ContentData;

export const GameHub: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<'flappy' | 'snake' | null>(null);

  if (selectedGame === 'flappy') {
    return <FlappyBirdGame onBackToHome={() => setSelectedGame(null)} />;
  }

  if (selectedGame === 'snake') {
    return <SnakeGame onBackToHome={() => setSelectedGame(null)} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#003B70] via-[#00529C] to-[#ED1C24] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-yellow-200 mb-3 border border-white/20">
            <Gift className="w-3.5 h-3.5 text-yellow-300" />
            Giải trí tại quầy - Nhận Voucher xăng
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            Thử Thách Game Tương Tác
          </h1>
          <p className="text-base sm:text-lg text-blue-100 font-medium">
            Chơi vui trong lúc chờ phục vụ tại quầy giao dịch VietinBank. Chinh phục các mốc điểm để nhận ngay voucher xăng hấp dẫn!
          </p>
        </div>
      </div>

      {/* 2 Games Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Game 1: Flappy Bird */}
        <div 
          onClick={() => setSelectedGame('flappy')}
          className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-red-400 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl group-hover:scale-110 transition-transform">
                <Flame className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5" />
                Voucher 2 Lít Xăng
              </span>
            </div>

            <h3 className="text-2xl font-black text-[#003B70] group-hover:text-red-600 transition-colors mb-2">
              {data.games.flappy.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              {data.games.flappy.subtitle}. Điều khiển nhân vật bay né các chướng ngại vật, vượt đủ 20 thử thách để nhận voucher!
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1.5 mb-6">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Mục tiêu:</span>
                <span className="font-bold text-[#003B70]">20 Điểm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Phần thưởng:</span>
                <span className="font-bold text-red-600">Voucher 2 lít xăng</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Thời lượng trung bình:</span>
                <span className="text-slate-500">45 - 90 giây</span>
              </div>
            </div>
          </div>

          <button className="w-full py-3.5 px-4 rounded-xl bg-[#003B70] group-hover:bg-red-600 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm">
            <span>Bắt đầu chơi Flappy Bird</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Game 2: Snake Game */}
        <div 
          onClick={() => setSelectedGame('snake')}
          className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 text-[#003B70] rounded-2xl group-hover:scale-110 transition-transform">
                <Trophy className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-[#003B70] flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5" />
                Lên đến 2 Voucher
              </span>
            </div>

            <h3 className="text-2xl font-black text-[#003B70] group-hover:text-blue-600 transition-colors mb-2">
              {data.games.snake.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              {data.games.snake.subtitle}. Tái hiện trò chơi kinh điển với tốc độ vừa phải, săn đồng xu tài chính VietinBank.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-1.5 mb-6">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Mốc 20 điểm:</span>
                <span className="font-bold text-emerald-700">01 voucher 2 lít xăng</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Mốc 40 điểm:</span>
                <span className="font-bold text-red-600">02 voucher 2 lít xăng</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Điều khiển:</span>
                <span className="text-slate-500">Phím mũi tên / Cảm ứng D-Pad</span>
              </div>
            </div>
          </div>

          <button className="w-full py-3.5 px-4 rounded-xl bg-[#003B70] group-hover:bg-blue-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm">
            <span>Bắt đầu chơi Rắn Săn Mồi</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Rules & Transparency Notice */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs text-slate-500 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-700 block">Cam kết trải nghiệm an toàn & minh bạch:</span>
          <p>
            Trò chơi chỉ mang tính chất tri ân, giải trí cho khách hàng giao dịch tại quầy. Hoàn toàn không yêu cầu nhập thông tin cá nhân, không có yếu tố cá cược may rủi hay quy đổi tiền mặt. Khi đạt mốc nhận voucher, Quý khách vui lòng xuất trình mã hoặc màn hình cho giao dịch viên để nhận quà trực tiếp.
          </p>
        </div>
      </div>
    </div>
  );
};
