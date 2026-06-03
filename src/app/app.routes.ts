import { Routes } from '@angular/router';
import { CATALOG_PROVIDERS } from './contexts/catalog/catalog.providers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./contexts/catalog/presentation/components/catalog-page/catalog-page.component').then(c => c.CatalogPageComponent),
    providers: [...CATALOG_PROVIDERS]
  },
  {
    path: 'menu',
    loadComponent: () => import('./contexts/catalog/presentation/components/catalog-page/catalog-page.component').then(c => c.CatalogPageComponent),
    providers: [...CATALOG_PROVIDERS]
  },
  {
    path: 'build',
    loadComponent: () => import('@pages/forno/forno-stub-page.component').then(c => c.FornoStubPageComponent)
  },
  {
    path: 'kitchen',
    loadComponent: () => import('@pages/forno/forno-stub-page.component').then(c => c.FornoStubPageComponent)
  },
  {
    path: '**',
    redirectTo: 'menu'
  }
];
