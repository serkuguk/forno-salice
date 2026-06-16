import { Provider } from '@angular/core';
import { GetCartUseCase } from '@app/contexts/cart/application/use-cases/get-cart.use-case';
import { ClearCartUseCase } from '@app/contexts/cart/application/use-cases/clear-cart.use-case';
import { OrderRepository } from './domain/repositories/order.repository';
import { CartGateway } from './domain/ports/cart-gateway.port';
import { HttpOrderRepository } from './infrastructure/repositories/http-order.repository';
import { CartGatewayAdapter } from './infrastructure/gateways/cart-gateway.adapter';
import { GetCheckoutUseCase } from './application/use-cases/get-checkout.use-case';
import { PlaceOrderUseCase } from './application/use-cases/place-order.use-case';
import { GetOrderTrackingUseCase } from './application/use-cases/get-order-tracking.use-case';

/**
 * Связывает Ordering-порты с их реализациями. OrderRepository → HTTP-адаптер;
 * CartGateway (ACL) → адаптер, делегирующий в Cart use-cases. Use-cases остаются
 * чистыми и создаются через factory. Маршрут /checkout также подключает
 * CART_PROVIDERS, т.к. CartGatewayAdapter зависит от Cart use-cases.
 */
export const ORDERING_PROVIDERS: Provider[] = [
  { provide: OrderRepository, useClass: HttpOrderRepository },
  {
    provide: CartGateway,
    useFactory: (getCart: GetCartUseCase, clearCart: ClearCartUseCase) =>
      new CartGatewayAdapter(getCart, clearCart),
    deps: [GetCartUseCase, ClearCartUseCase],
  },
  {
    provide: GetCheckoutUseCase,
    useFactory: (cartGateway: CartGateway) =>
      new GetCheckoutUseCase(cartGateway),
    deps: [CartGateway],
  },
  {
    provide: PlaceOrderUseCase,
    useFactory: (cartGateway: CartGateway, orderRepository: OrderRepository) =>
      new PlaceOrderUseCase(cartGateway, orderRepository),
    deps: [CartGateway, OrderRepository],
  },
  {
    provide: GetOrderTrackingUseCase,
    useFactory: (orderRepository: OrderRepository) =>
      new GetOrderTrackingUseCase(orderRepository),
    deps: [OrderRepository],
  },
];
