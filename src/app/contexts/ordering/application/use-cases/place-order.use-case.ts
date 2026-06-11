import { Observable, map, switchMap } from 'rxjs';
import { CartGateway } from '../../domain/ports/cart-gateway.port';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { OrderMapper } from '../mappers/order.mapper';
import { PlaceOrderDto } from '../dto/place-order.dto';
import { OrderConfirmationVm } from '../dto/order-confirmation.vm';

/**
 * UC-04 Checkout. Читает корзину через ACL, собирает Order aggregate (доменный
 * инвариант запрещает пустую корзину), сохраняет заказ, очищает корзину и
 * возвращает подтверждение с server-generated номером заказа.
 */
export class PlaceOrderUseCase {
  constructor(
    private readonly cartGateway: CartGateway,
    private readonly orderRepository: OrderRepository,
  ) {}

  execute(input: PlaceOrderDto): Observable<OrderConfirmationVm> {
    return this.cartGateway.getCart().pipe(
      map((snapshot) => OrderMapper.toOrder(input, snapshot)),
      switchMap((order) =>
        this.orderRepository.placeOrder(order).pipe(
          switchMap((placed) =>
            this.cartGateway.clearCart().pipe(
              map(() => OrderMapper.toConfirmationVm(placed, order)),
            ),
          ),
        ),
      ),
    );
  }
}
