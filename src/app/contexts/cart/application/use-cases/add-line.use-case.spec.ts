import { of } from 'rxjs';
import { EntityId } from '@app/core/shared-kernel/types/entity-id/entity-id';
import { Money } from '@app/core/shared-kernel/value-objects/money/money.value-object';
import { Cart } from '../../domain/entities/cart.entity';
import { CartLine } from '../../domain/entities/cart-line.entity';
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

  it('calls PUT first and refreshes cart with GET afterwards', (done) => {
    const events: string[] = [];
    const cart = new Cart(EntityId.create('cart-1'));
    cart.addLine(new CartLine(
      EntityId.create('line-server'),
      EntityId.create('pizza-margherita'),
      'Margherita Ember',
      Money.create(11.7, 'EUR'),
      1,
      null,
      {
        size: 'medium',
        dough: 'classic',
        extraToppings: [],
      },
    ));

    const repository: jest.Mocked<CartRepository> = {
      addLine: jest.fn().mockImplementation(() => {
        events.push('put');
        return of({ ok: true });
      }),
      getCart: jest.fn().mockImplementation(() => {
        events.push('get');
        return of(cart);
      }),
      saveCart: jest.fn(),
    };

    const useCase = new AddLineUseCase(repository);

    useCase.execute(input).subscribe((result) => {
      expect(events).toEqual(['put', 'get']);
      expect(repository.addLine).toHaveBeenCalledWith(input);
      expect(repository.getCart).toHaveBeenCalledTimes(1);
      expect(result.totalItems).toBe(1);
      expect(result.lines[0].menuItemId).toBe('pizza-margherita');
      done();
    });
  });
});
