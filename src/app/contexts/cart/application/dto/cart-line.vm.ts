export interface CartLineVm {
  id: string;
  menuItemId: string;
  name: string;
  unitPrice: number;
  currency: string;
  quantity: number;
  notes: string | null;
  subtotal: number;
}
