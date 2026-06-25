import { Observable, switchMap } from 'rxjs';
import { KitchenRepository } from '@app/contexts/kitchen/domain/repositories/kitchen.repository';
import {
  OrderStatus,
  OrderStatusValue,
} from '@app/contexts/ordering/domain/value-objects/order-status';

export class AdvanceKitchenOrderStatusUseCase {
  constructor(private readonly kitchenRepository: KitchenRepository) {}

  execute(
    orderId: string,
    currentStatus: OrderStatusValue,
  ): Observable<unknown> {
    const nextStatus = this.resolveNextStatus(currentStatus);

    OrderStatus.create(currentStatus).transitionTo(nextStatus);

    return this.kitchenRepository.advanceOrderStatus(orderId, nextStatus);
  }

  private resolveNextStatus(status: OrderStatusValue): OrderStatusValue {
    switch (status) {
      case 'Placed':
        return 'Confirmed';
      case 'Confirmed':
        return 'Preparing';
      case 'Preparing':
        return 'Baking';
      case 'Baking':
        return 'Ready';
      case 'Ready':
        return 'OutForDelivery';
      case 'OutForDelivery':
        return 'Delivered';
      default:
        throw new Error(`Kitchen cannot advance status from ${status}`);
    }
  }
}
