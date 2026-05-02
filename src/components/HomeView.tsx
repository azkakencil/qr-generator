import React from 'react';
import { 
  QrCode, 
  Globe, 
  MessageCircle, 
  Wifi, 
  FileText, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ShortcutType } from '../types';

interface HomeViewProps {
  onStart: (type: ShortcutType) => void;
  setView: (view: 'generator' | 'history' | 'test') => void;
}

export default function HomeView({ onStart, setView }: HomeViewProps) {
  const templates: {
    id: ShortcutType;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
  }[] = [
    {
      id: 'url',
      title: 'Tautan Website',
      description: 'Arahkan pemindai langsung ke halaman web Anda.',
      icon: <Globe className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50 hover:bg-blue-100/80 transition-colors',
      bgColor: 'border-blue-100',
    },
    {
      id: 'whatsapp',
      title: 'Chat WhatsApp',
      description: 'Kirim pesan otomatis ke nomor WhatsApp yang dituju.',
      icon: <MessageCircle className="w-6 h-6 text-emerald-600" />,
      color: 'bg-emerald-50 hover:bg-emerald-100/80 transition-colors',
      bgColor: 'border-emerald-100',
    },
    {
      id: 'wifi',
      title: 'Akses WiFi',
      description: 'Hubungkan ke jaringan WiFi secara langsung tanpa mengetik sandi.',
      icon: <Wifi className="w-6 h-6 text-amber-600" />,
      color: 'bg-amber-50 hover:bg-amber-100/80 transition-colors',
      bgColor: 'border-amber-100',
    },
    {
      id: 'text',
      title: 'Teks / Catatan',
      description: 'Tampilkan teks sederhana atau catatan penting dalam sekali scan.',
      icon: <FileText className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-50 hover:bg-purple-100/80 transition-colors',
      bgColor: 'border-purple-100',
    },
    {
      id: 'email',
      title: 'Kirim Email',
      description: 'Buka draft email dengan alamat, subjek, dan isi yang sudah terisi.',
      icon: <Mail className="w-6 h-6 text-rose-600" />,
      color: 'bg-rose-50 hover:bg-rose-100/80 transition-colors',
      bgColor: 'border-rose-100',
    },
    {
      id: 'phone',
      title: 'Telepon / Kontak',
      description: 'Panggil nomor telepon secara otomatis.',
      icon: <Phone className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50 hover:bg-indigo-100/80 transition-colors',
      bgColor: 'border-indigo-100',
    }
  ];

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-4">
      {/* Hero Section */}
      <div className="relative text-center space-y-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-48 h-48 bg-indigo-200/50 rounded-full blur-3xl" />
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-4 py-1.5 rounded-full border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Solusi Shortcut Cepat & Modern</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-indigo-700 leading-tight">
          Buat Barcode & QR Code Shortcut <br />Halaman Web Anda
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          Ubah tautan website, kontak WhatsApp, sandi WiFi, atau teks apa pun menjadi shortcut QR Code atau Barcode yang siap scan. Praktis, mudah, dan dapat dicetak!
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onStart('url')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0 duration-200 text-sm md:text-base"
          >
            <QrCode className="w-5 h-5" />
            <span>Buat Shortcut Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('history')}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium px-6 py-3 rounded-xl shadow-sm hover:border-slate-300 transition duration-200 text-sm md:text-base"
          >
            Lihat Riwayat
          </button>
        </div>
      </div>

      {/* Grid Features / Presets */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            Pilih Jenis Shortcut
          </h2>
          <span className="text-sm font-medium text-slate-500">
            6 Pilihan Template
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => onStart(tpl.id)}
              className={`flex flex-col text-left justify-between p-6 rounded-2xl border-2 border-transparent ${tpl.color} hover:border-indigo-400/40 hover:shadow-lg transition-all duration-300 h-full group`}
            >
              <div className="space-y-4">
                <div className={`p-3 rounded-xl inline-block bg-white shadow-sm border ${tpl.bgColor} group-hover:scale-105 transition duration-300`}>
                  {tpl.icon}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-800">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {tpl.description}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-slate-600 group-hover:text-indigo-600 pt-3 border-t border-slate-100/80 transition duration-200">
                <span>Gunakan Shortcut Ini</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition duration-200" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Highlights / Why Use section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-200/60 pt-12 mt-12">
        <div className="flex gap-4 p-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl h-fit">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Shortcut Cepat</h4>
            <p className="text-xs text-slate-500">Cukup arahkan kamera smartphone untuk mengakses tautan atau fungsi lainnya seketika.</p>
          </div>
        </div>
        <div className="flex gap-4 p-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl h-fit">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">100% Aman</h4>
            <p className="text-xs text-slate-500">Informasi dan data yang Anda buat tidak disimpan di server pihak ketiga manapun.</p>
          </div>
        </div>
        <div className="flex gap-4 p-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl h-fit">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">QR Code & Barcode</h4>
            <p className="text-xs text-slate-500">Mendukung format QR Code hingga kode batang standar industri (CODE128, CODE39).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
