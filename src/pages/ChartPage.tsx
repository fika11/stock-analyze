import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/Card';

declare global {
  interface Window {
    TradingView: any;
  }
}

export function ChartPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetInstalled = useRef(false);

  useEffect(() => {
    if (widgetInstalled.current) return;
    
    const initWidget = () => {
      if (window.TradingView && containerRef.current) {
        new window.TradingView.widget({
          "autosize": true,
          "symbol": "IDX:COMPOSITE",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "backgroundColor": "rgba(2, 6, 23, 1)",
          "gridColor": "rgba(30, 41, 59, 0.4)",
          "hide_top_toolbar": false,
          "hide_legend": false,
          "save_image": false,
          "container_id": containerRef.current.id,
        });
        widgetInstalled.current = true;
      }
    };

    const scriptId = 'tradingview-widget-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      initWidget();
    }
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] w-full flex flex-col space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Real-time Chart</h2>
        <p className="text-sm text-slate-400">Powered by TradingView Advanced Chart Widget</p>
      </div>
      <Card className="flex-1 overflow-hidden border-slate-800">
        <CardContent className="h-full w-full p-0">
          <div id="tradingview_widget_main" ref={containerRef} className="h-full w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
