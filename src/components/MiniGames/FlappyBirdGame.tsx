import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Trophy, 
  Award, 
  Copy, 
  Check, 
  ChevronRight, 
  Sparkles,
  ArrowLeft,
  Flame
} from 'lucide-react';
import contentData from '../../data/contentData.json';
import { ContentData } from '../../types';

const data = contentData as ContentData;
const flappyCfg = data.games.flappy;

declare global {
  interface Window {
    onFlappyVoucherWin?: (payload: {
      score: number;
      voucherCode: string;
      reward: string;
      timestamp: string;
    }) => void;
    onFlappyVoucherLose?: (payload: {
      score: number;
      timestamp: string;
    }) => void;
  }
}

interface FlappyBirdGameProps {
  onBackToHome?: () => void;
}

export const FlappyBirdGame: React.FC<FlappyBirdGameProps> = ({ onBackToHome }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game state
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'won'>('start');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('vb_flappy_high_score') || '0', 10);
  });
  const [recentVoucher, setRecentVoucher] = useState<string | null>(() => {
    return localStorage.getItem('vb_flappy_recent_voucher') || null;
  });
  const [currentVoucher, setCurrentVoucher] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Game physics variables refs to keep requestAnimationFrame clean
  const stateRef = useRef({
    gameState: 'start' as 'start' | 'playing' | 'gameover' | 'won',
    score: 0,
    birdY: 180,
    birdVelocity: 0,
    pipes: [] as Array<{ x: number; topHeight: number; bottomY: number; passed: boolean }>,
    frameCount: 0,
    animationFrameId: 0,
    lastTime: 0
  });

  // Constants
  const WIN_SCORE = flappyCfg.winScore || 20;
  const GRAVITY = 0.28;
  const JUMP_FORCE = -5.8;
  const PIPE_SPEED = 2.0;
  const PIPE_GAP = 145; // generous gap for casual customer convenience
  const PIPE_WIDTH = 58;
  const BIRD_RADIUS = 16;
  const BIRD_X = 75;

  // Sound generator using Web Audio API (no external sound files required)
  const playTone = useCallback((freq: number, type: OscillatorType, duration: number) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // AudioContext unavailable or restricted
    }
  }, [soundEnabled]);

  const generateVoucherCode = (): string => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `VB-${randomDigits}`;
  };

  const getMotivationalQuote = (s: number) => {
    if (s < 5) return flappyCfg.motivationalQuotes.tier1;
    if (s < 10) return flappyCfg.motivationalQuotes.tier2;
    if (s < 15) return flappyCfg.motivationalQuotes.tier3;
    if (s < 20) return flappyCfg.motivationalQuotes.tier4;
    return flappyCfg.motivationalQuotes.tier5;
  };

  const winGame = useCallback((finalScore: number) => {
    stateRef.current.gameState = 'won';
    setGameState('won');

    const newCode = generateVoucherCode();
    setCurrentVoucher(newCode);
    setRecentVoucher(newCode);
    localStorage.setItem('vb_flappy_recent_voucher', newCode);

    // Confetti effect
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    playTone(587.33, 'triangle', 0.2);
    setTimeout(() => playTone(880, 'triangle', 0.4), 200);

    // Call window callback if defined per prompt
    if (typeof window.onFlappyVoucherWin === 'function') {
      window.onFlappyVoucherWin({
        score: finalScore,
        voucherCode: newCode,
        reward: flappyCfg.voucherReward,
        timestamp: new Date().toISOString()
      });
    }
  }, [playTone]);

  const endGame = useCallback((finalScore: number) => {
    stateRef.current.gameState = 'gameover';
    setGameState('gameover');

    playTone(180, 'sawtooth', 0.3);

    // Call window callback if defined
    if (typeof window.onFlappyVoucherLose === 'function') {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString()
      });
    }
  }, [playTone]);

  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    const initialY = canvas ? canvas.height / 2 : 180;
    stateRef.current = {
      gameState: 'playing',
      score: 0,
      birdY: initialY,
      birdVelocity: 0,
      pipes: [],
      frameCount: 0,
      animationFrameId: 0,
      lastTime: performance.now()
    };
    setScore(0);
    setGameState('playing');
    playTone(440, 'sine', 0.1);
  }, [playTone]);

  const jump = useCallback(() => {
    if (stateRef.current.gameState === 'playing') {
      stateRef.current.birdVelocity = JUMP_FORCE;
      playTone(392, 'square', 0.08);
    } else if (stateRef.current.gameState === 'start') {
      resetGame();
    }
  }, [resetGame, playTone]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const { width, height } = canvas;

      // 1. Draw Sky background (VietinBank gradient sky)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#003B70');
      skyGrad.addColorStop(0.55, '#0A66C2');
      skyGrad.addColorStop(0.85, '#60A5FA');
      skyGrad.addColorStop(1, '#DBEAFE');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Clouds decoration
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.arc(80, 70, 24, 0, Math.PI * 2);
      ctx.arc(110, 60, 32, 0, Math.PI * 2);
      ctx.arc(140, 70, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(280, 100, 20, 0, Math.PI * 2);
      ctx.arc(305, 90, 28, 0, Math.PI * 2);
      ctx.arc(330, 100, 20, 0, Math.PI * 2);
      ctx.fill();

      // Ground grass
      const groundHeight = 50;
      const groundY = height - groundHeight;
      ctx.fillStyle = '#10B981';
      ctx.fillRect(0, groundY, width, 10);
      ctx.fillStyle = '#D97706';
      ctx.fillRect(0, groundY + 10, width, groundHeight - 10);

      // 2. Physics & Logic when playing
      if (stateRef.current.gameState === 'playing') {
        stateRef.current.frameCount++;

        // Apply bird physics
        stateRef.current.birdVelocity += GRAVITY;
        stateRef.current.birdY += stateRef.current.birdVelocity;

        // Floor collision
        if (stateRef.current.birdY + BIRD_RADIUS >= groundY) {
          stateRef.current.birdY = groundY - BIRD_RADIUS;
          endGame(stateRef.current.score);
        }

        // Ceiling collision
        if (stateRef.current.birdY - BIRD_RADIUS <= 0) {
          stateRef.current.birdY = BIRD_RADIUS;
          stateRef.current.birdVelocity = 0;
        }

        // Spawn pipes every 105 frames
        if (stateRef.current.frameCount % 105 === 0) {
          const minPipe = 50;
          const maxPipe = groundY - PIPE_GAP - minPipe;
          const topHeight = Math.floor(minPipe + Math.random() * (maxPipe - minPipe));
          stateRef.current.pipes.push({
            x: width,
            topHeight,
            bottomY: topHeight + PIPE_GAP,
            passed: false
          });
        }

        // Move pipes & collision detection
        for (let i = stateRef.current.pipes.length - 1; i >= 0; i--) {
          const p = stateRef.current.pipes[i];
          p.x -= PIPE_SPEED;

          // Check if bird passed pipe
          if (!p.passed && p.x + PIPE_WIDTH < BIRD_X - BIRD_RADIUS) {
            p.passed = true;
            stateRef.current.score += 1;
            const newScore = stateRef.current.score;
            setScore(newScore);

            // Update high score
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('vb_flappy_high_score', newScore.toString());
            }

            playTone(523.25, 'triangle', 0.1);

            // Check Win Condition
            if (newScore >= WIN_SCORE) {
              winGame(newScore);
              break;
            }
          }

          // Collision detection with pipes (bounding circle vs rectangle)
          const birdLeft = BIRD_X - BIRD_RADIUS;
          const birdRight = BIRD_X + BIRD_RADIUS;
          const birdTop = stateRef.current.birdY - BIRD_RADIUS;
          const birdBottom = stateRef.current.birdY + BIRD_RADIUS;

          // Check X overlap
          if (birdRight > p.x && birdLeft < p.x + PIPE_WIDTH) {
            // Check Y overlap with top pipe OR bottom pipe
            if (birdTop < p.topHeight || birdBottom > p.bottomY) {
              endGame(stateRef.current.score);
              break;
            }
          }

          // Remove off-screen pipes
          if (p.x + PIPE_WIDTH < -10) {
            stateRef.current.pipes.splice(i, 1);
          }
        }
      }

      // 3. Draw Pipes (VietinBank styled columns)
      stateRef.current.pipes.forEach(p => {
        // Top Pipe body
        const pipeGrad = ctx.createLinearGradient(p.x, 0, p.x + PIPE_WIDTH, 0);
        pipeGrad.addColorStop(0, '#0284C7');
        pipeGrad.addColorStop(0.5, '#38BDF8');
        pipeGrad.addColorStop(1, '#0369A1');

        ctx.fillStyle = pipeGrad;
        ctx.fillRect(p.x, 0, PIPE_WIDTH, p.topHeight);
        // Top Pipe Cap
        ctx.fillStyle = '#0284C7';
        ctx.fillRect(p.x - 3, p.topHeight - 16, PIPE_WIDTH + 6, 16);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(p.x - 3, p.topHeight - 16, PIPE_WIDTH + 6, 16);

        // Bottom Pipe body
        ctx.fillStyle = pipeGrad;
        ctx.fillRect(p.x, p.bottomY, PIPE_WIDTH, groundY - p.bottomY);
        // Bottom Pipe Cap
        ctx.fillStyle = '#0284C7';
        ctx.fillRect(p.x - 3, p.bottomY, PIPE_WIDTH + 6, 16);
        ctx.strokeRect(p.x - 3, p.bottomY, PIPE_WIDTH + 6, 16);
      });

      // 4. Draw Mascot / Flying Bank Card Character
      const birdY = stateRef.current.birdY;
      ctx.save();
      ctx.translate(BIRD_X, birdY);
      // Tilt character based on velocity
      const tilt = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (stateRef.current.birdVelocity * 4 * Math.PI) / 180));
      ctx.rotate(tilt);

      // Flying Golden Coin / Card Mascot
      // Wings
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.ellipse(-6, 4, 10, 6, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Body (VietinBank Blue badge circle with red accent)
      ctx.beginPath();
      ctx.arc(0, 0, BIRD_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#ED1C24'; // VietinBank Red
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Inner VietinBank star / coin circle
      ctx.beginPath();
      ctx.arc(0, 0, BIRD_RADIUS - 4, 0, Math.PI * 2);
      ctx.fillStyle = '#003B70';
      ctx.fill();

      // Letter "V" inside mascot
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('V', 0, 1);

      // Eye
      ctx.beginPath();
      ctx.arc(8, -6, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(9, -6, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();

      // Beak
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(14, -2);
      ctx.lineTo(22, 1);
      ctx.lineTo(14, 5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // 5. In-game HUD overlay on canvas
      if (stateRef.current.gameState === 'playing') {
        // Score banner
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.roundRect(width / 2 - 50, 16, 100, 36, 12);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${stateRef.current.score} / ${WIN_SCORE}`, width / 2, 40);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [WIN_SCORE, endGame, winGame, highScore, playTone]);

  // Handle keyboard events (Spacebar to jump)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  const copyVoucherCode = () => {
    if (!currentVoucher) return;
    navigator.clipboard.writeText(currentVoucher);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div 
      id="flappy-voucher-game" 
      className="max-w-xl mx-auto px-4 py-4 select-none touch-manipulation"
    >
      {/* Top Game Card Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Game Header Bar */}
        <div className="bg-[#003B70] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-600 text-white">
              <Flame className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight">{flappyCfg.name}</h3>
              <p className="text-[11px] text-blue-200">Săn {flappyCfg.voucherReward}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                soundEnabled ? 'bg-blue-600 text-white' : 'bg-slate-700/60 text-slate-300'
              }`}
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
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

        {/* Motivational Quote & In-Game Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Điểm: <span className="text-[#003B70] font-extrabold text-sm ml-1">{score}</span> / {WIN_SCORE}
            </span>
            <span className="font-semibold text-emerald-600 text-xs animate-pulse">
              {getMotivationalQuote(score)}
            </span>
          </div>

          {/* Progress bar to 20 */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 via-amber-500 to-red-500 h-full transition-all duration-200"
              style={{ width: `${Math.min(100, (score / WIN_SCORE) * 100)}%` }}
            />
          </div>
        </div>

        {/* Canvas Area with interactive click / touch */}
        <div 
          onClick={jump}
          className="relative bg-slate-900 flex items-center justify-center cursor-pointer overflow-hidden"
          style={{ minHeight: '380px' }}
        >
          <canvas
            ref={canvasRef}
            width={400}
            height={420}
            className="w-full max-w-[400px] h-[400px] block"
          />

          {/* START SCREEN OVERLAY */}
          {gameState === 'start' && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
              <div className="w-14 h-14 rounded-2xl bg-[#003B70] border-2 border-white flex items-center justify-center mb-3 shadow-lg animate-bounce">
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black mb-1 tracking-tight">
                {flappyCfg.name}
              </h2>
              <p className="text-xs sm:text-sm text-yellow-200 font-semibold mb-4 max-w-xs">
                {flappyCfg.subtitle}
              </p>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-6 text-xs text-blue-100 max-w-xs">
                <p className="font-bold text-white mb-1">Mục tiêu thử thách:</p>
                <p>{flappyCfg.rules}</p>
                <div className="mt-2 text-[11px] text-amber-300 font-medium">
                  {flappyCfg.instructions}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetGame();
                }}
                className="px-6 py-3 rounded-2xl bg-[#ED1C24] hover:bg-red-700 text-white font-extrabold text-sm shadow-xl hover:scale-105 transition flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                Bắt đầu chơi
              </button>
            </div>
          )}

          {/* GAME OVER SCREEN OVERLAY */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center mb-2">
                <RotateCcw className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-black mb-1">Rất tiếc!</h3>
              <p className="text-sm font-semibold text-slate-200 mb-1">
                Bạn đã vượt qua <span className="text-yellow-400 font-extrabold text-base">{score}</span> / {WIN_SCORE} thử thách
              </p>
              <p className="text-xs text-slate-400 mb-5 max-w-xs">
                {flappyCfg.loseMessage}
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetGame();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#003B70] hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  Chơi lại
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onBackToHome) onBackToHome();
                    else setGameState('start');
                  }}
                  className="py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition"
                >
                  Về màn hình chính
                </button>
              </div>
            </div>
          )}

          {/* WIN SCREEN OVERLAY */}
          {gameState === 'won' && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#003B70]/95 to-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white animate-in zoom-in-95 duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-900 flex items-center justify-center mb-2 shadow-xl animate-bounce">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-yellow-300 mb-1">
                {flappyCfg.winTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 mb-4 max-w-xs">
                {flappyCfg.winSubtitle}
              </p>

              {/* Prominent Voucher Code Box */}
              <div className="w-full max-w-xs bg-white text-slate-900 rounded-2xl p-4 border-2 border-yellow-400 shadow-2xl mb-4">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#003B70] mb-1">
                  Mã Voucher Nhận Quà
                </div>
                <div className="font-mono text-2xl font-black tracking-wider text-red-600 py-1 select-all">
                  {currentVoucher}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 mt-1">
                  Phần quà: <strong className="text-emerald-700">{flappyCfg.voucherReward}</strong>
                </div>
              </div>

              <p className="text-[11px] text-amber-200/90 font-medium mb-5 max-w-xs">
                💡 {flappyCfg.instructions}
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyVoucherCode();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Đã sao chép!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Sao chép mã
                    </>
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetGame();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs transition"
                >
                  Chơi lại
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info: High Score & Recent Voucher */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <Award className="w-4 h-4 text-amber-500" />
            Điểm cao nhất: <span className="font-bold text-[#003B70]">{highScore}</span>
          </div>

          {recentVoucher && (
            <div className="flex items-center gap-1.5 text-xs">
              <span>Mã gần nhất:</span>
              <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                {recentVoucher}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
