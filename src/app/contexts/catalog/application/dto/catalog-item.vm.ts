export interface CatalogItemVm {
  id: string;
  title: string;
  description: string;
  category: 'pizza' | 'drink' | 'side';
  categoryKey: 'classics' | 'signature';
  badge?: 'house fave' | 'seasonal' | 'new' | 'vegan' | 'spicy';
  isFeatured: boolean;
  priceValue: number;
  currency: string;
  priceLabel: string;
  imageUrl?: string;
}
