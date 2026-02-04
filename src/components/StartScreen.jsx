export default function StartScreen({ onStart }) {

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden p-4 text-center">
      
      {/* Background Decor - ปรับขนาดตามหน้าจอ */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] md:w-[500px] h-[280px] md:h-[500px] bg-amber-500/10 blur-[80px] md:blur-[120px] rounded-full" />

      {/* Main Content - ดันขึ้นสูงนิดนึงเพื่อให้สมดุล */}
      <div className="relative z-10 animate-in fade-in zoom-in duration-1000 -mt-20 md:-mt-32 w-full max-w-lg">
        
        {/* Logo - ปรับขนาด Responsive */}
        <div className="flex justify-center mb-4 md:mb-6">
          <img 
            src="/game-logo.png" 
            alt="Logo"
            className="w-32 h-32 md:w-56 md:h-56 object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse"
          />
        </div>
        
        {/* ชื่อเกม - ปรับขนาด Font ตามมือถือ */}
        <h1 className="text-4xl md:text-8xl font-black italic uppercase tracking-tighter text-white mb-2">
          Infinite <span className="text-amber-500">Step</span>
        </h1>
        
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-10 md:mb-12">
          <div className="h-[1px] w-8 md:w-12 bg-slate-700" />
          <p className="text-slate-400 font-mono text-[9px] md:text-xs uppercase tracking-[0.3em]">
            The Eternal Expedition
          </p>
          <div className="h-[1px] w-8 md:w-12 bg-slate-700" />
        </div>

        {/* ปุ่มเริ่มเกม - Full width บนมือถือ */}
        <div className="px-4">
          <button 
            onClick={onStart}
            className="group relative w-full md:w-auto px-10 py-4 bg-transparent transition-all active:scale-95"
          >
            <div className="absolute inset-0 bg-amber-600 skew-x-[-12deg] shadow-[0_0_20px_rgba(217,119,6,0.4)]" />
            <span className="relative text-lg font-black italic uppercase tracking-widest text-black">
              Press Start to Journey
            </span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-8 md:bottom-16 left-0 right-0 z-10 px-4">
        <p className="text-slate-500 text-[9px] md:text-[10px] uppercase font-bold tracking-[0.2em]">
          Version 1.0.0 - Alpha Release
        </p>
        <p className="text-amber-500/50 text-[10px] md:text-[11px] font-black uppercase tracking-widest italic">
          Developed by Nanlnwza007
        </p>
        <p className="text-slate-400/80 text-[11px] md:text-[12px] font-medium italic mt-2 animate-pulse">
          Hope you enjoy
        </p>
      </div>
    </div>
  );
}