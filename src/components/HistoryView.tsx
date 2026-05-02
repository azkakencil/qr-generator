import { QRCodeSVG } from 'qrcode.react';
import JsBarcode from 'jsbarcode';
import { useEffect, useRef } from 'react';
import { 
  Trash2, 
  Download, 
  Calendar, 
  Search
} from 'lucide-react';
import { ShortcutItem } from '../types';

interface HistoryViewProps {
  historyItems: ShortcutItem[];
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export default function HistoryView({ historyItems, onDeleteItem, onClearAll }: HistoryViewProps) {
  return (
    <div className="max-w-6xl mx-auto py-4 space-y-8">
      {/* Top Banner and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            Riwayat Shortcut Anda
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Berikut adalah daftar shortcut yang pernah Anda buat dan unduh.
          </p>
        </div>
        {historyItems.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-2 text-rose-600 bg-rose-50/50 hover:bg-rose-50 hover:text-rose-700 transition font-bold px-4 py-2.5 rounded-xl border border-rose-100 cursor-pointer shadow-sm text-xs self-start sm:self-center"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus Semua</span>
          </button>
        )}
      </div>

      {historyItems.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-center gap-4 min-h-[300px]">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-full text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-bold text-slate-800">
              Belum Ada Riwayat
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Semua shortcut Barcode atau QR Code yang Anda buat dan unduh akan tersimpan otomatis di sini.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historyItems.map((item) => (
            <HistoryCard key={item.id} item={item} onDelete={() => onDeleteItem(item.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

// Sub-component for individual item cards
function HistoryCard({ item, onDelete }: { item: ShortcutItem; onDelete: () => void }) {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (item.format !== 'QR' && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, item.value || '12345', {
          format: item.format as any,
          lineColor: item.color,
          background: item.bgColor,
          width: 2,
          height: 60,
          displayValue: true,
          fontSize: 12,
          margin: 6,
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, [item]);

  const downloadExisting = () => {
    if (item.format === 'QR') {
      const svg = document.getElementById(`qr-svg-${item.id}`);
      if (!svg) return;
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = item.size || 250;
        canvas.height = item.size || 250;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = item.bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const a = document.createElement('a');
          a.href = canvas.toDataURL('image/png');
          a.download = `${item.name}-shortcut.png`;
          a.click();
        }
      };
    } else {
      if (!barcodeRef.current) return;
      const svgData = new XMLSerializer().serializeToString(barcodeRef.current);
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
          ctx.fillStyle = item.bgColor;
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          const a = document.createElement('a');
          a.href = canvas.toDataURL('image/png');
          a.download = `${item.name}-barcode.png`;
          a.click();
        }
      };
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden p-5 space-y-4">
      {/* Card Body */}
      <div className="space-y-4">
        {/* Format Tag & Delete Button */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wide">
            {item.format}
          </span>
          <button
            onClick={onDelete}
            title="Hapus shortcut ini"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50/60 rounded-xl transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Thumbnail Preview Area */}
        <div 
          className="flex items-center justify-center p-4 rounded-xl border border-dashed border-slate-100 min-h-[140px] select-none"
          style={{ backgroundColor: item.bgColor }}
        >
          {item.format === 'QR' ? (
            <QRCodeSVG
              id={`qr-svg-${item.id}`}
              value={item.value}
              size={120}
              bgColor={item.bgColor}
              fgColor={item.color}
              level="Q"
            />
          ) : (
            <svg id={`barcode-history-${item.id}`} ref={barcodeRef} className="max-w-full h-auto" />
          )}
        </div>

        {/* Details & Info */}
        <div className="space-y-1 pt-1">
          <h3 className="text-sm font-bold text-slate-800 truncate" title={item.name}>
            {item.name}
          </h3>
          <p className="text-xs text-slate-400 truncate max-w-full font-medium" title={item.value}>
            {item.value}
          </p>
        </div>
      </div>

      {/* Card Footer actions */}
      <div className="border-t border-slate-100/80 pt-3.5 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
          <Calendar className="w-3.5 h-3.5" />
          <span>{item.createdAt}</span>
        </div>

        <button
          onClick={downloadExisting}
          className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-xl transition text-xs border border-indigo-100/40 shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Unduh</span>
        </button>
      </div>
    </div>
  );
}
