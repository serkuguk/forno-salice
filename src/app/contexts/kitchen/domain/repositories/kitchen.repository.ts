import { Observable } from 'rxjs';
import { FulfillmentMode } from '@app/contexts/ordering/domain/value-objects/fulfillment';
import { OrderStatusValue } from '@app/contexts/ordering/domain/value-objects/order-status';

export interface KitchenOrderLine {
  id: string;
  name: string;
  quantity: number;
}

export interface KitchenOrder {
  orderId: string;
  status: OrderStatusValue;
  createdAt: string;
  estimatedMinutes: number;
  fulfillmentMode: FulfillmentMode;
  lines: KitchenOrderLine[];
}

export abstract class KitchenRepository {
  abstract getActiveOrders(): Observable<KitchenOrder[]>;
  abstract advanceOrderStatus(
    orderId: string,
    nextStatus: OrderStatusValue,
  ): Observable<KitchenOrder>;
}
