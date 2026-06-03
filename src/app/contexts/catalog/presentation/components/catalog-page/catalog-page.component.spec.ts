import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CatalogItemVm } from '@app/contexts/catalog/application/dto/catalog-item.vm';
import { GetCatalogItemsUseCase } from '@app/contexts/catalog/application/use-cases/get-catalog-items.use-case';
import { AddLineUseCase } from '@app/contexts/cart/application/use-cases/add-line.use-case';
import { GetCartUseCase } from '@app/contexts/cart/application/use-cases/get-cart.use-case';
import { RemoveLineUseCase } from '@app/contexts/cart/application/use-cases/remove-line.use-case';
import { UpdateLineQuantityUseCase } from '@app/contexts/cart/application/use-cases/update-line-quantity.use-case';
import { CartDrawerService } from '@app/contexts/cart/presentation/services/cart-drawer.service';
import { CatalogPageComponent } from './catalog-page.component';

describe('CatalogPageComponent', () => {
  let fixture: ComponentFixture<CatalogPageComponent>;
  let component: CatalogPageComponent;
  const addLineUseCase = {
    execute: jest.fn(),
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
    addLineUseCase.execute.mockReturnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [CatalogPageComponent],
      providers: [
        provideRouter([]),
        { provide: GetCatalogItemsUseCase, useValue: { execute: () => of([]) } },
        { provide: AddLineUseCase, useValue: addLineUseCase },
        { provide: GetCartUseCase, useValue: { execute: () => of(null) } },
        { provide: RemoveLineUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateLineQuantityUseCase, useValue: { execute: jest.fn() } },
        { provide: CartDrawerService, useValue: { isOpen: () => false, toggle: jest.fn(), close: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('sends normalized pizza customization and no marketing text as notes', () => {
    component.addToCart(pizzaItem);

    expect(addLineUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        menuItemId: 'pizza-margherita',
        notes: null,
        customization: {
          size: 'medium',
          dough: 'classic',
          extraToppings: [],
        },
      }),
    );
  });

  it('sends null customization for non-pizza item', () => {
    component.addToCart(drinkItem);

    expect(addLineUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        menuItemId: 'drink-cola',
        notes: null,
        customization: null,
      }),
    );
  });
});
