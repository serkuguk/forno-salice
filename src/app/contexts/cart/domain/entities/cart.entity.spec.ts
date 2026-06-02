import { EntityId } from '@app/core/shared-kernel/types/entity-id/entity-id';
import { Money } from '@app/core/shared-kernel/value-objects/money/money.value-object';
import { CartLine } from './cart-line.entity';
import { Cart } from './cart.entity';

describe('Cart', () => {
  function createLine(
    id: string,
    quantity: number,
    customization?: Partial<CartLine['customization']>,
  ): CartLine {
    return new CartLine(
      EntityId.create(id),
      EntityId.create('pizza-margherita'),
      'Margherita Ember',
      Money.create(11.7, 'EUR'),
      quantity,
      null,
      {
        size: customization?.size ?? 'medium',
        dough: customization?.dough ?? 'classic',
        extraToppings: customization?.extraToppings ?? [],
      },
    );
  }

  it('keeps lines separate when customization differs', () => {
    const cart = new Cart(EntityId.create('cart-1'));

    cart.addLine(createLine('line-1', 1, { extraToppings: ['extra-cheese'] }));
    cart.addLine(createLine('line-2', 1, { extraToppings: ['olives'] }));

    expect(cart.lines).toHaveLength(2);
    expect(cart.totalItems()).toBe(2);
  });

  it('merges lines when customization matches regardless of toppings order', () => {
    const cart = new Cart(EntityId.create('cart-1'));

    cart.addLine(createLine('line-1', 1, { extraToppings: ['olives', 'extra-cheese'] }));
    cart.addLine(createLine('line-2', 2, { extraToppings: ['extra-cheese', 'olives'] }));

    expect(cart.lines).toHaveLength(1);
    expect(cart.lines[0].quantity).toBe(3);
  });

  it('removes only the targeted line when quantity is decremented to zero', () => {
    const cart = new Cart(EntityId.create('cart-1'));

    cart.addLine(createLine('line-1', 1, { extraToppings: ['extra-cheese'] }));
    cart.addLine(createLine('line-2', 1, { extraToppings: ['olives'] }));

    cart.updateLineQuantity(EntityId.create('line-1'), 0);

    expect(cart.lines).toHaveLength(1);
    expect(cart.lines[0].id.value).toBe('line-2');
  });
});
