import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Calculator, Play, Activity, BarChart3, BrainCircuit, AlertCircle } from 'lucide-react';

const overviewData = [
  { name: 'IHSG (IDX Composite)', value: '7,185.00', change: '+0.45%', up: true },
  { name: 'USD / IDR', value: '16,050.25', change: '-0.12%', up: false },
  { name: 'S&P 500', value: '5,304.72', change: '+0.21%', up: true },
];

export const formatIDRNumber = (val: number | string) => {
  if (!val) return '';
  const num = typeof val === 'string' ? parseInt(val.replace(/\./g, ''), 10) : val;
  if (isNaN(num)) return '';
  return num.toLocaleString('id-ID');
};

const generateEngineData = (ticker: string) => {
  // Mock foundational data based on Valuations
  const labaBersih = Math.floor(Math.random() * 50000) * 1000000000; 
  const totalEkuitas = labaBersih * (Math.random() * 5 + 3);
  const sahamBeredar = Math.floor(Math.random() * 10000) * 10000000;
  
  const eps = labaBersih / sahamBeredar;
  const roe = (labaBersih / totalEkuitas) * 100;
  let fundamentalScore = 50; 
  
  if (roe > 20) fundamentalScore += 30;
  else if (roe > 15) fundamentalScore += 20;
  else if (roe < 8) fundamentalScore -= 20;

  const bsjp = Math.floor(Math.random() * 40) + 40; 
  const bandar = Math.floor(Math.random() * 100);
  
  let accumStatus = 'Neutral';
  if (bandar > 70) accumStatus = 'Massive Accumulation';
  else if (bandar > 50) accumStatus = 'Normal Accumulation';
  else if (bandar < 30) accumStatus = 'Massive Distribution';
  else accumStatus = 'Normal Distribution';

  const totalScore = (bsjp + bandar + fundamentalScore) / 3;

  let tradingPlan = 'Wait and See';
  if (totalScore > 75) tradingPlan = 'Strong Buy';
  else if (totalScore > 60) tradingPlan = 'Buy on Weakness';
  else if (totalScore < 40) tradingPlan = 'Strong Sell';

  let aiInsight = '';
  if (totalScore > 60) aiInsight = `${ticker} shows excellent fundamental structure (ROE: ${roe.toFixed(1)}%). Paired with current Bandar Flow, it presents a solid entry point.`;
  else aiInsight = `Caution on ${ticker}. The fundamental metrics are misaligned with institutional flow. Preserve capital.`;

  return {
    ticker: ticker.toUpperCase(),
    labaBersih,
    totalEkuitas,
    eps,
    roe,
    bsjp,
    bandar,
    accumStatus,
    fundamentalScore,
    totalScore,
    tradingPlan,
    aiInsight
  };
};

export function Dashboard() {
  const [searchInput, setSearchInput] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof generateEngineData> | null>(null);

  const handleAnalyze = () => {
    setError(null);
    setShowAnalysis(false);

    if (!searchInput.trim()) {
      setError('Please enter a valid ticker to analyze.');
      return;
    }

    const data = generateEngineData(searchInput.trim());
    setAnalysisResult(data);
    setShowAnalysis(true);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pr-4 scrollbar-none pb-8">
      <header className="flex justify-between items-center mb-6 shrink-0 flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Market Dashboard</h2>
        <div className="flex gap-4 items-center">
          {error && (
             <div className="text-xs text-rose-400 font-bold bg-rose-500/10 px-3 py-2 rounded-lg border border-rose-500/20 flex items-center gap-2">
               <AlertCircle className="w-3 h-3" />
               {error}
             </div>
          )}
          <div className="relative">
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Search ticker (e.g. BBRI)" 
              className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:border-indigo-500 text-slate-300 font-mono uppercase transition-colors uppercase placeholder:normal-case"
            />
          </div>
          <button 
            onClick={handleAnalyze}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-2 flex-shrink-0"
          >
            <Play className="w-4 h-4 fill-current" /> Analyze Engine
          </button>
        </div>
      </header>

      {/* DYNAMIC ANALYSIS RESULT OVERRIDE */}
      {showAnalysis && analysisResult && (
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-3">
             <div className="text-sm uppercase font-bold text-slate-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                Engine Results for {analysisResult.ticker}
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* CARD 1: BSJP */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm border-t-4 border-t-indigo-500 transition-all">
               <div className="flex justify-between items-start mb-2">
                 <span className="text-[10px] uppercase font-bold text-slate-500">BSJP Momentum</span>
                 <Activity className="w-4 h-4 text-indigo-400" />
               </div>
               <div className="text-2xl font-bold font-mono text-white mb-2">{analysisResult.bsjp.toFixed(0)}<span className="text-sm text-slate-500">/100</span></div>
               <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={cn("h-full transition-all", analysisResult.bsjp > 50 ? "bg-indigo-500" : "bg-slate-500")} style={{ width: `${analysisResult.bsjp}%` }} />
               </div>
            </div>

            {/* CARD 2: Bandar Flow & Accumulation */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm border-t-4 border-t-emerald-500 transition-all">
               <div className="flex justify-between items-start mb-2">
                 <span className="text-[10px] uppercase font-bold text-slate-500">Bandar Flow</span>
                 <BarChart3 className="w-4 h-4 text-emerald-400" />
               </div>
               <div className="text-lg font-bold font-mono text-white mb-1 truncate leading-tight mt-1">{analysisResult.accumStatus}</div>
               <div className="text-[10px] font-bold text-emerald-500 uppercase">Power: {analysisResult.bandar}%</div>
            </div>

            {/* CARD 3: Fundamental Score & Mapping */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm transition-all border-t-4 border-t-slate-500">
               <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">Fundamental Profile</div>
               <div className="grid grid-cols-2 gap-2 mt-2">
                 <div>
                   <p className="text-[9px] text-slate-500 uppercase">Laba Bersih</p>
                   <p className="text-[11px] font-bold font-mono truncate">Rp {formatIDRNumber(analysisResult.labaBersih)}</p>
                 </div>
                 <div>
                   <p className="text-[9px] text-slate-500 uppercase">Ekuitas</p>
                   <p className="text-[11px] font-bold font-mono truncate">Rp {formatIDRNumber(analysisResult.totalEkuitas)}</p>
                 </div>
                 <div>
                   <p className="text-[9px] text-slate-500 uppercase">ROE</p>
                   <p className="text-[11px] font-bold font-mono text-emerald-400">{analysisResult.roe.toFixed(2)}%</p>
                 </div>
                 <div>
                   <p className="text-[9px] text-slate-500 uppercase">Score</p>
                   <p className="text-[11px] font-bold font-mono">{analysisResult.fundamentalScore.toFixed(0)}/100</p>
                 </div>
               </div>
            </div>

            {/* CARD 4: Trading Plan */}
            <div className={cn(
              "border rounded-xl p-4 shadow-sm flex flex-col justify-center border-t-4 transition-all",
              analysisResult.totalScore > 60 ? "bg-emerald-500/10 border-emerald-500/30 border-t-emerald-500" : "bg-rose-500/10 border-rose-500/30 border-t-rose-500"
            )}>
               <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Trading Plan</div>
               <div className={cn(
                 "text-xl font-bold uppercase tracking-wider",
                 analysisResult.totalScore > 60 ? "text-emerald-400" : "text-rose-400"
               )}>{analysisResult.tradingPlan}</div>
               <div className="text-xs font-bold text-white mt-2 flex items-center justify-between">
                  <span>Total Score:</span> <span className="font-mono text-lg">{analysisResult.totalScore.toFixed(1)}/100</span>
               </div>
            </div>

            <div className="col-span-1 md:col-span-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 relative overflow-hidden transition-all">
               <div className="absolute top-0 right-0 p-3 opacity-10">
                 <BrainCircuit className="w-12 h-12 text-indigo-400" />
               </div>
               <div className="flex items-center gap-2 mb-1.5">
                 <div className="w-2 h-2 rounded-full bg-indigo-500" />
                 <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">AI Insight</h4>
               </div>
               <p className="text-xs text-slate-300 leading-relaxed relative z-10 italic">
                 "{analysisResult.aiInsight}"
               </p>
            </div>
          </div>
          
          <div className="h-px w-full bg-slate-800 my-8"></div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-12 gap-4 flex-1 auto-rows-fr">
        {/* Top Metric Cards */}
{overviewData.map((item) => (
          <Card key={item.name} className="col-span-full lg:col-span-4 flex flex-col justify-between bg-slate-900 border-slate-800">
            <CardContent className="h-full flex flex-col justify-between p-4">
              <div className="text-[10px] uppercase font-bold text-slate-500">{item.name}</div>
              <div className="flex items-end justify-between mt-4">
                <span className="text-xl font-bold font-mono">{item.value}</span>
                <span className={cn("text-xs font-bold", item.up ? "text-emerald-500" : "text-rose-500")}>
                  {item.change} {item.up ? '▲' : '▼'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Fear & Greed */}
        <Card className="col-span-full lg:col-span-3 lg:row-span-2 flex flex-col justify-center items-center relative overflow-hidden bg-[#0f172a] border-slate-800">
          <CardContent className="p-4 w-full h-full flex flex-col items-center justify-center">
            <div className="text-[10px] uppercase font-bold text-slate-500 mt-2 mb-6">Fear & Greed Index</div>
            <div className="relative w-32 h-16 overflow-hidden">
              <div className="absolute w-32 h-32 border-[12px] border-slate-800 rounded-full" />
              <div 
                className="absolute w-32 h-32 border-[12px] border-emerald-500 rounded-full clip-path-half" 
                style={{ transform: 'rotate(20deg)', clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}
              />
            </div>
            <div className="text-3xl font-bold mt-2">62</div>
            <div className="text-xs font-bold text-emerald-500 tracking-widest mt-1">GREED</div>
            <div className="mt-4 w-full px-4 text-[10px] text-slate-500 flex justify-between uppercase font-bold">
              <span>Fear</span>
              <span>Extreme Greed</span>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Momentum */}
        <Card className="col-span-full lg:col-span-9 lg:row-span-2 relative bg-slate-900/40 border-slate-800">
          <CardContent className="p-4 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="text-[10px] uppercase font-bold text-slate-500">Real-time Trading Volatility</div>
              <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
              </div>
            </div>
            
            <div className="flex-1 w-full flex items-end gap-1 px-2 pt-4">
              <div className="flex-1 bg-slate-800 h-[60%] rounded-t-sm"></div>
              <div className="flex-1 bg-slate-800 h-[40%] rounded-t-sm"></div>
              <div className="flex-1 bg-emerald-500 h-[80%] rounded-t-sm"></div>
              <div className="flex-1 bg-emerald-500 h-[90%] rounded-t-sm"></div>
              <div className="flex-1 bg-rose-500 h-[70%] rounded-t-sm"></div>
              <div className="flex-1 bg-rose-500 h-[30%] rounded-t-sm"></div>
              <div className="flex-1 bg-emerald-500 h-[50%] rounded-t-sm"></div>
              <div className="flex-1 bg-emerald-500 h-[75%] rounded-t-sm"></div>
              <div className="flex-1 bg-emerald-600 h-[95%] rounded-t-sm"></div>
              <div className="flex-1 bg-emerald-600 h-[85%] rounded-t-sm"></div>
            </div>
            
            <div className="mt-6 grid grid-cols-4 gap-2">
              <div className="p-2 bg-slate-950 border border-emerald-500/30 rounded-lg">
                <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-1">Network Ping</div>
                <div className="text-sm font-bold">12ms</div>
              </div>
              <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-1">Server Status</div>
                <div className="text-sm font-bold text-emerald-500">Online</div>
              </div>
              <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-1">Active APIs</div>
                <div className="text-sm font-bold font-mono">3/3</div>
              </div>
              <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mb-1">Session ID</div>
                <div className="text-sm font-bold truncate">SYS_99182x</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Economic Calendar */}
        <Card className="col-span-full lg:col-span-3 lg:row-span-3 bg-slate-900 border-slate-800">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-4">Economic Calendar</div>
            <div className="space-y-4 flex-1">
              <div className="border-l-2 border-indigo-500 pl-3 py-1">
                <div className="text-[10px] text-indigo-400 font-bold mb-0.5">TODAY · 19:30</div>
                <div className="text-xs font-semibold text-slate-200">US Core PCE Price Index</div>
                <div className="text-[10px] text-rose-400/80 mt-0.5">High Impact</div>
              </div>
              <div className="border-l-2 border-slate-700 pl-3 py-1">
                <div className="text-[10px] text-slate-400 font-bold mb-0.5">MON · 09:00</div>
                <div className="text-xs font-semibold text-slate-200">ID Inflation Rate YoY</div>
                <div className="text-[10px] text-amber-400/80 mt-0.5">Medium Impact</div>
              </div>
              <div className="border-l-2 border-slate-700 pl-3 py-1">
                <div className="text-[10px] text-slate-400 font-bold mb-0.5">TUE · 21:00</div>
                <div className="text-xs font-semibold text-slate-200">US Consumer Confidence</div>
                <div className="text-[10px] text-amber-400/80 mt-0.5">Medium Impact</div>
              </div>
              <div className="border-l-2 border-slate-700 pl-3 py-1">
                <div className="text-[10px] text-slate-400 font-bold mb-0.5">WED · 08:30</div>
                <div className="text-xs font-semibold text-slate-200">CN Manufacturing PMI</div>
                <div className="text-[10px] text-rose-400/80 mt-0.5">High Impact</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Analysis */}
        <Card className="col-span-full lg:col-span-3 lg:row-span-2 bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex flex-col h-full">
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-3">Recent Analysis</div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between p-2 bg-slate-950/50 rounded-lg border border-slate-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center text-[10px] font-bold font-mono">BBRI</div>
                  <div>
                    <div className="text-xs font-bold font-mono">BBRI</div>
                    <div className="text-[10px] text-slate-500 font-medium">Bank Rakyat</div>
                  </div>
                </div>
                <div className="text-xs text-emerald-500 font-bold tracking-wider">ACC</div>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-950/50 rounded-lg border border-slate-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center text-[10px] font-bold font-mono">TLKM</div>
                  <div>
                    <div className="text-xs font-bold font-mono">TLKM</div>
                    <div className="text-[10px] text-slate-500 font-medium">Telkom Ind.</div>
                  </div>
                </div>
                <div className="text-xs text-rose-500 font-bold tracking-wider">DIST</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Value Investing Quick */}
        <Card className="col-span-full lg:col-span-6 lg:row-span-2 flex flex-col justify-center bg-indigo-900/10 border-indigo-500/20">
          <CardContent className="p-4 w-full">
            <div className="flex gap-4 items-center h-full">
              <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20 shrink-0">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-bold truncate">Value Investing Pro</div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">Total Equity and Net Profit Analysis integration active.</div>
                <div className="grid grid-cols-4 gap-2 mt-4 w-full">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 uppercase font-bold mb-1">Global ROE</span>
                    <span className="text-xs font-mono font-semibold text-indigo-400">18.5%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 uppercase font-bold mb-1">Avg PE</span>
                    <span className="text-xs font-mono font-semibold text-slate-300">12.4x</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 uppercase font-bold mb-1">Equity</span>
                    <span className="text-xs font-mono font-semibold text-emerald-500">Trending</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 uppercase font-bold mb-1">Status</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 rounded px-1.5 py-0.5 self-start">OPTIMAL</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
