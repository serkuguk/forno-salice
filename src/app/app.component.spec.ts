import {TestBed} from '@angular/core/testing';
import {NavigationEnd, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {AppComponent} from './app.component';
import {AuthStateService} from '@pages/auth/services/auth-state.service';

describe('AppComponent', () => {
    let component: AppComponent;
    let routerEvents$: Subject<any>;
    let authStateServiceMock: { init: jest.Mock; isAuthenticated$: Subject<any> };

    beforeEach(async () => {
        routerEvents$ = new Subject<any>();
        authStateServiceMock = {
            init: jest.fn(() => ({ subscribe: jest.fn() })),
            isAuthenticated$: new Subject<any>(),
        };

        await TestBed.configureTestingModule({
            providers: [
                {
                    provide: Router,
                    useValue: {
                        events: routerEvents$.asObservable(),
                        navigate: jest.fn(),
                    },
                },
                {
                    provide: AuthStateService,
                    useValue: authStateServiceMock,
                },
            ],
        }).compileComponents();

        component = TestBed.runInInjectionContext(() => new AppComponent());
    });

    it('calls auth init when NavigationEnd occurs', () => {
        component.ngOnInit();
        routerEvents$.next(new NavigationEnd(1, '/dashboard', '/dashboard'));

        expect(authStateServiceMock.init).toHaveBeenCalledTimes(1);
    });
});
