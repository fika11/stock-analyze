import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format to WITA timezone (UTC+8) logic
  const utc = time.getTime() + (time.getTimezoneOffset() * 60000);
  const witaTime = new Date(utc + (3600000 * 8));

  return (
    <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
      <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
        WITA Timezone
      </div>
      <div className="text-2xl font-mono font-medium text-indigo-400">
        {format(witaTime, 'HH:mm:ss')}
      </div>
      <div className="text-[11px] text-slate-400 mt-0.5">
        {format(witaTime, 'EEE, d MMM yyyy')}
      </div>
    </div>
  );
}
