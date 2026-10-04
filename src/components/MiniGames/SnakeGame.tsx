import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  RotateCcw, 
  Trophy, 
  Award, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Copy, 
  Check, 
  Sparkles,
  Flame,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import contentData from '../../data/contentData.json';
import { ContentData } from '../../types';

const data = contentData as ContentData;
const snakeCfg = data.games.snake;

interface Point {
  x: number;
  y: number;
}

export const SnakeGame: React.FC<{ onBackToHome?: () => void }> = ({ onBackToHome }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'idle' | 'running' | 'gameover'>('idle');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('vb_snake_high_score') || '0', 10);
  });
  const [milestoneToast, setMilestoneToast] = useState<string | null>(null);
  const [hasHit20, setHasHit20] = useState(false);
  const [hasHit40, setHasHit40] = useState(false);
  const [finishTime, setFinishTime] = useState<string>('');
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  // Snake grid settings (20x20 grid on a 400x400 canvas)
  const GRID_SIZE = 20;
  const TILE_COUNT = 20;

  // Refs for loop
  const snakeRef = useRef<Point[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 }
  ]);
  const directionRef = useRef<Point>({ x: 0, y: -1 });
  const nextDirectionRef = useRef<Point>({ x: 0, y: -1 });
  const foodRef = useRef<Point>({ x: 10, y: 5 });
  const scoreRef = useRef<number>(0);
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const spawnFood = useCallback(() => {
    let newFood: Point;
    let collision: boolean;
    do {
      newFood = {
        x: Math.floor(Math.random() * TILE_COUNT),
        y: Math.floor(Math.random() * TILE_COUNT)
      };
      collision = snakeRef.current.some(part => part.x === newFood.x && part.y === newFood.y);
    } while (collision);
    foodRef.current = newFood;
  }, []);

  const triggerToast = (msg: string) => {
    setMilestoneToast(msg);
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
    } catch {
      // fallback
    }
    setTimeout(() => {
      setMilestoneToast(null);
    }, 3500);
  };

  const handleGameOver = useCallback(() => {
    if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    setGameState('gameover');
    const finalScore = scoreRef.current;
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} - ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    setFinishTime(timeString);

    if (finalScore >= 20) {
      const code = `VB-SNK-${Math.floor(100000 + Math.random() * 900000)}`;
      setVoucherCode(code);
      localStorage.setItem('vb_snake_recent_voucher', code);
    } else {
      setVoucherCode('');
    }

    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('vb_snake_high_score', finalScore.toString());
    }
  }, [highScore]);

  const startGame = useCallback(() => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 }
    ];
    directionRef.current = { x: 0, y: -1 };
    nextDirectionRef.current = { x: 0, y: -1 };
    scoreRef.current = 0;
    setScore(0);
    setHasHit20(false);
    setHasHit40(false);
    setMilestoneToast(null);
    spawnFood();
    setGameState('running');
  }, [spawnFood]);

  const changeDirection = useCallback((newDir: Point) => {
    const current = directionRef.current;
    // Prevent 180 degree instant reversal
    if (current.x + newDir.x === 0 && current.y + newDir.y === 0) return;
    nextDirectionRef.current = newDir;
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        changeDirection({ x: 0, y: -1 });
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        changeDirection({ x: 0, y: 1 });
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        changeDirection({ x: -1, y: 0 });
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        changeDirection({ x: 1, y: 0 });
      } else if (e.code === 'Space' && gameState !== 'running') {
        e.preventDefault();
        startGame();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [changeDirection, gameState, startGame]);

  // Game Loop
  useEffect(() => {
    if (gameState !== 'running') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const tick = () => {
      if (!isRunning) return;

      directionRef.current = nextDirectionRef.current;
      const head = { ...snakeRef.current[0] };
      head.x += directionRef.current.x;
      head.y += directionRef.current.y;

      // 1. Wall Collision Check
      if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        handleGameOver();
        return;
      }

      // 2. Self Collision Check
      if (snakeRef.current.some(part => part.x === head.x && part.y === head.y)) {
        handleGameOver();
        return;
      }

      // Add new head
      snakeRef.current.unshift(head);

      // 3. Food eaten check
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        scoreRef.current += 1;
        const currentScore = scoreRef.current;
        setScore(currentScore);

        // Check milestones per requirements
        if (currentScore >= 40 && !hasHit40) {
          setHasHit40(true);
          triggerToast(snakeCfg.milestone40);
        } else if (currentScore >= 20 && !hasHit20) {
          setHasHit20(true);
          triggerToast(snakeCfg.milestone20);
        }

        spawnFood();
      } else {
        snakeRef.current.pop();
      }

      // 4. Render to Canvas
      // Background grid
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle grid lines
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= TILE_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(canvas.width, i * GRID_SIZE);
        ctx.stroke();
      }

      // Draw Food (VietinBank Golden Coin / Card)
      const foodX = foodRef.current.x * GRID_SIZE + GRID_SIZE / 2;
      const foodY = foodRef.current.y * GRID_SIZE + GRID_SIZE / 2;
      ctx.beginPath();
      ctx.arc(foodX, foodY, GRID_SIZE / 2 - 2, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B'; // Gold coin
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#D97706';
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', foodX, foodY);

      // Draw Snake
      snakeRef.current.forEach((part, index) => {
        const x = part.x * GRID_SIZE;
        const y = part.y * GRID_SIZE;

        if (index === 0) {
          // Head - VietinBank Blue with eye
          ctx.fillStyle = '#003B70';
          ctx.beginPath();
          ctx.roundRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2, 6);
          ctx.fill();

          // Eyes
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(x + 6, y + 6, 2.5, 0, Math.PI * 2);
          ctx.arc(x + 14, y + 6, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Body - Gradient blue to red accent
          const isEven = index % 2 === 0;
          ctx.fillStyle = isEven ? '#00529C' : '#0A66C2';
          ctx.beginPath();
          ctx.roundRect(x + 1.5, y + 1.5, GRID_SIZE - 3, GRID_SIZE - 3, 4);
          ctx.fill();
        }
      });

      // Moderate speed suitable for all customers (120ms per tick)
      loopTimeoutRef.current = setTimeout(tick, 120);
    };

    tick();

    return () => {
      isRunning = false;
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    };
  }, [gameState, handleGameOver, hasHit20, hasHit40, spawnFood]);

  const copyVoucher = () => {
    if (!voucherCode) return;
    navigator.clipboard.writeText(voucherCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const getRewardDescription = (finalScore: number) => {
    if (finalScore >= 40) return '02 voucher xăng (Mỗi voucher trị giá 2 lít)';
    if (finalScore >= 20) return '01 voucher xăng trị giá 2 lít';
    return 'Chưa đạt mốc nhận thưởng';
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 select-none touch-manipulation">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Game Header */}
        <div className="bg-[#003B70] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-600 text-white">
              <Flame className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight">{snakeCfg.name}</h3>
              <p className="text-[11px] text-blue-200">{snakeCfg.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="p-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-xs font-medium text-blue-100 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Thoát
              </button>
            )}
          </div>
        </div>

        {/* Milestone Indicator & Current Score */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Điểm hiện tại: <span className="text-[#003B70] font-black text-sm ml-1">{score}</span>
            </span>

            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                score >= 20 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
              }`}>
                Mốc 20: 1 Voucher
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                score >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-500'
              }`}>
                Mốc 40: 2 Voucher
              </span>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="relative bg-slate-100 flex items-center justify-center p-2 min-h-[400px]">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full max-w-[400px] h-[400px] bg-slate-50 rounded-2xl border border-slate-200 shadow-inner block"
          />

          {/* In-Game Non-Disruptive Toast Notification */}
          {milestoneToast && (
            <div className="absolute top-4 left-4 right-4 bg-[#003B70] text-white p-3 rounded-2xl shadow-xl flex items-center gap-2.5 border-2 border-yellow-400 animate-in slide-in-from-top-2 duration-300 z-20">
              <Trophy className="w-6 h-6 text-yellow-300 shrink-0 animate-bounce" />
              <div className="text-xs font-bold leading-tight">
                {milestoneToast}
              </div>
            </div>
          )}

          {/* START SCREEN OVERLAY */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#003B70] border-2 border-white flex items-center justify-center mb-3 shadow-lg">
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black mb-1">{snakeCfg.name}</h2>
              <p className="text-xs text-yellow-200 font-semibold mb-4">{snakeCfg.subtitle}</p>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-6 text-xs text-blue-100 text-left space-y-1.5 max-w-xs">
                {snakeCfg.rules.map((r, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-yellow-300 font-bold">•</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={startGame}
                className="px-6 py-3 rounded-2xl bg-[#ED1C24] hover:bg-red-700 text-white font-extrabold text-sm shadow-xl hover:scale-105 transition flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                Bắt đầu chơi
              </button>
            </div>
          )}

          {/* GAME OVER SCREEN WITH VOUCHER RECEIPT ("Phiếu xác nhận quà tặng") */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 text-white z-30 animate-in zoom-in-95 duration-200">
              {score >= 20 ? (
                /* Winning Certificate */
                <div className="w-full max-w-sm bg-white text-slate-800 rounded-3xl p-5 shadow-2xl border-2 border-yellow-400">
                  <div className="text-center border-b border-slate-100 pb-3 mb-3">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003B70] uppercase tracking-wider mb-1">
                      <Award className="w-4 h-4 text-amber-500" />
                      Phiếu Xác Nhận Quà Tặng
                    </div>
                    <div className="text-lg font-black text-red-600">
                      {score >= 40 ? snakeCfg.finish40Plus : snakeCfg.finish20to39}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Điểm cuối cùng:</span>
                      <strong className="text-base text-[#003B70]">{score} điểm</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Mức quà đạt được:</span>
                      <strong className="text-emerald-700 text-right">{getRewardDescription(score)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Thời gian hoàn thành:</span>
                      <span className="text-slate-600 font-medium">{finishTime}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                      <span className="text-slate-500 font-medium">Mã nhận quà:</span>
                      <span className="font-mono font-black text-sm text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        {voucherCode}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-center font-medium mb-3">
                    📸 {snakeCfg.receiptNote}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={copyVoucher}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {isCopied ? 'Đã sao chép' : 'Sao chép mã'}
                    </button>
                    <button
                      onClick={startGame}
                      className="py-2 px-4 rounded-xl bg-[#003B70] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Chơi lại
                    </button>
                  </div>
                </div>
              ) : (
                /* Try Again Screen */
                <div className="w-full max-w-sm bg-white text-slate-800 rounded-3xl p-6 text-center shadow-2xl">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">Cố lên bạn nhé!</h3>
                  <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                    {snakeCfg.loseUnder20}
                  </p>
                  <div className="text-sm font-bold text-[#003B70] mb-5">
                    Điểm số của bạn: <span className="text-red-600 text-base">{score}</span> / 20
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={startGame}
                      className="flex-1 py-2.5 rounded-xl bg-[#003B70] hover:bg-blue-900 text-white font-bold text-xs transition"
                    >
                      Thử lại ngay
                    </button>
                    <button
                      onClick={() => {
                        if (onBackToHome) onBackToHome();
                        else setGameState('idle');
                      }}
                      className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                    >
                      Về màn hình chính
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* On-Screen Touch D-Pad for Mobile & Counter Tablets */}
        <div className="bg-slate-50 border-t border-slate-200 p-4">
          <div className="text-center text-[11px] font-semibold text-slate-400 mb-2">
            Phím điều hướng cảm ứng
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => changeDirection({ x: 0, y: -1 })}
              className="w-12 h-11 rounded-xl bg-white border border-slate-300 shadow-xs active:bg-blue-100 flex items-center justify-center text-slate-700 active:scale-95 transition"
              aria-label="Up"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-6">
              <button
                onClick={() => changeDirection({ x: -1, y: 0 })}
                className="w-12 h-11 rounded-xl bg-white border border-slate-300 shadow-xs active:bg-blue-100 flex items-center justify-center text-slate-700 active:scale-95 transition"
                aria-label="Left"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => changeDirection({ x: 0, y: 1 })}
                className="w-12 h-11 rounded-xl bg-white border border-slate-300 shadow-xs active:bg-blue-100 flex items-center justify-center text-slate-700 active:scale-95 transition"
                aria-label="Down"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
              <button
                onClick={() => changeDirection({ x: 1, y: 0 })}
                className="w-12 h-11 rounded-xl bg-white border border-slate-300 shadow-xs active:bg-blue-100 flex items-center justify-center text-slate-700 active:scale-95 transition"
                aria-label="Right"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer info: High Score */}
        <div className="bg-white p-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <Award className="w-4 h-4 text-amber-500" />
            Điểm cao nhất: <span className="font-bold text-[#003B70]">{highScore}</span>
          </div>
          <span className="text-[11px] text-slate-400">Điều khiển bằng phím mũi tên hoặc nút cảm ứng</span>
        </div>
      </div>
    </div>
  );
};
