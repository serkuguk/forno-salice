import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { AuthService } from '@core/services/auth/auth.service';
import { AuthTokenStorageService } from '@core/services/auth-token-storage.service';
import { authInterceptor } from './auth.interceptor';

type AuthRefreshResponse = { access_token: string; refresh_token: string };

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let storage: jest.Mocked<Pick<AuthTokenStorageService, 'getToken' | 'logOut'>>;
  let authService: jest.Mocked<Pick<AuthService, 'refreshAccessToken'>>;

  beforeEach(() => {
    storage = {
      getToken: jest.fn(),
      logOut: jest.fn(),
    };

    authService = {
      refreshAccessToken: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthTokenStorageService, useValue: storage },
        { provide: AuthService, useValue: authService },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('passes request unchanged when access token is missing', () => {
    storage.getToken.mockReturnValue(null);

    http.get('/public').subscribe();

    const req = httpMock.expectOne('/public');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('adds Authorization header when token exists', () => {
    storage.getToken.mockReturnValue('access-token');

    http.get('/secure').subscribe();

    const req = httpMock.expectOne('/secure');
    expect(req.request.headers.get('Authorization')).toBe('Bearer access-token');
    req.flush({});
  });

  it('logs out on 401 responses', (done) => {
    storage.getToken.mockReturnValue('access-token');

    http.get('/secure').subscribe({
      next: () => done.fail('expected an error'),
      error: () => {
        expect(storage.logOut).toHaveBeenCalledTimes(1);
        done();
      },
    });

    const req = httpMock.expectOne('/secure');
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('refreshes token on 403 and retries original request', (done) => {
    storage.getToken.mockReturnValue('access-token');
    authService.refreshAccessToken.mockReturnValue(
      of({ access_token: 'new-token', refresh_token: 'new-refresh' }),
    );

    http.get('/secure').subscribe({
      next: (response: unknown) => {
        expect(response).toEqual({ ok: true });
        expect(authService.refreshAccessToken).toHaveBeenCalledTimes(1);
        done();
      },
      error: (error: HttpErrorResponse) => done.fail(error),
    });

    const initial = httpMock.expectOne('/secure');
    expect(initial.request.headers.get('Authorization')).toBe('Bearer access-token');
    initial.flush({ message: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });

    const retried = httpMock.expectOne('/secure');
    expect(retried.request.headers.get('Authorization')).toBe('Bearer new-token');
    retried.flush({ ok: true });
  });

  it('queues concurrent 403 requests while token refresh is in progress', () => {
    storage.getToken.mockReturnValue('access-token');
    const refresh$ = new Subject<AuthRefreshResponse>();
    authService.refreshAccessToken.mockReturnValue(refresh$.asObservable());
    const resolved: string[] = [];

    http.get<{ ok: string }>('/secure-a').subscribe((response) => resolved.push(response.ok));
    http.get<{ ok: string }>('/secure-b').subscribe((response) => resolved.push(response.ok));

    const first = httpMock.expectOne('/secure-a');
    const second = httpMock.expectOne('/secure-b');
    first.flush({ message: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });
    second.flush({ message: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });

    expect(authService.refreshAccessToken).toHaveBeenCalledTimes(1);

    refresh$.next({ access_token: 'new-token', refresh_token: 'new-refresh' });
    refresh$.complete();

    const firstRetried = httpMock.expectOne('/secure-a');
    firstRetried.flush({ ok: 'a' });

    const secondRetriedRequests = httpMock.match('/secure-b');
    expect(secondRetriedRequests.length).toBeGreaterThanOrEqual(1);
    secondRetriedRequests
      .filter((request) => !request.cancelled)
      .forEach((request) => request.flush({ ok: 'b' }));

    expect(resolved).toContain('a');
    expect(resolved).toContain('b');
  });
});
