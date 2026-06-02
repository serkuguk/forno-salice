import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withViewTransitions
} from '@angular/router';
import { routes as appRotes } from './app.routes';
import { CART_PROVIDERS } from './contexts/cart/cart.providers';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PlatformModule } from '@angular/cdk/platform';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { NgxPermissionsModule } from 'ngx-permissions';
import { GLOBAL_SHARED_STORE_PROVIDERS } from "@shared/services/global-shared.service";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
const CORE_PROVIDERS = [
  TranslateService,
  ...GLOBAL_SHARED_STORE_PROVIDERS,
];
const MODULE_PROVIDERS = [
  importProvidersFrom(PlatformModule),
  importProvidersFrom(NgxPermissionsModule.forRoot()),
  importProvidersFrom(
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'sp',
    }),
  ),
];
const ANGULAR_PROVIDERS = [
  providePrimeNG({
    theme: {
      preset: Aura,
    },
  }),
  provideHttpClient(),
  provideZonelessChangeDetection()
];
const ROUTER_PROVIDERS = [
  provideRouter(appRotes,
    withComponentInputBinding(),
    withViewTransitions(),
    withEnabledBlockingInitialNavigation(),
  ),
];
export const appConfig: ApplicationConfig = {
  providers: [
    ...CORE_PROVIDERS,
    ...MODULE_PROVIDERS,
    ...ANGULAR_PROVIDERS,
    ...ROUTER_PROVIDERS,
    ...CART_PROVIDERS,
  ],
};
