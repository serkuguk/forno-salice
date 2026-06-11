import { of } from 'rxjs';
import { DomainError } from '@app/core/shared-kernel/errors/domain-error/domain-error';
import { CartGateway, CartSnapshot } from '../../domain/ports/cart-gateway.port';
import { OrderRepository, PlacedOrder } from '../../domain/repositories/order.repository';
import { PlaceOrderDto } from '../dto/place-order.dto';
import { PlaceOrderUseCase } from './place-order.use-case';

describe('PlaceOrderUseCase', () => {
  const input: PlaceOrderDto = {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+44 7700 900000',
    mode: 'collection',
    address: null,
  };

  const snapshot: CartSnapshot = {
    id: 'cart-1',
    currency: 'EUR',
    lines: [{ id: 'line-1', name: 'Margherita', unitPrice: 10, currency: 'EUR', quantity: 2 }],
  };

  const placed: PlacedOrder = {
    orderId: 'ORD-123456',
    status: 'Placed',
    estimatedMinutes: 35,
    createdAt: '2026-06-09T12:00:00.000Z',
  };

  function createGateway(snap: CartSnapshot, events: string[]): jest.Mocked<CartGateway> {
    return {
      getCart: jest.fn().mockImplementation(() => {
        events.push('get');
        return of(snap);
      }),
      clearCart: jest.fn().mockImplementation(() => {
        events.push('clear');
        return of(undefined);
      }),
    };
  }

  it('builds the order, persists it, clears the cart, then maps the confirmation', (done) => {
    const events: string[] = [];
    const gateway = createGateway(snapshot, events);
    const repository: jest.Mocked<OrderRepository> = {
      placeOrder: jest.fn().mockImplementation(() => {
        events.push('place');
        return of(placed);
      }),
    };

    const useCase = new PlaceOrderUseCase(gateway, repository);

    useCase.execute(input).subscribe((confirmation) => {
      // Read cart → persist order → clear cart (in that order).
      expect(events).toEqual(['get', 'place', 'clear']);

      expect(confirmation.orderId).toBe('ORD-123456');
      expect(confirmation.estimatedMinutes).toBe(35);
      // collection → no delivery fee, total equals subtotal (10 × 2).
      expect(confirmation.total).toBe(20);
      expect(confirmation.currency).toBe('EUR');
      done();
    });
  });

  it('does not place or clear when the cart is empty (spec rule 3)', (done) => {
    const events: string[] = [];
    const gateway = createGateway({ id: 'cart-1', currency: 'EUR', lines: [] }, events);
    const repository: jest.Mocked<OrderRepository> = {
      placeOrder: jest.fn().mockReturnValue(of(placed)),
    };

    const useCase = new PlaceOrderUseCase(gateway, repository);

    useCase.execute(input).subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(DomainError);
        expect(repository.placeOrder).not.toHaveBeenCalled();
        expect(gateway.clearCart).not.toHaveBeenCalled();
        done();
      },
    });
  });
});
