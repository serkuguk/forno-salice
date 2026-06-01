import {TestBed} from '@angular/core/testing';
import {Router, UrlTree} from '@angular/router';
import {AuthTokenStorageService} from '@core/services/auth-token-storage.service';
import {isAuthCanMatch, loggedGuard, redirectLoggedInGuard} from './auth.guard';

describe('auth guards', () => {
  const loginTree = {} as UrlTree;
  const dashboardTree = {} as UrlTree;

  let isAuthenticateMock: jest.Mock<boolean, []>;
  let createUrlTreeMock: jest.Mock<UrlTree, [commands: readonly any[]]>;

  beforeEach(() => {
    isAuthenticateMock = jest.fn<boolean, []>();
    createUrlTreeMock = jest.fn<UrlTree, [commands: readonly any[]]>((commands) => {
      return commands[0] === '/dashboard' ? dashboardTree : loginTree;
    });

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthTokenStorageService,
          useValue: {
            isAuthenticate: isAuthenticateMock,
          },
        },
        {
          provide: Router,
          useValue: {
            createUrlTree: createUrlTreeMock,
          },
        },
      ],
    });
  });

  it('isAuthCanMatch returns true when authenticated', () => {
    isAuthenticateMock.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => isAuthCanMatch({} as any, []));

    expect(result).toBe(true);
    expect(createUrlTreeMock).not.toHaveBeenCalled();
  });

  it('isAuthCanMatch redirects to /login when not authenticated', () => {
    isAuthenticateMock.mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() => isAuthCanMatch({} as any, []));

    expect(result).toBe(loginTree);
    expect(createUrlTreeMock).toHaveBeenCalledWith(['/login']);
  });

  it('loggedGuard returns UrlTree(/login) when not authenticated', () => {
    isAuthenticateMock.mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() => loggedGuard({} as any, {} as any));

    expect(result).toBe(loginTree);
    expect(createUrlTreeMock).toHaveBeenCalledWith(['/login']);
  });

  it('loggedGuard returns true when authenticated', () => {
    isAuthenticateMock.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => loggedGuard({} as any, {} as any));

    expect(result).toBe(true);
  });

  it('redirectLoggedInGuard redirects authenticated user to /dashboard', () => {
    isAuthenticateMock.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => redirectLoggedInGuard({} as any, {} as any));

    expect(result).toBe(dashboardTree);
    expect(createUrlTreeMock).toHaveBeenCalledWith(['/dashboard']);
  });
});
