// src/types/product.ts
export type PricePoint = {
  time: string; // '2025-12-01' 같은 문자열 or ISO
  price: number;
};

export type Product = {
  id: string;
  title: string;
  imageUrl: string;
  currentPrice: number;
  targetPrice: number;
  currency: 'USD' | 'KRW';
  isActive: boolean; // 알림 on/off
  lastUpdated: string;
  priceHistory: PricePoint[];
};
