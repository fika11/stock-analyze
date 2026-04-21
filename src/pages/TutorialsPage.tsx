import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const tutorials = [
  {
    id: 1,
    title: "What is BSJP (Beli Sore Jual Pagi)?",
    short: "A trading strategy focusing on overnight momentum.",
    content: "BSJP (Beli Sore Jual Pagi) translates to 'Buy Afternoon, Sell Morning'. It is a trading strategy where a trader buys a stock right before the market closes and sells it immediately after the market opens the next day. The logic relies on the assumption that strong closing momentum will carry over into the next day's opening bell. In our engine, a high BSJP score indicates strong closing volume and price action.",
  },
  {
    id: 2,
    title: "Understanding Bandar Flow",
    short: "Tracking institutional money movement.",
    content: "Bandar Flow (or Foreign/Institutional Flow) is the analysis of large transaction volumes by institutional investors or market makers ('Bandar'). When Bandar Flow shows 'Massive Accumulation', it means large institutions are aggressively buying the stock, which often precedes a price increase. Conversely, 'Distribution' indicates they are selling off their positions to retail investors.",
  },
  {
    id: 3,
    title: "The Graham Number (Intrinsic Value)",
    short: "A conservative valuation metric by Benjamin Graham.",
    content: "The Graham Number is a figure that measures a stock's fundamental value by taking into account the company's earnings per share (EPS) and book value per share (BVPS). The formula is √(22.5 × EPS × BVPS). According to Benjamin Graham (the father of value investing), a stock is generally considered fairly priced if its price does not exceed this number. A price below the Graham Number indicates a potential Margin of Safety.",
  },
  {
    id: 4,
    title: "Margin of Safety (MoS)",
    short: "The buffer between current price and intrinsic value.",
    content: "Margin of Safety is the principle of buying securities at a significant discount to their intrinsic value. If a stock's intrinsic value (like the Graham Number) is 10,000 but the current price is 7,000, the Margin of Safety is 30%. This buffer protects investors from errors in calculation or unforeseen market downturns.",
  }
];

export function TutorialsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  return (
    <div className="space-y-6 max-w-4xl h-full overflow-y-auto pr-4 scrollbar-none pb-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Interactive Documentation</h2>
        <p className="text-sm text-slate-400">Learn the concepts and formulas behind the Stock Analyze engine.</p>
      </div>

      <div className="space-y-4">
        {tutorials.map((tutorial) => {
          const isExpanded = expandedId === tutorial.id;
          
          return (
            <Card 
              key={tutorial.id} 
              className={cn(
                "border-slate-800 transition-all duration-300 overflow-hidden cursor-pointer group",
                isExpanded ? "border-indigo-500/50 shadow-lg shadow-indigo-500/10" : "hover:border-slate-700"
              )}
              onClick={() => setExpandedId(isExpanded ? null : tutorial.id)}
            >
              <CardContent className="p-0">
                <div className={cn(
                  "px-6 py-5 flex items-center justify-between transition-colors",
                  isExpanded ? "bg-slate-900" : "bg-slate-900/50 group-hover:bg-slate-900/80"
                )}>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      isExpanded ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400 group-hover:text-white"
                    )}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={cn(
                        "text-base font-bold transition-colors",
                        isExpanded ? "text-white" : "text-slate-200 group-hover:text-white"
                      )}>
                        {tutorial.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">{tutorial.short}</p>
                    </div>
                  </div>
                  <div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-indigo-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
                    )}
                  </div>
                </div>
                
                <div className={cn(
                  "px-6 overflow-hidden transition-all duration-300 ease-in-out bg-slate-900/30",
                  isExpanded ? "max-h-96 py-6 border-t border-slate-800/50" : "max-h-0 py-0"
                )}>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {tutorial.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
