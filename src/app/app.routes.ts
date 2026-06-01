import { Routes } from '@angular/router';
import {
  isAuthCanMatch,
  loggedGuard,
  redirectLoggedInGuard
} from '@pages/auth/services/auth.guard';
import { CATALOG_PROVIDERS } from './contexts/catalog/catalog.providers';
import { CART_PROVIDERS } from './contexts/cart/cart.providers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('@pages/auth/components/login/login.component').then(c => c.LoginComponent),
    canActivate: [redirectLoggedInGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('@pages/home/home.component').then(c => c.HomeComponent),
    canMatch: [isAuthCanMatch],
    canActivate: [loggedGuard]
  },
  {
    path: 'menu',
    loadComponent: () => import('./contexts/catalog/presentation/components/catalog-page/catalog-page.component').then(c => c.CatalogPageComponent),
    providers: [...CATALOG_PROVIDERS, ...CART_PROVIDERS],
    canMatch: [isAuthCanMatch],
    canActivate: [loggedGuard]
  },
  {
    path: 'build',
    loadComponent: () => import('@pages/forno/forno-stub-page.component').then(c => c.FornoStubPageComponent),
    canMatch: [isAuthCanMatch],
    canActivate: [loggedGuard]
  },
  {
    path: 'kitchen',
    loadComponent: () => import('@pages/forno/forno-stub-page.component').then(c => c.FornoStubPageComponent),
    canMatch: [isAuthCanMatch],
    canActivate: [loggedGuard]
  },
  {
    path: 'cart',
    loadComponent: () => import('./contexts/cart/presentation/components/cart-page/cart-page.component').then(c => c.CartPageComponent),
    providers: [...CART_PROVIDERS],
    canMatch: [isAuthCanMatch],
    canActivate: [loggedGuard]
  },
  {
    path: '**',
    canActivate: [loggedGuard],
    loadComponent: () => import('@pages/notfound-page/notfound-page.component').then(c => c.NotfoundPageComponent)
  }
];
