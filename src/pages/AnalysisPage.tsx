import React, { useState } from 'react';
import { Activity, Play, BrainCircuit, BarChart3, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data generator for the engine
const generateMockAnalysis = (ticker: string) => {
  const bsjp = Math.floor(Math.random() * 100);
  const bandar = Math.floor(Math.random() * 100);
  const fundamental = Math.floor(Math.random() * 100);
  const totalScore = (bsjp + bandar + fundamental) / 3;
  
  let accumStatus = 'Neutral';
  if (bandar > 70) accumStatus = 'Massive Accumulation';
  else if (bandar > 50) accumStatus = 'Normal Accumulation';
  else if (bandar < 30) accumStatus = 'Massive Distribution';
  else accumStatus = 'Normal Distribution';

  let tradingPlan = 'Wait and See';
  if (totalScore > 75) tradingPlan = 'Strong Buy';
  else if (totalScore > 60) tradingPlan = 'Buy on Weakness';
  else if (totalScore < 40) tradingPlan = 'Strong Sell';

  let aiInsight = '';
  if (totalScore > 70) aiInsight = `${ticker} exhibits strong bullish divergence supported by heavy institutional buying; favorable risk-to-reward ratio for entry.`;
  else if (totalScore > 50) aiInsight = `${ticker} is moving sideways with mixed signals; wait for a clear breakout above near-term resistance before committing.`;
  else aiInsight = `${ticker} faces significant bearish pressure and institutional distribution; capital preservation is highly recommended.`;

  return { ticker: ticker.toUpperCase(), bsjp, bandar, fundamental, totalScore, accumStatus, tradingPlan, aiInsight };
};

export function AnalysisPage() {
  const [inputs, setInputs] = useState(['BBCA', 'TLKM', 'ASII', 'GOTO']);
  const [results, setResults] = useState<ReturnType<typeof generateMockAnalysis>[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCards, setShowCards] = useState(false);

  const handleProcess = () => {
    console.log("Captured inputs for processing:", inputs);
    setError(null);
    setShowCards(false);
    
    // Check if all inputs are empty
    const validInputs = inputs.filter(t => t.trim() !== '');
    if (validInputs.length === 0) {
      setError('Please enter at least one valid ticker to process.');
      return;
    }

    // Immediately generate and set results
    const generatedResults = inputs.map(t => 
      t.trim() !== '' ? generateMockAnalysis(t.trim()) : null
    );
    setResults(generatedResults as any);
    setShowCards(true);
  };

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
    if (error) setError(null);
  };

  return (
    <div className="space-y-8 h-full overflow-y-auto pr-4 scrollbar-none pb-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Stock Analysis Engine</h2>
        <p className="text-sm text-slate-400">Multi-input engine for BSJP (Beli Sore Jual Pagi), Bandar Flow, and Fundamental scoring with AI insights.</p>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/50 rounded-lg flex items-center gap-3 text-rose-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Removed Card dependencies to ensure immediate standard Tailwind rendering */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {inputs.map((input, i) => (
              <div key={i} className="flex-1 w-full">
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-2">Ticker {i + 1}</label>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => handleInputChange(i, e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white font-bold placeholder:text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono uppercase text-center"
                  placeholder="TICKER"
                />
              </div>
            ))}
            <button 
              onClick={handleProcess}
              className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm h-[46px]"
            >
              <Play className="w-4 h-4 fill-current" /> Process
            </button>
          </div>
        </div>
      </div>

      {showCards && results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
          {results.map((res, i) => {
            if (!res) return null; // Skip empty inputs

            const isBullish = res.totalScore >= 60;
            const isBearish = res.totalScore <= 40;
            
            return (
              <div key={i} className={cn(
                "bg-slate-900 border border-slate-800 rounded-xl border-t-4 overflow-hidden shadow-sm",
                isBullish ? "border-t-emerald-500" : isBearish ? "border-t-rose-500" : "border-t-slate-500"
              )}>
                {/* Header */}
                <div className="p-5 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold tracking-tight text-white border border-slate-700 font-mono">
                      {res.ticker.substring(0, 2)}
                    </div>
                    <h3 className="text-2xl font-bold font-mono tracking-tight text-white">{res.ticker}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Total Score</p>
                    <p className={cn(
                      "text-2xl font-bold font-mono",
                      isBullish ? "text-emerald-400" : isBearish ? "text-rose-400" : "text-amber-400"
                    )}>{res.totalScore.toFixed(1)}<span className="text-sm text-slate-500">/100</span></p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-6">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {/* Metric 1 */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-500">BSJP Logic</span>
                        <span className="text-sm font-bold font-mono text-white">{res.bsjp}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", res.bsjp > 50 ? "bg-emerald-500" : "bg-rose-500")} style={{ width: `${res.bsjp}%` }} />
                      </div>
                    </div>

                    {/* Metric 2 */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Fundamental</span>
                        <span className="text-sm font-bold font-mono text-white">{res.fundamental}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", res.fundamental > 50 ? "bg-indigo-500" : "bg-rose-500")} style={{ width: `${res.fundamental}%` }} />
                      </div>
                    </div>

                    {/* Bandar Flow full width */}
                    <div className="col-span-2 mt-2">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><BarChart3 className="w-3 h-3" /> Bandar Flow</span>
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider", res.bandar > 50 ? "text-emerald-400" : "text-rose-400")}>{res.accumStatus}</span>
                      </div>
                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex items-center border border-slate-700/50">
                        <div className={cn("h-full transition-all", res.bandar > 50 ? "bg-emerald-500" : "bg-rose-500")} style={{ width: `${res.bandar}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-indigo-400" />
                      <span className="text-[10px] uppercase font-bold text-slate-500">Trading Plan</span>
                    </div>
                    <div className={cn(
                      "px-3 py-2 rounded-lg border text-sm font-semibold",
                      isBullish ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : isBearish ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    )}>
                      {res.tradingPlan}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                      <BrainCircuit className="w-12 h-12 text-indigo-400" />
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">AI Insight</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed relative z-10 italic">
                      "{res.aiInsight}"
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
