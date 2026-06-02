import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CartVm } from '@app/contexts/cart/application/dto/cart.vm';
import { GetCartUseCase } from '@app/contexts/cart/application/use-cases/get-cart.use-case';
import { RemoveLineUseCase } from '@app/contexts/cart/application/use-cases/remove-line.use-case';
import { UpdateLineQuantityUseCase } from '@app/contexts/cart/application/use-cases/update-line-quantity.use-case';
import { CartPageComponent } from './cart-page.component';

describe('CartPageComponent', () => {
  let fixture: ComponentFixture<CartPageComponent>;
  const updateLineQuantityUseCase = {
    execute: jest.fn(),
  };
  const removeLineUseCase = {
    execute: jest.fn(),
  };

  const cart: CartVm = {
    id: 'cart-1',
    currency: 'EUR',
    totalItems: 2,
    totalAmount: 14.2,
    lines: [
      {
        id: 'line-1',
        menuItemId: 'pizza-margherita',
        name: 'Margherita Ember',
        unitPrice: 11.7,
        currency: 'EUR',
        quantity: 1,
        notes: null,
        customization: {
          size: 'medium',
          dough: 'classic',
          extraToppings: ['extra-cheese'],
        },
        subtotal: 11.7,
      },
      {
        id: 'line-2',
        menuItemId: 'drink-cola',
        name: 'Cola',
        unitPrice: 2.5,
        currency: 'EUR',
        quantity: 1,
        notes: null,
        customization: {
          size: null,
          dough: null,
          extraToppings: [],
        },
        subtotal: 2.5,
      },
    ],
  };

  beforeEach(async () => {
    updateLineQuantityUseCase.execute.mockReturnValue(of(cart));
    removeLineUseCase.execute.mockReturnValue(of(cart));

    await TestBed.configureTestingModule({
      imports: [CartPageComponent],
      providers: [
        provideRouter([]),
        { provide: GetCartUseCase, useValue: { execute: () => of(cart) } },
        { provide: RemoveLineUseCase, useValue: removeLineUseCase },
        { provide: UpdateLineQuantityUseCase, useValue: updateLineQuantityUseCase },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartPageComponent);
    fixture.detectChanges();
  });

  it('renders distinct lines loaded from cart state', () => {
    const content = fixture.nativeElement.textContent;

    expect(content).toContain('Margherita Ember');
    expect(content).toContain('Cola');
  });

  it('updates only the targeted line quantity when plus is clicked', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.cart-line__qty button');

    buttons[1].click();

    expect(updateLineQuantityUseCase.execute).toHaveBeenCalledWith({
      lineId: 'line-1',
      quantity: 2,
    });
  });
});
