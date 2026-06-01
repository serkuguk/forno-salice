import { CartLineVm } from './cart-line.vm';

export interface CartVm {
  id: string;
  lines: CartLineVm[];
  totalItems: number;
  totalAmount: number;
  currency: string;
}
