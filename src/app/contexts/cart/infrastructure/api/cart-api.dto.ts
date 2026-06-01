export interface CartApiResponseDto {
  id: string;
  lines: CartApiLineDto[];
}

export interface CartApiLineDto {
  id: string;
  menuItemId: string;
  name: string;
  unitPrice: number;
  currency: string;
  quantity: number;
  notes?: string | null;
}
