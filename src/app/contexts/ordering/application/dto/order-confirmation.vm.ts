import { OrderStatusValue } from '../../domain/value-objects/order-status';

export interface OrderConfirmationVm {
  orderId: string;
  status: OrderStatusValue;
  estimatedMinutes: number;
  createdAt: string;
  total: number;
  currency: string;
}
