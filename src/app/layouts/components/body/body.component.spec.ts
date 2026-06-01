import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {BodyComponent} from "@app/layouts";

describe('BodyComponent (unit methods only)', () => {
    let component: BodyComponent;

    beforeEach(async () => {
        const routerEvents$ = new Subject<any>();

        await TestBed.configureTestingModule({
            providers: [
                {
                    provide: Router,
                    useValue: {
                        events: routerEvents$.asObservable(),
                        navigate: jest.fn(),
                    },
                },
            ],
        }).compileComponents();

        component = TestBed.runInInjectionContext(() => new BodyComponent());
    });

    describe('onToggleSideNav', () => {
        it('updates screenWidth and isSideNavCollapsed', () => {
            component.screenWidth = () => 1024 as any;
            component.collapsed = () => true as any;
            expect(component.getBodyClass()).toBe('body-treemed');
        });

        it('handles collapsed = false', () => {
            component.screenWidth = () => 1024 as any;
            component.collapsed = () => false as any;
            expect(component.getBodyClass()).toBe('');
        });
    });
});

