import { CartApiMapper } from './cart-api.mapper';

describe('CartApiMapper', () => {
  it('keeps separate lines for different customizations when mapping from API', () => {
    const cart = CartApiMapper.toDomain({
      id: 'cart-1001',
      currency: 'EUR',
      lines: [
        {
          id: 'line-1',
          menuItemId: 'pizza-margherita',
          name: 'Margherita Ember',
          quantity: 1,
          unitPrice: 11.7,
          currency: 'EUR',
          customization: {
            size: 'medium',
            dough: 'classic',
            extraToppings: ['extra-cheese'],
          },
        },
        {
          id: 'line-2',
          menuItemId: 'pizza-margherita',
          name: 'Margherita Ember',
          quantity: 1,
          unitPrice: 11.7,
          currency: 'EUR',
          customization: {
            size: 'medium',
            dough: 'classic',
            extraToppings: ['olives'],
          },
        },
      ],
    });

    expect(cart.lines).toHaveLength(2);
  });

  it('uses cart-level currency when line currency is omitted', () => {
    const cart = CartApiMapper.toDomain({
      id: 'cart-1001',
      currency: 'EUR',
      lines: [
        {
          id: 'line-1',
          menuItemId: 'drink-cola',
          name: 'Cola',
          quantity: 1,
          unitPrice: 2.5,
          customization: {
            size: null,
            dough: null,
            extraToppings: [],
          },
        },
      ],
    });

    expect(cart.totalAmount().currency).toBe('EUR');
  });
});
