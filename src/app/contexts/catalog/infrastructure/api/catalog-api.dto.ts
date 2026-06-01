export type CatalogApiItemType = 'pizza' | 'drink' | 'side';

interface CatalogApiBaseDto {
  id: string;
  categoryId: string;
  type: CatalogApiItemType;
  name: string;
  description: string;
  imageUrl?: string;
  tags: string[];
}

export interface CatalogApiPizzaDto extends CatalogApiBaseDto {
  type: 'pizza';
  basePrices: { small: number; medium: number; large: number };
  availableDoughs: string[];
  defaultDough: string;
}

export interface CatalogApiSimpleDto extends CatalogApiBaseDto {
  type: 'drink' | 'side';
  price: number;
}

export type CatalogApiItemDto = CatalogApiPizzaDto | CatalogApiSimpleDto;

export interface CatalogApiResponse {
  items: CatalogApiItemDto[];
}
