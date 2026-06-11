import { Observable } from 'rxjs';
import { Order } from '../entities/order.entity';
import { OrderStatusValue } from '../value-objects/order-status';

/**
 * Доменный read-model, возвращаемый после успешного оформления заказа.
 * Номер заказа и оценка времени приходят с backend (spec rule 6).
 */
export interface PlacedOrder {
  orderId: string;
  status: OrderStatusValue;
  estimatedMinutes: number;
  createdAt: string;
}

export abstract class OrderRepository {
  abstract placeOrder(order: Order): Observable<PlacedOrder>;
}
