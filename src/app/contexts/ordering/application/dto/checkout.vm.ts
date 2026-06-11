export interface CheckoutLineVm {
  id: string;
  name: string;
  quantity: number;
  subtotal: number;
}

export interface CheckoutVm {
  lines: CheckoutLineVm[];
  subtotal: number;
  /** Стоимость доставки по доменной политике (для предпросмотра при выборе delivery). */
  deliveryFee: number;
  currency: string;
  canSubmit: boolean;
}
