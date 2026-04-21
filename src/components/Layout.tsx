import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LineChart, Newspaper, Activity, Calculator, HelpCircle, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Clock } from './Clock';
import React, { useState } from 'react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/chart', label: 'Real-time Chart', icon: LineChart },
  { path: '/news', label: 'Economic News', icon: Newspaper },
  { path: '/analysis', label: 'Stock Analysis', icon: Activity },
  { path: '/valuation', label: 'Value Investing', icon: Calculator },
  { path: '/tutorials', label: 'Tutorials', icon: HelpCircle },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex overflow-hidden font-sans">
      {/* Mobile sidebar overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-slate-800 flex flex-col p-4 bg-[#020617] transition-transform duration-300 ease-in-out",
          !isSidebarOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-xs">S</div>
            STOCK ANALYZE
          </h1>
          <Clock />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto w-full scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors cursor-pointer",
                  isActive
                    ? "bg-slate-800 text-slate-50 font-medium"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-slate-50" : "text-slate-400 group-hover:text-slate-300")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-4">
          <div className="p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-xl">
            <div className="text-xs text-indigo-300 font-medium mb-1">Pro Account</div>
            <div className="text-[10px] text-indigo-400 opacity-80">Access to AI Insights active</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-hidden flex flex-col gap-6 bg-[#020617]">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 lg:hidden rounded-lg bg-slate-800 text-slate-400 hover:text-white self-start"
        >
          <Menu className="w-5 h-5" />
        </button>
        {children}
      </main>
    </div>
  );
}
