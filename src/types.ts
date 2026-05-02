export type ShortcutType = 'url' | 'whatsapp' | 'text' | 'wifi' | 'email' | 'phone';

export type CodeFormat = 'QR' | 'CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'UPC';

export interface ShortcutItem {
  id: string;
  name: string;
  type: ShortcutType;
  format: CodeFormat;
  value: string;
  createdAt: string;
  color: string;
  bgColor: string;
  size: number;
}
