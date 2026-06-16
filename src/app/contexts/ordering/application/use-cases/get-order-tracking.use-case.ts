import { Observable, map } from 'rxjs';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { OrderTrackingVm } from '../dto/order-tracking.vm';
import { OrderTrackingMapper } from '../mappers/order-tracking.mapper';

export class GetOrderTrackingUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  execute(orderId: string): Observable<OrderTrackingVm> {
    return this.orderRepository
      .getOrderTracking(orderId)
      .pipe(map((order) => OrderTrackingMapper.toVm(order)));
  }
}
