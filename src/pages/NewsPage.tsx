import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { ExternalLink, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

const newsItems = [
  {
    id: 1,
    title: 'Bank Indonesia Holds Benchmark Interest Rate at 6.00%',
    source: 'Bloomberg Linea',
    time: '2 hours ago',
    category: 'Macro',
    sentiment: 'neutral',
    snippet: 'The central bank maintained its benchmark rate to ensure inflation remains within target and to stabilize the Rupiah exchange rate against global uncertainties.',
    analysisUrls: ['/analysis?ticker=BBCA', '/analysis?ticker=BBRI']
  },
  {
    id: 2,
    title: 'BBCA Reports Record Profit for Q1 2024, Driven by Loan Growth',
    source: 'CNBC Indonesia',
    time: '4 hours ago',
    category: 'Earnings',
    sentiment: 'bullish',
    snippet: 'PT Bank Central Asia Tbk. (BBCA) recorded a net profit of Rp 12.9 trillion in the first quarter of 2024, exceeding analyst expectations.',
    analysisUrls: ['/analysis?ticker=BBCA']
  },
  {
    id: 3,
    title: 'Foreign Outflow Continues as US Treasury Yields Spike',
    source: 'Reuters',
    time: '6 hours ago',
    category: 'Market',
    sentiment: 'bearish',
    snippet: 'Indonesian markets saw net foreign selling for the fourth consecutive day as US economic data pushed treasury yields higher, pressuring emerging markets.',
    analysisUrls: []
  },
  {
    id: 4,
    title: 'GOTO Achieves Positive Adjusted EBITDA Target Earlier Than Expected',
    source: 'Tech in Asia',
    time: '1 day ago',
    category: 'Tech / Earnings',
    sentiment: 'bullish',
    snippet: 'GoTo Group announced it reached positive adjusted EBITDA in Q4 2023, driven by aggressive cost-cutting measures and improved monetization.',
    analysisUrls: ['/analysis?ticker=GOTO']
  }
];

export function NewsPage() {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Macro', 'Earnings', 'Market'];

  const filteredNews = filter === 'All' ? newsItems : newsItems.filter(item => item.category.includes(filter));

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-4 scrollbar-none pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Economic News & Updates</h2>
          <p className="text-sm text-slate-400">Curated macroeconomic and microeconomic news impacting the Indonesian market.</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-md transition-colors",
                  filter === f ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((item) => (
          <Card key={item.id} className="group hover:border-slate-700 transition-colors">
            <CardContent className="p-5 flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500">{item.source}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[10px] font-bold text-slate-500">{item.time}</span>
                </div>
                <span className={cn(
                  "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border",
                  item.sentiment === 'bullish' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  item.sentiment === 'bearish' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                  "bg-slate-800 text-slate-400 border-slate-700"
                )}>
                  {item.sentiment}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-200 mb-2 leading-tight group-hover:text-indigo-400 transition-colors">{item.title}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4 flex-1">
                {item.snippet}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-800/50 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{item.category}</span>
                {item.analysisUrls.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Analyze:</span>
                    {item.analysisUrls.map((url, i) => (
                      <a key={i} href={url} className="text-[10px] font-bold font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                        {url.split('=')[1]} <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
