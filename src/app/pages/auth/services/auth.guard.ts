import {inject} from '@angular/core';
import {CanActivateFn, CanMatchFn, Route, Router, UrlSegment} from '@angular/router';
import {AuthTokenStorageService} from '@core/services/auth-token-storage.service';

export const loggedGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const isAuthenticated: boolean = inject(AuthTokenStorageService).isAuthenticate();

  if (isAuthenticated) {
    return true;
  }

  return router.createUrlTree(['/login']);
}

export const redirectLoggedInGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAuthenticated = inject(AuthTokenStorageService).isAuthenticate();

  if (isAuthenticated) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};

export const isAuthCanMatch: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const router: Router = inject(Router);
  const isAuthenticated: boolean = inject(AuthTokenStorageService).isAuthenticate();

  if (isAuthenticated) {
    return true;
  }

  return router.createUrlTree(['/login']);
}
