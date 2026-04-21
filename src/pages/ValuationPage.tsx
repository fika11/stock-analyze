import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Calculator, Plus, TrendingDown, TrendingUp, Presentation, AlertCircle, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecapEntry {
  id: number;
  ticker: string;
  price: number;
  peWajar: number;
  labaBersih: number;
  totalEkuitas: number;
  sahamBeredar: number;
  
  // Calculated
  eps: number;
  pbv: number;
  bvps: number;
  roe: number; // as decimal
  nilaiWajarKeseluruhan: number;
  hargaSeharusnya: number;
  status: 'UNDERVALUED' | 'OVERVALUED';
  marginPercent: number; // As decimal
}

export function ValuationPage() {
  const [inputs, setInputs] = useState({
    ticker: 'BBCA',
    price: '9800',
    peWajar: '15',
    labaBersih: '48600000000000',
    totalEkuitas: '243000000000000',
    sahamBeredar: '123280000000',
  });

  const [recap, setRecap] = useState<RecapEntry[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const getRoeBadge = (roe: number) => {
    const val = roe * 100;
    if (val < 8) return { label: 'Lemah', className: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
    if (val <= 15) return { label: 'Normal', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    if (val <= 20) return { label: 'Bagus', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    return { label: 'Sangat Bagus', className: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
  };

  const calculate = () => {
    const p = parseFloat(inputs.price);
    const pe = parseFloat(inputs.peWajar);
    const laba = parseFloat(inputs.labaBersih);
    const ekuitas = parseFloat(inputs.totalEkuitas);
    const saham = parseFloat(inputs.sahamBeredar);

    if (isNaN(p) || isNaN(pe) || isNaN(laba) || isNaN(ekuitas) || isNaN(saham) || saham === 0) {
      return null;
    }

    const eps = laba / saham;
    const bvps = ekuitas / saham;
    const pbv = p / bvps;
    const roe = laba / ekuitas;
    const nilaiWajarKeseluruhan = pe * laba;
    const hargaSeharusnya = nilaiWajarKeseluruhan / saham;
    
    let status: 'UNDERVALUED' | 'OVERVALUED' = 'OVERVALUED';
    let marginPercent = 0;

    if (hargaSeharusnya > p) {
      status = 'UNDERVALUED';
      marginPercent = (hargaSeharusnya - p) / hargaSeharusnya;
    } else {
      status = 'OVERVALUED';
      marginPercent = (p - hargaSeharusnya) / hargaSeharusnya;
    }

    return {
      ticker: inputs.ticker.toUpperCase(),
      price: p, peWajar: pe, labaBersih: laba, totalEkuitas: ekuitas, sahamBeredar: saham,
      eps, pbv, bvps, roe, nilaiWajarKeseluruhan, hargaSeharusnya, status, marginPercent
    };
  };

  const handleSave = () => {
    const res = calculate();
    if (res) {
      setRecap(prev => [{ ...res, id: Date.now() }, ...prev]);
    }
  };

  const handleRemove = (id: number) => {
    setRecap(prev => prev.filter(item => item.id !== id));
  };

  const formatIDRNumber = (val: string) => {
    if (!val) return '';
    if (val === '-') return '-';
    const cleaned = val.replace(/\./g, '');
    const parsed = parseInt(cleaned, 10);
    if (isNaN(parsed)) return '';
    return parsed.toLocaleString('id-ID');
  };

  const handleFormattedNumberChange = (field: string, value: string) => {
    const raw = value.replace(/\./g, '');
    if (/^-?\d*$/.test(raw)) {
      handleInputChange(field, raw);
    }
  };

  const currCalculation = calculate();

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-4 scrollbar-none pb-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Value Investing Calculator</h2>
        <p className="text-sm text-slate-400">Integrated manual calculation based on absolute earnings and fundamental equity data.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* INPUT SECTION */}
        <div className="xl:col-span-5 space-y-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Manual Input</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Ticker (Emiten)</label>
                    <input 
                      type="text" 
                      value={inputs.ticker}
                      onChange={(e) => handleInputChange('ticker', e.target.value.toUpperCase())}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-bold placeholder:text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono uppercase"
                      placeholder="BBCA"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Current Price (Rp)</label>
                    <input 
                      type="text" 
                      value={formatIDRNumber(inputs.price)}
                      onChange={(e) => handleFormattedNumberChange('price', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">PE Wajar (Target PE)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={inputs.peWajar}
                      onChange={(e) => handleInputChange('peWajar', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Laba Bersih (Net Profit)</label>
                    <input 
                      type="text" 
                      value={formatIDRNumber(inputs.labaBersih)}
                      onChange={(e) => handleFormattedNumberChange('labaBersih', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Total Ekuitas (Total Equity)</label>
                    <input 
                      type="text" 
                      value={formatIDRNumber(inputs.totalEkuitas)}
                      onChange={(e) => handleFormattedNumberChange('totalEkuitas', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Jumlah Saham Beredar</label>
                    <input 
                      type="text" 
                      value={formatIDRNumber(inputs.sahamBeredar)}
                      onChange={(e) => handleFormattedNumberChange('sahamBeredar', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSave}
                  disabled={!currCalculation}
                  className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-xs"
                >
                  <Save className="w-4 h-4" /> Save to Recap
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* LIVE CALCULATION SECTION */}
        <div className="xl:col-span-7 space-y-4">
          <Card className="bg-slate-900 border-slate-800 h-full">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <Presentation className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Live Analysis</h3>
              </div>

              {!currCalculation ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center border-2 border-dashed border-slate-800 rounded-xl">
                  <AlertCircle className="w-8 h-8 mb-3 opacity-50" />
                  <p className="text-sm">Please fill all input fields with valid numbers to view the automated calculation.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col space-y-6">
                  
                  {/* Summary Box */}
                  <div className={cn(
                    "p-6 rounded-xl border flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left",
                    currCalculation.status === 'UNDERVALUED' ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"
                  )}>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Kesimpulan (Conclusion)</p>
                      <div className="flex items-center gap-3">
                        <h4 className={cn(
                          "text-3xl font-black tracking-tight",
                          currCalculation.status === 'UNDERVALUED' ? "text-emerald-400" : "text-rose-400"
                        )}>
                          {currCalculation.status}
                        </h4>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Harga Seharusnya</p>
                        <p className="text-xl font-bold font-mono text-white">Rp {currCalculation.hargaSeharusnya.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</p>
                      </div>
                      <div className="w-px bg-slate-800 hidden lg:block"></div>
                      <div className="text-center">
                        <p className={cn(
                          "text-[10px] uppercase font-bold text-slate-500 mb-1",
                          currCalculation.status === 'UNDERVALUED' ? "text-emerald-500/80" : "text-rose-500/80"
                        )}>
                          {currCalculation.status === 'UNDERVALUED' ? 'Diskon (Upside)' : 'Premium (Over)'}
                        </p>
                        <p className={cn(
                          "text-xl font-bold font-mono flex items-center justify-center gap-1",
                          currCalculation.status === 'UNDERVALUED' ? "text-emerald-400" : "text-rose-400"
                        )}>
                          {(currCalculation.marginPercent * 100).toFixed(2)}%
                          {currCalculation.status === 'UNDERVALUED' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Automated Formulas Table */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                       <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">EPS</p>
                       <p className="text-lg font-bold font-mono text-white break-all">Rp {currCalculation.eps.toLocaleString('id-ID', { maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                       <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">PBVS (Book Val)</p>
                       <p className="text-lg font-bold font-mono text-white break-all">Rp {currCalculation.bvps.toLocaleString('id-ID', { maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                       <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">PBV</p>
                       <p className="text-lg font-bold font-mono text-white">{currCalculation.pbv.toFixed(2)}x</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                       <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">ROE</p>
                       <div className="flex items-center gap-2">
                         <p className="text-lg font-bold font-mono text-white">{(currCalculation.roe * 100).toFixed(2)}%</p>
                         <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-bold uppercase", getRoeBadge(currCalculation.roe).className)}>
                            {getRoeBadge(currCalculation.roe).label}
                         </span>
                       </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Nilai Wajar Keseluruhan</p>
                    <p className="text-lg font-bold font-mono text-white break-all">Rp {currCalculation.nilaiWajarKeseluruhan.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</p>
                    <p className="text-xs text-slate-500 mt-1">PE Wajar ({currCalculation.peWajar}) × Laba Bersih</p>
                  </div>

                  {/* ROE Reference Legend */}
                  <div className="mt-auto">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">ROE Reference Table</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-[10px] px-2 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">&lt; 8% Lemah</span>
                      <span className="text-[10px] px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">8-15% Normal</span>
                      <span className="text-[10px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">15-20% Bagus</span>
                      <span className="text-[10px] px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">&gt; 20% Sangat Bagus</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RECAP TABLE */}
      {recap.length > 0 && (
        <Card className="bg-slate-900 border-slate-800 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-5 border-b border-slate-800/50 bg-slate-900/50">
              <h3 className="text-lg font-bold text-white">Recap Comparison</h3>
              <p className="text-xs text-slate-400">List of saved valuations for quick comparison.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/50 border-b border-slate-800/80 text-[10px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-4 font-bold">Ticker</th>
                    <th className="p-4 font-bold">Harga Saat Ini</th>
                    <th className="p-4 font-bold">PE Wajar</th>
                    <th className="p-4 font-bold">ROE</th>
                    <th className="p-4 font-bold">Harga Seharusnya</th>
                    <th className="p-4 font-bold">Margin / Diskon</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {recap.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 font-bold font-mono text-white">{row.ticker}</td>
                      <td className="p-4 font-mono">Rp {row.price.toLocaleString('id-ID')}</td>
                      <td className="p-4 font-mono text-indigo-400">{row.peWajar.toFixed(1)}</td>
                      <td className="p-4">
                        <span className={cn("text-[10px] px-2 py-0.5 rounded font-bold uppercase", getRoeBadge(row.roe).className)}>
                          {(row.roe * 100).toFixed(1)}% {getRoeBadge(row.roe).label}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-white">Rp {row.hargaSeharusnya.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</td>
                      <td className="p-4 font-mono">
                        <span className={cn(
                          row.status === 'UNDERVALUED' ? "text-emerald-400" : "text-rose-400"
                        )}>
                          {(row.marginPercent * 100).toFixed(2)}%
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          "text-[10px] px-2 py-1 rounded-sm border font-bold uppercase tracking-wider",
                          row.status === 'UNDERVALUED' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        )}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleRemove(row.id)}
                          className="text-[10px] uppercase font-bold text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
