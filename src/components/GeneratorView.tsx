import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import JsBarcode from 'jsbarcode';
import { 
  Globe, 
  MessageCircle, 
  Wifi, 
  FileText, 
  Mail, 
  Phone, 
  Download, 
  Check, 
  Palette, 
  Type, 
  Copy, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { ShortcutType, CodeFormat, ShortcutItem } from '../types';

interface GeneratorViewProps {
  initialType: ShortcutType;
  onSaveToHistory: (item: ShortcutItem) => void;
}

export default function GeneratorView({ initialType, onSaveToHistory }: GeneratorViewProps) {
  const [type, setType] = useState<ShortcutType>(initialType);
  const [format, setFormat] = useState<CodeFormat>('QR');
  const [name, setName] = useState<string>('');

  // Values per type
  const [url, setUrl] = useState<string>('https://google.com');
  const [waNumber, setWaNumber] = useState<string>('628123456789');
  const [waMessage, setWaMessage] = useState<string>('Halo, saya ingin bertanya tentang layanan Anda.');
  const [text, setText] = useState<string>('Halo! Selamat datang di website kami.');
  const [wifiSSID, setWifiSSID] = useState<string>('Rumah_WiFi');
  const [wifiPassword, setWifiPassword] = useState<string>('Sandi12345');
  const [wifiSecurity, setWifiSecurity] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [emailTo, setEmailTo] = useState<string>('halo@domain.com');
  const [emailSubject, setEmailSubject] = useState<string>('Tanya Layanan');
  const [emailBody, setEmailBody] = useState<string>('Pesan pembuka di sini...');
  const [phone, setPhone] = useState<string>('081234567890');

  // Customizer styling
  const [fgColor, setFgColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [size, setSize] = useState<number>(250);
  const [showValue, setShowValue] = useState<boolean>(true); // for barcodes to show alphanumeric string

  const [copied, setCopied] = useState<boolean>(false);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg'>('png');

  const barcodeRef = useRef<SVGSVGElement>(null);

  // Computed text value based on selected Type
  const getValue = (): string => {
    switch (type) {
      case 'url':
        return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
      case 'whatsapp':
        const cleanPhone = waNumber.replace(/[^0-9]/g, '');
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
      case 'text':
        return text;
      case 'wifi':
        return `WIFI:S:${wifiSSID};T:${wifiSecurity};P:${wifiPassword};;`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        return `tel:${phone}`;
      default:
        return url;
    }
  };

  const finalValue = getValue();

  // Draw Barcode on changes if format is NOT QR
  useEffect(() => {
    if (format !== 'QR' && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, finalValue || '12345678', {
          format: format as any,
          lineColor: fgColor,
          background: bgColor,
          width: 2.5,
          height: 100,
          displayValue: showValue,
          fontSize: 14,
          margin: 10,
        });
      } catch (err) {
        // Fallback or validation error (e.g. EAN format has specific lengths)
        console.error(err);
      }
    }
  }, [format, finalValue, fgColor, bgColor, showValue]);

  const handleCopy = () => {
    navigator.clipboard.writeText(finalValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    if (format === 'QR') {
      const svg = document.getElementById('qr-svg-preview');
      if (!svg) return;
      
      const svgData = new XMLSerializer().serializeToString(svg);
      
      if (downloadFormat === 'svg') {
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name || 'shortcut'}-qr.svg`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Download as PNG via canvas
        const img = new Image();
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0, size, size);
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/png');
            a.download = `${name || 'shortcut'}-qr.png`;
            a.click();
          }
        };
      }
    } else {
      // For Barcode SVG element
      if (!barcodeRef.current) return;
      const svgData = new XMLSerializer().serializeToString(barcodeRef.current);
      
      if (downloadFormat === 'svg') {
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name || 'shortcut'}-barcode.svg`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Download barcode as PNG via canvas conversion
        const img = new Image();
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        img.onload = () => {
          const bbox = barcodeRef.current?.getBoundingClientRect();
          const w = bbox?.width || 360;
          const h = bbox?.height || 180;
          
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, w, h);
            ctx.drawImage(img, 0, 0, w, h);
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/png');
            a.download = `${name || 'shortcut'}-barcode.png`;
            a.click();
          }
        };
      }
    }

    // Save to history automatically upon download
    onSaveToHistory({
      id: Date.now().toString(),
      name: name || `${type.toUpperCase()} Shortcut`,
      type,
      format,
      value: finalValue,
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      color: fgColor,
      bgColor,
      size,
    });
  };

  const presetColors = [
    { fg: '#000000', bg: '#ffffff', label: 'Hitam Putih' },
    { fg: '#1d4ed8', bg: '#eff6ff', label: 'Biru Cerah' },
    { fg: '#047857', bg: '#ecfdf5', label: 'Emerald' },
    { fg: '#a21caf', bg: '#fdf4ff', label: 'Magenta' },
    { fg: '#b91c1c', bg: '#fef2f2', label: 'Merah' },
    { fg: '#ea580c', bg: '#fff7ed', label: 'Oranye' },
    { fg: '#1e293b', bg: '#f1f5f9', label: 'Slate' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* FORM INPUT CONTROLS */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-8">
          
          {/* Header Title & Format Type */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                Buat Shortcut Baru
              </h1>
              <p className="text-xs md:text-sm text-slate-500">
                Sesuaikan pengaturan detail dan desain kode Anda.
              </p>
            </div>
            {/* Format Selection (QR or Barcode types) */}
            <div className="flex flex-col gap-1.5 sm:w-auto w-full">
              <label className="text-xs font-semibold text-slate-700">Tipe Kode</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as CodeFormat)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-slate-50 text-slate-700"
              >
                <optgroup label="Kode QR">
                  <option value="QR">QR Code (Direkomendasikan)</option>
                </optgroup>
                <optgroup label="Barcode Tradisional">
                  <option value="CODE128">CODE128 (Default Barcode)</option>
                  <option value="CODE39">CODE39 (Alfanumerik)</option>
                  <option value="EAN13">EAN13 (Hanya 12 Angka)</option>
                  <option value="EAN8">EAN8 (Hanya 7 Angka)</option>
                  <option value="UPC">UPC (Hanya 11 Angka)</option>
                </optgroup>
              </select>
            </div>
          </div>

          {/* Form Rows / Shortcut Action Inputs */}
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Type className="w-4 h-4 text-slate-400" />
                Nama / Label Shortcut
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth: Akses Website Penjualan"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium"
              />
            </div>

            {/* Sub-navigation tabs for Shortcut type */}
            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
              <button
                type="button"
                onClick={() => setType('url')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition ${
                  type === 'url'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Link Web</span>
              </button>
              <button
                type="button"
                onClick={() => setType('whatsapp')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition ${
                  type === 'whatsapp'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => setType('wifi')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition ${
                  type === 'wifi'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <Wifi className="w-4 h-4" />
                <span>WiFi</span>
              </button>
              <button
                type="button"
                onClick={() => setType('text')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition ${
                  type === 'text'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Teks</span>
              </button>
              <button
                type="button"
                onClick={() => setType('email')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition ${
                  type === 'email'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => setType('phone')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition ${
                  type === 'phone'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Telepon</span>
              </button>
            </div>

            {/* CONDITIONAL FORMS PER TYPE */}
            <div className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-100/80 space-y-4">
              {type === 'url' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-indigo-500" />
                    URL / Tautan Website
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="cth: https://tokoku.com"
                    className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                  <span className="text-xs text-slate-400 leading-relaxed block">
                    Direkomendasikan memakai <strong>https://</strong> agar web otomatis terbuka.
                  </span>
                </div>
              )}

              {type === 'whatsapp' && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-emerald-500" />
                      Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={waNumber}
                      onChange={(e) => setWaNumber(e.target.value)}
                      placeholder="cth: 628123456789 (Sertakan kode negara)"
                      className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Isi Pesan Otomatis (Opsional)</label>
                    <textarea
                      rows={2}
                      value={waMessage}
                      onChange={(e) => setWaMessage(e.target.value)}
                      placeholder="Halo, saya ingin info produk..."
                      className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                </div>
              )}

              {type === 'wifi' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Wifi className="w-4 h-4 text-amber-500" />
                      Nama SSID WiFi
                    </label>
                    <input
                      type="text"
                      value={wifiSSID}
                      onChange={(e) => setWifiSSID(e.target.value)}
                      placeholder="cth: Home-Network"
                      className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Sandi / Password WiFi</label>
                    <input
                      type="text"
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      placeholder="cth: 12345678"
                      className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">Tipe Keamanan</label>
                    <select
                      value={wifiSecurity}
                      onChange={(e) => setWifiSecurity(e.target.value as any)}
                      className="w-full px-3.5 py-3 bg-white rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    >
                      <option value="WPA">WPA/WPA2/WPA3 (Umum/Standar)</option>
                      <option value="WEP">WEP (Keamanan Lama)</option>
                      <option value="nopass">Tanpa Kata Sandi</option>
                    </select>
                  </div>
                </div>
              )}

              {type === 'text' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-purple-500" />
                    Teks Bebas / Catatan
                  </label>
                  <textarea
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="cth: Terima kasih telah berkunjung!"
                    className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              )}

              {type === 'email' && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-rose-500" />
                      Email Tujuan
                    </label>
                    <input
                      type="email"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      placeholder="cth: halo@bisnis.com"
                      className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Subjek Email</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="cth: Penawaran Jasa"
                      className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Isi Email</label>
                    <textarea
                      rows={2}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Isi email pembuka..."
                      className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                </div>
              )}

              {type === 'phone' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-indigo-500" />
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="cth: 0812XXXXXXXX atau +62812"
                    className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ADVANCED CUSTOMIZATIONS */}
          <div className="space-y-6 pt-2 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-indigo-600" />
              Sesuaikan Tampilan
            </h3>

            {/* Pre-made Palette */}
            <div className="flex flex-wrap gap-2">
              {presetColors.map((col, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setFgColor(col.fg);
                    setBgColor(col.bg);
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs border border-transparent font-medium transition cursor-pointer hover:shadow-sm ${
                    fgColor === col.fg && bgColor === col.bg
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-slate-200/50"
                    style={{ backgroundColor: col.fg }}
                  />
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-slate-200/50"
                    style={{ backgroundColor: col.bg }}
                  />
                  <span className="text-slate-600 text-[11px] font-semibold">{col.label}</span>
                </button>
              ))}
            </div>

            {/* Precise Color Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Warna Kode Utama</label>
                <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1 bg-transparent border-0 font-mono text-xs uppercase focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Warna Latar Belakang</label>
                <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 bg-transparent border-0 font-mono text-xs uppercase focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Sizing & Additional switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {format === 'QR' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
                    <span>Ukuran QR</span>
                    <span className="text-indigo-600 font-semibold">{size}px</span>
                  </label>
                  <input
                    type="range"
                    min="150"
                    max="450"
                    step="10"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              )}

              {format !== 'QR' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Label Teks Barcode</label>
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => setShowValue(!showValue)}
                      className={`p-2 rounded-lg transition ${
                        showValue ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {showValue ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <span className="text-xs text-slate-600 font-medium">
                      {showValue ? 'Tampilkan teks' : 'Sembunyikan teks'} di bawah barcode
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PREVIEW & SAVING SECTION */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Card Preview Container */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-between min-h-[480px] gap-6 sticky top-6">
            
            <div className="w-full text-center space-y-1">
              <span className="text-[11px] font-bold text-indigo-600 tracking-wider bg-indigo-50 px-2.5 py-1 rounded-full uppercase border border-indigo-100/50">
                Live Preview Code
              </span>
              <h4 className="text-base font-extrabold text-slate-800 leading-normal pt-2">
                {name || `${format} Shortcut`}
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto truncate font-medium">
                {finalValue}
              </p>
            </div>

            {/* Generated Code Asset container */}
            <div 
              className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-5 w-full flex-1 max-w-[340px] max-h-[340px] overflow-hidden bg-slate-50/50 hover:bg-slate-50 transition"
              style={{ backgroundColor: bgColor }}
            >
              {format === 'QR' ? (
                <div className="relative group transition-transform duration-200">
                  <QRCodeSVG
                    id="qr-svg-preview"
                    value={finalValue || 'https://google.com'}
                    size={size > 300 ? 250 : size}
                    bgColor={bgColor}
                    fgColor={fgColor}
                    level="Q"
                    includeMargin={true}
                    className="transition duration-300 rounded-lg group-hover:scale-[1.02]"
                  />
                </div>
              ) : (
                <div className="relative group transition-transform duration-200 max-w-full overflow-auto">
                  <svg
                    id="barcode-preview"
                    ref={barcodeRef}
                    className="max-w-full group-hover:scale-[1.01] transition duration-300"
                  />
                </div>
              )}
            </div>

            {/* Action Group Footer */}
            <div className="w-full space-y-4">
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 bg-slate-50/80 p-2 rounded-xl border border-slate-200/60 text-xs">
                <span className="text-slate-500 font-medium ml-2">Salin URL/Teks Shortcut:</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-slate-700 bg-white hover:bg-slate-100 hover:text-indigo-600 transition font-bold px-3 py-2 rounded-lg border border-slate-200 cursor-pointer shadow-sm ml-auto text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>

              {/* Download Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center bg-slate-50 rounded-xl p-1.5 border border-slate-200 text-xs font-bold text-slate-700">
                  <span className="px-3">Format Ekspor</span>
                  <select
                    value={downloadFormat}
                    onChange={(e) => setDownloadFormat(e.target.value as any)}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-600 focus:outline-none"
                  >
                    <option value="png">PNG (Gambar)</option>
                    <option value="svg">SVG (Vektor)</option>
                  </select>
                </div>

                <button
                  onClick={downloadCode}
                  disabled={!finalValue}
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold px-4 py-3 rounded-xl shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0 duration-200 cursor-pointer text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh & Simpan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
