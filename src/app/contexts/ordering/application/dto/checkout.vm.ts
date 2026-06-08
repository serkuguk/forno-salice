import { CartVm } from '@app/contexts/cart/application/dto/cart.vm';

export interface CheckoutVm {
  cart: CartVm;
  canSubmit: boolean;
}
