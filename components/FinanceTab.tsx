import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Newspaper, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FINANCE_INDICATORS, MERVAL_DATA, FINANCE_NEWS } from '../constants';
import FloatingMenu from './FloatingMenu';

const FinanceTab: React.FC = () => {
  const handleMenuSelect = (option: string) => {
    console.log('Finance option:', option);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-24 p-4 relative">
      <header className="mb-6 sticky top-0 bg-slate-900/90 backdrop-blur z-10 py-2 border-b border-slate-800 -mx-4 px-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-green-400">
          <DollarSign className="fill-current text-green-700" /> Mercado ARG
        </h1>
        <p className="text-slate-400 text-sm">Datos en tiempo real (Simulado)</p>
      </header>

      {/* Tickers Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {FINANCE_INDICATORS.map((item) => (
          <div key={item.name} className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <DollarSign size={64} />
             </div>
             <div className="flex justify-between items-start mb-2">
               <h3 className="font-semibold text-slate-300">{item.name}</h3>
               <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${item.isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                 {item.isUp ? <TrendingUp size={12} className="mr-1"/> : <TrendingDown size={12} className="mr-1"/>}
                 {Math.abs(item.variation)}%
               </span>
             </div>
             
             <div className="grid grid-cols-2 gap-4 mt-2">
               <div>
                 <p className="text-xs text-slate-500 uppercase font-bold">Compra</p>
                 <p className="text-xl font-mono text-white">${item.buy}</p>
               </div>
               <div>
                 <p className="text-xs text-slate-500 uppercase font-bold">Venta</p>
                 <p className="text-xl font-mono text-white">${item.sell}</p>
               </div>
             </div>
          </div>
        ))}
      </section>

      {/* Chart Section */}
      <section className="bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-sm mb-8">
        <h3 className="font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-blue-400"/> Índice S&P Merval
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MERVAL_DATA}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#94a3b8" 
                tick={{fontSize: 12}} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                tick={{fontSize: 12}} 
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
                tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px'}}
                itemStyle={{color: '#fff'}}
                labelStyle={{color: '#94a3b8'}}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* News Section */}
      <section>
        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Newspaper size={20} className="text-slate-400" /> Noticias Financieras
        </h3>
        <div className="space-y-3">
          {FINANCE_NEWS.map((news) => (
            <a key={news.id} href={news.url} className="block bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg p-4 transition-colors">
              <h4 className="font-medium text-slate-200 mb-2 leading-snug">{news.title}</h4>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span className="font-bold text-slate-400">{news.source}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {news.time}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <FloatingMenu 
        items={['Gráficos', 'Noticias Finanzas', 'Finanzas YouTube', 'Finanzas X']}
        onSelect={handleMenuSelect}
      />
    </div>
  );
};

export default FinanceTab;