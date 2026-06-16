import { Observable } from 'rxjs';
import { Order } from '../entities/order.entity';
import { OrderStatusValue } from '../value-objects/order-status';
import { FulfillmentMode } from '../value-objects/fulfillment';

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

export interface TrackedOrderLine {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  currency: string;
}

export interface TrackedOrder {
  orderId: string;
  status: OrderStatusValue;
  estimatedMinutes: number;
  createdAt: string;
  fulfillmentMode: FulfillmentMode;
  lines: TrackedOrderLine[];
}

export abstract class OrderRepository {
  abstract placeOrder(order: Order): Observable<PlacedOrder>;
  abstract getOrderTracking(orderId: string): Observable<TrackedOrder>;
}
