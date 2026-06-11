import { of } from 'rxjs';
import { CartGateway, CartSnapshot } from '../../domain/ports/cart-gateway.port';
import { GetCheckoutUseCase } from './get-checkout.use-case';

describe('GetCheckoutUseCase', () => {
  function gatewayWith(snapshot: CartSnapshot): jest.Mocked<CartGateway> {
    return {
      getCart: jest.fn().mockReturnValue(of(snapshot)),
      clearCart: jest.fn().mockReturnValue(of(undefined)),
    };
  }

  it('maps a populated snapshot into a submittable checkout view', (done) => {
    const useCase = new GetCheckoutUseCase(
      gatewayWith({
        id: 'cart-1',
        currency: 'EUR',
        lines: [
          { id: 'line-1', name: 'Margherita', unitPrice: 10, currency: 'EUR', quantity: 2 },
          { id: 'line-2', name: 'Garlic Bread', unitPrice: 4, currency: 'EUR', quantity: 1 },
        ],
      }),
    );

    useCase.execute().subscribe((vm) => {
      expect(vm.canSubmit).toBe(true);
      expect(vm.subtotal).toBe(24);
      expect(vm.deliveryFee).toBe(2.5);
      expect(vm.lines).toHaveLength(2);
      expect(vm.lines[0].subtotal).toBe(20);
      done();
    });
  });

  it('marks an empty cart as not submittable', (done) => {
    const useCase = new GetCheckoutUseCase(
      gatewayWith({ id: 'cart-1', currency: 'EUR', lines: [] }),
    );

    useCase.execute().subscribe((vm) => {
      expect(vm.canSubmit).toBe(false);
      expect(vm.subtotal).toBe(0);
      done();
    });
  });
});
