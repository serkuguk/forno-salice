export interface CatalogItemVm {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryKey: 'classics' | 'signature';
  badge?: 'house fave' | 'seasonal' | 'new' | 'vegan' | 'spicy';
  isFeatured: boolean;
  priceValue: number;
  currency: string;
  priceLabel: string;
  imageUrl?: string;
}
