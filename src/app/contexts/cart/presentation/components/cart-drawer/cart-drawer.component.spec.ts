import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { CartVm } from '@app/contexts/cart/application/dto/cart.vm';
import { GetCartUseCase } from '@app/contexts/cart/application/use-cases/get-cart.use-case';
import { RemoveLineUseCase } from '@app/contexts/cart/application/use-cases/remove-line.use-case';
import { UpdateLineQuantityUseCase } from '@app/contexts/cart/application/use-cases/update-line-quantity.use-case';
import { CartDrawerService } from '../../services/cart-drawer.service';
import { CartDrawerComponent } from './cart-drawer.component';

describe('CartDrawerComponent', () => {
  let fixture: ComponentFixture<CartDrawerComponent>;
  let component: CartDrawerComponent;
  let drawerService: CartDrawerService;
  let router: Router;

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
    await TestBed.configureTestingModule({
      imports: [CartDrawerComponent],
      providers: [
        provideRouter([]),
        CartDrawerService,
        { provide: GetCartUseCase, useValue: { execute: jest.fn(() => of(cart)) } },
        { provide: RemoveLineUseCase, useValue: { execute: jest.fn(() => of(cart)) } },
        { provide: UpdateLineQuantityUseCase, useValue: { execute: jest.fn(() => of(cart)) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartDrawerComponent);
    component = fixture.componentInstance;
    drawerService = TestBed.inject(CartDrawerService);
    router = TestBed.inject(Router);
    drawerService.open();
    fixture.detectChanges();
  });

  it('builds derived line labels and formatted totals', () => {
    component.cart.set(cart);
    fixture.detectChanges();

    expect(component.itemCountLabel()).toBe('2 items');
    expect(component.cartLines()).toEqual([
      {
        id: 'line-1',
        name: 'Margherita Ember',
        quantity: 1,
        notesLabel: null,
        customizationLabel: 'medium · classic · extra-cheese',
        subtotalLabel: '11.70 EUR',
      },
      {
        id: 'line-2',
        name: 'Cola',
        quantity: 1,
        notesLabel: null,
        customizationLabel: null,
        subtotalLabel: '2.50 EUR',
      },
    ]);
    expect(component.formattedSubtotal()).toBe('14.20 EUR');
    expect(component.formattedDelivery()).toBe('2.50 EUR');
    expect(component.formattedTotal()).toBe('16.70 EUR');
    expect(component.showFooter()).toBe(true);
  });

  it('renders precomputed customization and subtotal labels', () => {
    component.cart.set(cart);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('2 items');
    expect(text).toContain('medium · classic · extra-cheese');
    expect(text).toContain('11.70 EUR');
    expect(text).toContain('14.20 EUR');
    expect(text).toContain('16.70 EUR');
  });

  it('uses the empty item count label and hides footer for empty carts', () => {
    component.cart.set({
      ...cart,
      totalItems: 0,
      totalAmount: 0,
      lines: [],
    });
    fixture.detectChanges();

    expect(component.itemCountLabel()).toBe('Your order');
    expect(component.isEmpty()).toBe(true);
    expect(component.showFooter()).toBe(false);
  });

  it('closes the drawer and navigates to checkout', () => {
    const closeSpy = jest.spyOn(drawerService, 'close');
    const navigateSpy = jest
      .spyOn(router, 'navigate')
      .mockResolvedValue(true);

    component.goToCheckout();

    expect(closeSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/checkout']);
  });
});
