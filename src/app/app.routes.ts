import { Routes } from '@angular/router';
import { CATALOG_PROVIDERS } from './contexts/catalog/catalog.providers';
import { ORDERING_PROVIDERS } from './contexts/ordering/ordering.providers';
import { CUSTOMER_PROVIDERS } from './contexts/customer/customer.providers';
import { KITCHEN_PROVIDERS } from './contexts/kitchen/kitchen.providers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./contexts/catalog/presentation/components/catalog-page/catalog-page.component').then(
        (c) => c.CatalogPageComponent,
      ),
    providers: [...CATALOG_PROVIDERS],
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./contexts/catalog/presentation/components/catalog-page/catalog-page.component').then(
        (c) => c.CatalogPageComponent,
      ),
    providers: [...CATALOG_PROVIDERS],
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./contexts/cart/presentation/components/cart-page/cart-page.component').then(
        (c) => c.CartPageComponent,
      ),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./contexts/ordering/presentation/components/checkout-page/checkout-page.component').then(
        (c) => c.CheckoutPageComponent,
      ),
    providers: [...ORDERING_PROVIDERS],
  },
  {
    path: 'build',
    loadComponent: () =>
      import('@pages/forno/forno-stub-page.component').then(
        (c) => c.FornoStubPageComponent,
      ),
  },
  {
    path: 'kitchen',
    loadComponent: () =>
      import('./contexts/kitchen/presentation/components/kitchen-order-board/kitchen-order-board.component').then(
        (c) => c.KitchenOrderBoardComponent,
      ),
    providers: [...KITCHEN_PROVIDERS],
  },
  {
    path: 'tracking/:orderId',
    loadComponent: () =>
      import('./contexts/ordering/presentation/components/tracking-page/tracking-page.component').then(
        (c) => c.TrackingPageComponent,
      ),
    providers: [...ORDERING_PROVIDERS],
  },
  {
    path: 'customer',
    redirectTo: 'customer/orders',
    pathMatch: 'full',
  },
  {
    path: 'customer/orders',
    loadComponent: () =>
      import('./contexts/customer/presentation/components/order-history-page/order-history-page.component').then(
        (c) => c.OrderHistoryPageComponent,
      ),
    providers: [...CUSTOMER_PROVIDERS],
  },
  {
    path: 'account/orders',
    loadComponent: () =>
      import('./contexts/customer/presentation/components/order-history-page/order-history-page.component').then(
        (c) => c.OrderHistoryPageComponent,
      ),
    providers: [...CUSTOMER_PROVIDERS],
  },
  {
    path: '**',
    redirectTo: 'menu',
  },
];
