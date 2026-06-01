import {inject} from '@angular/core'
import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http'
import {AuthTokenStorageService} from '../services/auth-token-storage.service';
import {BehaviorSubject, catchError, switchMap, tap, throwError} from "rxjs";
import {filter} from "rxjs/operators";
import { AuthService } from "@core/services/auth/auth.service";

let isRefreshing$ = new BehaviorSubject<boolean>(false);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
    const authToken: AuthTokenStorageService = inject(AuthTokenStorageService);
    const authService: AuthService = inject(AuthService);
    const token = authToken.getToken('access_token');

    if (!token) return next(req);

    if (isRefreshing$.value) {
      return refreshToken(authService, req, next, token);
    }

    return next(addToken(req, token)).pipe(
      catchError(err => {
        if (err.status === 401) {
          authToken.logOut();
        }

        if (err.status === 403) {
          return refreshToken(authService, req, next, token);
        }

        const error = err.error.message || err.statusText;
        return throwError(() => error);
      }
    ))
}

const refreshToken = (
  authService: AuthService,
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  token: string) => {

    if (!isRefreshing$.value) {
      isRefreshing$.next(true);
      return authService.refreshAccessToken()
        .pipe(
          switchMap((res: { access_token: string }) => {
            return next(addToken(req, res.access_token))
              .pipe(
                tap(_ => isRefreshing$.next(false))
              )
          })
        );
    }

    if (req.url.includes('refresh_token')) return next(addToken(req, token));

    return isRefreshing$.pipe(
      filter(isRefreshing => !isRefreshing),
      switchMap(_ => next(addToken(req, token)))
    );
};

const addToken = (
  req: HttpRequest<any>,
  token: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
};
