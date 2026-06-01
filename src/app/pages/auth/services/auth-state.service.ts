import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

interface LoginRequestInterface {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly userSubject = new BehaviorSubject<any | null>(null);
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  readonly user$ = this.userSubject.asObservable();
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  init(): Observable<boolean> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.authService.init().pipe(
      tap((isAuthenticated) => {
        this.isAuthenticatedSubject.next(isAuthenticated);
        this.userSubject.next(isAuthenticated ? this.authService.getUser() : null);
      }),
      catchError((error: { message?: string }) => {
        this.isAuthenticatedSubject.next(false);
        this.userSubject.next(null);
        this.errorSubject.next(error?.message ?? 'Auth init error');
        return EMPTY;
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  login(credentials: LoginRequestInterface): Observable<any> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.authService.login(credentials).pipe(
      tap((user: any) => {
        this.userSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        this.router.navigate(['']);
      }),
      catchError((error: { message?: string }) => {
        this.errorSubject.next(error?.message ?? 'Login error');
        this.isAuthenticatedSubject.next(false);
        return EMPTY;
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  logout(): Observable<null> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.authService.logout().pipe(
      map(() => null),
      tap(() => {
        this.userSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/login']);
      }),
      catchError((error: { message?: string }) => {
        this.errorSubject.next(error?.message ?? 'Logout error');
        return EMPTY;
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  updateUser(user: any): Observable<any> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.authService.userUpdate({ user }).pipe(
      map(() => user),
      tap((updatedUser) => this.userSubject.next(updatedUser)),
      catchError((error: { message?: string }) => {
        this.errorSubject.next(error?.message ?? 'Update user error');
        return EMPTY;
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }
}
