import { useState } from 'react';
import { 
  ScanLine, 
  ExternalLink, 
  Globe, 
  MessageCircle, 
  Wifi, 
  FileText, 
  Mail, 
  Phone, 
  AlertCircle 
} from 'lucide-react';

export default function ScanTestView() {
  const [testValue, setTestValue] = useState<string>('');
  const [scannedResult, setScannedResult] = useState<{
    type: string;
    text: string;
    description: string;
    actionUrl?: string;
  } | null>(null);

  const analyzeScannedValue = (val: string) => {
    if (!val) {
      setScannedResult(null);
      return;
    }

    // Checking protocols
    if (val.startsWith('http://') || val.startsWith('https://')) {
      setScannedResult({
        type: 'URL / Tautan Web',
        text: val,
        description: 'Tautan ini mengarahkan ke halaman web.',
        actionUrl: val,
      });
    } else if (val.startsWith('https://wa.me/') || val.includes('whatsapp.com')) {
      setScannedResult({
        type: 'WhatsApp Chat',
        text: val,
        description: 'Tautan ini akan membuka obrolan langsung di aplikasi WhatsApp.',
        actionUrl: val,
      });
    } else if (val.toUpperCase().startsWith('WIFI:')) {
      // Extracting SSID from WIFI:S:Name;T:WPA;P:Pass;;
      const matchS = val.match(/S:([^;]+)/i);
      const ssid = matchS ? matchS[1] : 'Tidak diketahui';
      setScannedResult({
        type: 'Akses WiFi',
        text: val,
        description: `Informasi jaringan WiFi. Nama WiFi (SSID): ${ssid}`,
      });
    } else if (val.startsWith('mailto:')) {
      setScannedResult({
        type: 'Email Otomatis',
        text: val,
        description: 'Membuka aplikasi Email dengan subjek dan isi yang tertera.',
        actionUrl: val,
      });
    } else if (val.startsWith('tel:')) {
      setScannedResult({
        type: 'Panggilan Kontak / Telepon',
        text: val,
        description: 'Mengarahkan langsung ke aplikasi panggilan telepon di gawai Anda.',
        actionUrl: val,
      });
    } else {
      setScannedResult({
        type: 'Teks Biasa / Catatan',
        text: val,
        description: 'Hanya berisi informasi teks sederhana atau catatan yang dapat dibaca.',
      });
    }
  };

  const handleTest = () => {
    analyzeScannedValue(testValue.trim());
  };

  const clearTest = () => {
    setTestValue('');
    setScannedResult(null);
  };

  // Pre-set scan items just to give ideas
  const samples = [
    { title: 'Buka Web', val: 'https://arena-dev.com' },
    { title: 'Chat WhatsApp', val: 'https://wa.me/628123456789?text=Hai!' },
    { title: 'Hubungkan WiFi', val: 'WIFI:S:My-Home;T:WPA;P:pass123;;' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Top Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            Alat Penguji Scanner
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Uji hasil pindaian barcode atau QR Code Anda di sini untuk melihat fungsionalitas shortcut-nya.
          </p>
        </div>
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 flex items-center self-start sm:self-center">
          <ScanLine className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              Input Hasil Scan / Teks
            </label>
            <textarea
              rows={4}
              value={testValue}
              onChange={(e) => setTestValue(e.target.value)}
              placeholder="Masukkan teks barcode/QR Code di sini..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
            <button
              onClick={handleTest}
              disabled={!testValue}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold px-5 py-3 rounded-xl transition shadow-md text-sm cursor-pointer"
            >
              <ScanLine className="w-4 h-4" />
              <span>Simulasikan Scan</span>
            </button>

            {testValue && (
              <button
                onClick={clearTest}
                className="text-xs text-slate-500 hover:text-slate-700 font-semibold px-3 py-2 cursor-pointer"
              >
                Reset Input
              </button>
            )}
          </div>

          {/* Preset templates for quick test */}
          <div className="border-t border-slate-100/80 pt-4 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Gunakan Contoh Isian Cepat
            </span>
            <div className="flex flex-wrap gap-2">
              {samples.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTestValue(s.val);
                    analyzeScannedValue(s.val);
                  }}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Result Action Area */}
        <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[310px]">
          {scannedResult ? (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase border border-indigo-100/50">
                  Hasil Terdeteksi
                </span>
                <h3 className="text-lg font-bold text-slate-800 pt-2 flex items-center gap-2">
                  {scannedResult.type === 'URL / Tautan Web' && <Globe className="w-5 h-5 text-blue-600" />}
                  {scannedResult.type === 'WhatsApp Chat' && <MessageCircle className="w-5 h-5 text-emerald-600" />}
                  {scannedResult.type === 'Akses WiFi' && <Wifi className="w-5 h-5 text-amber-600" />}
                  {scannedResult.type === 'Email Otomatis' && <Mail className="w-5 h-5 text-rose-600" />}
                  {scannedResult.type === 'Panggilan Kontak / Telepon' && <Phone className="w-5 h-5 text-indigo-600" />}
                  {scannedResult.type === 'Teks Biasa / Catatan' && <FileText className="w-5 h-5 text-purple-600" />}
                  <span>{scannedResult.type}</span>
                </h3>
              </div>

              {/* Data decoded box */}
              <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2 font-mono text-xs text-slate-700 break-all">
                <div className="font-sans font-bold text-slate-500 select-none">Isi Terbaca:</div>
                <div>{scannedResult.text}</div>
              </div>

              <div className="flex items-start gap-2 text-slate-600 text-xs leading-relaxed">
                <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span>{scannedResult.description}</span>
              </div>

              {scannedResult.actionUrl && (
                <div className="border-t border-slate-100 pt-4">
                  <a
                    href={scannedResult.actionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-3 rounded-xl transition text-sm shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Akses Shortcut Ini</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-center my-auto">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-full text-slate-400">
                <ScanLine className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">Menunggu Input Scan</h4>
                <p className="text-xs text-slate-400 max-w-xs font-medium">
                  Masukkan teks hasil barcode atau QR code di formulir kiri untuk menguji.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
