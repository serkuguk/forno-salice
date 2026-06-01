import { MenuItem } from "../../domain/entities/menu-item.entity";
import { CatalogItemVm } from "../dto/catalog-item.vm";

export class CatalogItemMapper {
  static toVm(item: MenuItem): CatalogItemVm {
    const text = `${item.name} ${item.description}`.toLowerCase();
    const categoryKey: CatalogItemVm['categoryKey'] =
      text.includes('signature') ||
      text.includes('truffle') ||
      text.includes('nduja') ||
      text.includes('prosciutto') ||
      text.includes('spicy')
        ? 'signature'
        : 'classics';

    const isFeatured =
      text.includes('house fave') ||
      text.includes('featured') ||
      text.includes('chef');

    const badge: CatalogItemVm['badge'] =
      text.includes('spicy')
        ? 'spicy'
        : text.includes('vegan')
          ? 'vegan'
          : text.includes('seasonal')
            ? 'seasonal'
            : text.includes('new')
              ? 'new'
              : isFeatured
                ? 'house fave'
                : undefined;

    return {
      id: item.id.value,
      title: item.name,
      description: item.description,
      category: item.category,
      categoryKey,
      badge,
      isFeatured,
      priceValue: item.basePrice.amount,
      currency: item.basePrice.currency,
      priceLabel: `${item.basePrice.amount.toFixed(2)} ${item.basePrice.currency}`,
      imageUrl: item.imageUrl
    };
  }
}
