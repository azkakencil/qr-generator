import { useState, useEffect } from 'react';
import HomeView from './components/HomeView';
import GeneratorView from './components/GeneratorView';
import HistoryView from './components/HistoryView';
import ScanTestView from './components/ScanTestView';
import { ShortcutItem, ShortcutType } from './types';
import { 
  QrCode, 
  History, 
  Plus, 
  Search, 
  ShieldCheck 
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'home' | 'generator' | 'history' | 'test'>('home');
  const [selectedType, setSelectedType] = useState<ShortcutType>('url');
  
  // Manage History and localStorage
  const [historyItems, setHistoryItems] = useState<ShortcutItem[]>(() => {
    try {
      const saved = localStorage.getItem('shortycode_history');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('shortycode_history', JSON.stringify(historyItems));
  }, [historyItems]);

  const handleStartShortcut = (type: ShortcutType) => {
    setSelectedType(type);
    setActiveView('generator');
  };

  const handleSaveToHistory = (item: ShortcutItem) => {
    setHistoryItems((prev) => [item, ...prev]);
  };

  const handleDeleteItem = (id: string) => {
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua riwayat barcode?')) {
      setHistoryItems([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header / Navbar */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200/60 z-30 select-none">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & title */}
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2.5 transition group cursor-pointer"
          >
            <div className="w-10 h-10 bg-indigo-600 group-hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 leading-tight">ShortyCode</span>
              <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Barcode Shortcut</span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveView('home')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'home'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => handleStartShortcut('url')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'generator'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Plus className="w-3.5 h-3.5 hidden sm:inline" />
              <span>Buat Baru</span>
            </button>
            <button
              onClick={() => setActiveView('history')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'history'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <History className="w-3.5 h-3.5 hidden sm:inline" />
              <span>Riwayat</span>
            </button>
            <button
              onClick={() => setActiveView('test')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'test'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Search className="w-3.5 h-3.5 hidden sm:inline" />
              <span>Penguji</span>
            </button>
          </nav>

        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 mb-12">
        {activeView === 'home' && (
          <HomeView onStart={handleStartShortcut} setView={setActiveView} />
        )}
        
        {activeView === 'generator' && (
          <GeneratorView
            initialType={selectedType}
            onSaveToHistory={handleSaveToHistory}
          />
        )}
        
        {activeView === 'history' && (
          <HistoryView
            historyItems={historyItems}
            onDeleteItem={handleDeleteItem}
            onClearAll={handleClearAll}
          />
        )}

        {activeView === 'test' && (
          <ScanTestView />
        )}
      </main>

      {/* Footer credits and safety badges */}
      <footer className="bg-white border-t border-slate-200/80 py-8 select-none">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Semua kode dihasilkan di perangkat Anda (Client-Side). Aman & Terlindungi.</span>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            &copy; 2026 ShortyCode. Semua hak dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}
