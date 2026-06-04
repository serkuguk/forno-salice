import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CatalogItemVm } from '@app/contexts/catalog/application/dto/catalog-item.vm';
import { GetCatalogItemsUseCase } from '@app/contexts/catalog/application/use-cases/get-catalog-items.use-case';
import { AddCatalogItemToCartUseCase } from '@app/contexts/catalog/application/use-cases/add-catalog-item-to-cart.use-case';
import { GetCartUseCase } from '@app/contexts/cart/application/use-cases/get-cart.use-case';
import { RemoveLineUseCase } from '@app/contexts/cart/application/use-cases/remove-line.use-case';
import { UpdateLineQuantityUseCase } from '@app/contexts/cart/application/use-cases/update-line-quantity.use-case';
import { CartDrawerService } from '@app/contexts/cart/presentation/services/cart-drawer.service';
import { CatalogPageComponent } from './catalog-page.component';

describe('CatalogPageComponent', () => {
  let fixture: ComponentFixture<CatalogPageComponent>;
  let component: CatalogPageComponent;
  const addToCartUseCase = {
    execute: jest.fn(),
  };
  const cartDrawerService = {
    isOpen: () => false,
    toggle: jest.fn(),
    close: jest.fn(),
    setCount: jest.fn(),
    cartCount: () => 0,
  };

  const pizzaItem: CatalogItemVm = {
    id: 'pizza-margherita',
    title: 'Margherita Ember',
    description: 'Tomato, mozzarella, basil',
    category: 'pizza',
    categoryKey: 'classics',
    isFeatured: false,
    priceValue: 11.7,
    currency: 'EUR',
    priceLabel: '11.70 EUR',
  };

  const drinkItem: CatalogItemVm = {
    id: 'drink-cola',
    title: 'Cola',
    description: 'Sparkling soft drink',
    category: 'drink',
    categoryKey: 'classics',
    isFeatured: false,
    priceValue: 2.5,
    currency: 'EUR',
    priceLabel: '2.50 EUR',
  };

  beforeEach(async () => {
    addToCartUseCase.execute.mockReturnValue(of({
      id: 'cart-1',
      lines: [],
      totalItems: 3,
      totalAmount: 35.1,
      currency: 'EUR',
    }));
    cartDrawerService.setCount.mockClear();

    await TestBed.configureTestingModule({
      imports: [CatalogPageComponent],
      providers: [
        provideRouter([]),
        { provide: GetCatalogItemsUseCase, useValue: { execute: () => of([]) } },
        { provide: AddCatalogItemToCartUseCase, useValue: addToCartUseCase },
        { provide: GetCartUseCase, useValue: { execute: () => of(null) } },
        { provide: RemoveLineUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateLineQuantityUseCase, useValue: { execute: jest.fn() } },
        { provide: CartDrawerService, useValue: cartDrawerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('delegates add-to-cart to catalog application use case', () => {
    component.addToCart(pizzaItem);

    expect(addToCartUseCase.execute).toHaveBeenCalledWith(pizzaItem);
  });

  it('updates cart badge and UI feedback after successful add', () => {
    component.addToCart(drinkItem);

    expect(cartDrawerService.setCount).toHaveBeenCalledWith(3);
    expect(component.addedItemId()).toBe('drink-cola');
  });
});
