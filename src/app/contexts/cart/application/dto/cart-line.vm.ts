export interface CartLineVm {
  id: string;
  menuItemId: string;
  name: string;
  unitPrice: number;
  currency: string;
  quantity: number;
  notes: string | null;
  customization: {
    size: string | null;
    dough: string | null;
    extraToppings: string[];
  };
  subtotal: number;
}
