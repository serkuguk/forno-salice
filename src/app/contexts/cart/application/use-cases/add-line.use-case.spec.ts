import { of } from 'rxjs';
import { EntityId } from '@app/core/shared-kernel/types/entity-id/entity-id';
import { Cart } from '../../domain/entities/cart.entity';
import { CartRepository } from '../../domain/repositories/cart.repository';
import { AddCartLineDto } from '../dto/add-cart-line.dto';
import { AddLineUseCase } from './add-line.use-case';

describe('AddLineUseCase', () => {
  const input: AddCartLineDto = {
    lineId: 'line-1',
    menuItemId: 'pizza-margherita',
    name: 'Margherita Ember',
    unitPrice: 11.7,
    currency: 'EUR',
    quantity: 1,
    notes: null,
    customization: {
      size: 'medium',
      dough: 'classic',
      extraToppings: [],
    },
  };

  it('loads the cart, adds the line to the aggregate, then saves the whole cart', (done) => {
    const events: string[] = [];

    const repository: jest.Mocked<CartRepository> = {
      getCart: jest.fn().mockImplementation(() => {
        events.push('get');
        return of(new Cart(EntityId.create('cart-1')));
      }),
      saveCart: jest.fn().mockImplementation((cart: Cart) => {
        events.push('save');
        return of(cart);
      }),
    };

    const useCase = new AddLineUseCase(repository);

    useCase.execute(input).subscribe((result) => {
      // Порядок: сначала читаем агрегат, потом сохраняем целиком.
      expect(events).toEqual(['get', 'save']);

      // saveCart получает агрегат Cart с уже добавленной строкой (не сырой DTO).
      const savedCart = repository.saveCart.mock.calls[0][0];
      expect(savedCart).toBeInstanceOf(Cart);
      expect(savedCart.lines.length).toBe(1);

      expect(result.totalItems).toBe(1);
      expect(result.lines[0].menuItemId).toBe('pizza-margherita');
      done();
    });
  });
});
