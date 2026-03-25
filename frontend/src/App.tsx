import React, { useState, useEffect, useTransition, memo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowUpRight, MessageSquare, Filter, Layers } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for tailwind classes */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HNEntry {
  rank: number;
  title: string;
  points: number;
  comments: number;
}

interface Meta {
  logId: string;
  executionTimeMs: number;
  filterApplied: string;
  totalExtracted: number;
  totalReturned: number;
}

const API_URL = 'http://localhost:3001/api';

// --- Memoized Sub-components ---

const Header = memo(() => (
  <header className="max-w-7xl mx-auto border-b border-white/10 pb-8 mb-12">
    <div className="flex flex-col md:flex-row justify-between items-baseline gap-4">
      <div>
        <span className="text-hn-orange font-mono text-xs tracking-widest uppercase mb-2 block">
          Vol. 2026 — Issue 03.24
        </span>
        <h1 className="text-6xl md:text-8xl font-serif leading-none italic">
          Hacker News
        </h1>
        <p className="font-mono text-sm text-white/40 mt-2 uppercase tracking-tighter">
          The Editorial Edition — Automated Web Scraper
        </p>
      </div>
      <div className="text-right flex flex-col items-end">
        <div className="bg-hn-orange px-3 py-1 text-black font-mono text-xs font-bold mb-2">
          LIVE DATA
        </div>
        <span className="font-mono text-[10px] text-white/30">
          SCRAPED FROM NEWS.YCOMBINATOR.COM
        </span>
      </div>
    </div>
  </header>
));

const FilterBar = memo(({ 
  currentFilter, 
  onFilterChange, 
  meta, 
  isPending 
}: { 
  currentFilter: string; 
  onFilterChange: (id: string) => void; 
  meta: Meta | null;
  isPending: boolean;
}) => (
  <nav className="max-w-7xl mx-auto mb-16 border-y border-white/10 py-6 flex flex-col md:flex-row items-center justify-between gap-8 relative">
    <div className="flex flex-wrap items-center gap-4">
      <span className="font-mono text-xs text-white/40 uppercase mr-4 flex items-center gap-2">
        <Filter size={14} /> Filter by:
      </span>
      {[
        { id: 'none', label: 'ALL ENTRIES' },
        { id: 'more_than_5', label: '> 5 WORDS (COMMENTS)' },
        { id: 'less_or_equal_to_5', label: '≤ 5 WORDS (POINTS)' },
      ].map((f) => (
        <button
          key={f.id}
          onClick={() => onFilterChange(f.id)}
          disabled={isPending}
          className={cn(
            "font-mono text-xs px-4 py-2 border transition-all duration-300 disabled:opacity-50",
            currentFilter === f.id 
              ? "bg-white text-black border-white" 
              : "border-white/20 text-white/50 hover:border-white/60 hover:text-white"
          )}
        >
          {f.label}
        </button>
      ))}
    </div>

    {meta && (
      <div className="flex items-center gap-8 font-mono text-[10px] text-white/40">
        <div className="flex flex-col items-end">
          <span className="text-hn-orange uppercase">Performance</span>
          <span className="text-white text-sm">{meta.executionTimeMs}ms</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-hn-orange uppercase">Results</span>
          <span className="text-white text-sm">{meta.totalReturned} / {meta.totalExtracted}</span>
        </div>
      </div>
    )}
    
    {isPending && (
      <div className="absolute -bottom-1 left-0 w-full h-px bg-hn-orange animate-pulse" />
    )}
  </nav>
));

const EntryCard = memo(({ entry, index }: { entry: HNEntry; index: number }) => (
  <motion.article
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ 
      duration: 0.5, 
      delay: index * 0.02,
      ease: [0.215, 0.61, 0.355, 1] 
    }}
    className="bg-hn-dark p-8 group hover:bg-white/[0.02] transition-colors relative flex flex-col h-full"
  >
    <div className="flex justify-between items-start mb-6">
      <span className="font-mono text-4xl text-white/10 group-hover:text-hn-orange/30 transition-colors">
        {String(entry.rank).padStart(2, '0')}
      </span>
      <ArrowUpRight className="text-white/20 group-hover:text-hn-orange transition-all translate-x-1 -translate-y-1" size={20} />
    </div>
    
    <h3 className="text-2xl font-serif italic leading-tight mb-8 flex-grow">
      {entry.title}
    </h3>

    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-white/40">
      <div className="flex items-center gap-2 group-hover:text-white transition-colors">
        <Layers size={14} className="text-hn-orange" />
        <span>{entry.points} Points</span>
      </div>
      <div className="flex items-center gap-2 group-hover:text-white transition-colors">
        <MessageSquare size={14} className="text-hn-orange" />
        <span>{entry.comments} Comments</span>
      </div>
    </div>
  </motion.article>
));

// --- Main App Component ---

const App: React.FC = () => {
  const [entries, setEntries] = useState<HNEntry[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('none');
  const [isPending, startTransition] = useTransition();

  const fetchData = async (currentFilter: string) => {
    // Only set main loading if we don't have data yet
    if (entries.length === 0) setLoading(true);
    
    try {
      const response = await axios.get(`${API_URL}/scrape?filter=${currentFilter}`);
      if (response.data.status === 'success') {
        // Apply updates inside transition for better UI responsiveness
        startTransition(() => {
          setEntries(response.data.data);
          setMeta(response.data.meta);
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  return (
    <div className="min-h-screen bg-hn-dark text-white selection:bg-hn-orange selection:text-white p-4 md:p-8">
      <Header />

      <FilterBar 
        currentFilter={filter} 
        onFilterChange={handleFilterChange} 
        meta={meta}
        isPending={isPending}
      />

      <main className="max-w-7xl mx-auto">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 border border-dashed border-white/10 italic font-serif text-2xl text-white/20">
            <Loader2 className="animate-spin" size={48} />
            <span>Parsing the grid...</span>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 content-visibility-auto"
            style={{ contentVisibility: 'auto' } as any}
          >
            <AnimatePresence mode="popLayout">
              {entries.map((entry, index) => (
                <EntryCard 
                  key={`${entry.rank}-${entry.title}`} 
                  entry={entry} 
                  index={index} 
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {meta && (
        <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 font-mono text-[9px] text-white/20 uppercase">
          <div>Trace ID: {meta.logId}</div>
          <div>© 2026 Editorial Crawler System — Powered by Node.js & React</div>
        </footer>
      )}
    </div>
  );
};

export default App;
