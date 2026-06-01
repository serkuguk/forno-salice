export interface AddCartLineDto {
  lineId: string;
  menuItemId: string;
  name: string;
  unitPrice: number;
  currency: string;
  quantity: number;
  notes?: string | null;
}
