import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { GetOrderTrackingUseCase } from '@app/contexts/ordering/application/use-cases/get-order-tracking.use-case';
import { OrderTrackingVm } from '@app/contexts/ordering/application/dto/order-tracking.vm';
import { FornoShellComponent } from '@pages/forno/components/forno-shell/forno-shell.component';
import { TrackingPageComponent } from './tracking-page.component';

@Component({
  selector: 'app-forno-shell',
  standalone: true,
  template: '<ng-content />',
})
class FornoShellStubComponent {}

describe('TrackingPageComponent', () => {
  let fixture: ComponentFixture<TrackingPageComponent>;
  let component: TrackingPageComponent;

  const trackingVm: OrderTrackingVm = {
    orderId: 'ord-123',
    statusLabel: 'Preparing your feast',
    statusBody: 'Our kitchen team has started on your order.',
    etaMinutes: 18,
    steps: [
      {
        key: 'Placed',
        label: 'Order placed',
        body: 'We have received your order.',
        state: 'complete',
      },
      {
        key: 'Preparing',
        label: 'Preparing',
        body: 'Chef is stretching dough and firing up the oven.',
        state: 'current',
      },
      {
        key: 'OutForDelivery',
        label: 'Out for delivery',
        body: 'Courier is heading your way.',
        state: 'upcoming',
      },
    ],
    lines: [
      {
        id: 'line-1',
        name: 'Margherita',
        quantity: 2,
        subtotal: 24,
        currency: 'GBP',
      },
      {
        id: 'line-2',
        name: 'Cola',
        quantity: 1,
        subtotal: 3.5,
        currency: 'GBP',
      },
    ],
  };

  const getOrderTrackingUseCase = {
    execute: jest.fn().mockReturnValue(of(trackingVm)),
  };

  async function configureTest(orderId: string | null = 'ord-123'): Promise<void> {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
    getOrderTrackingUseCase.execute.mockReturnValue(of(trackingVm));

    await TestBed.configureTestingModule({
      imports: [TrackingPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap(orderId ? { orderId } : {})),
          },
        },
        { provide: GetOrderTrackingUseCase, useValue: getOrderTrackingUseCase },
      ],
    })
      .overrideComponent(TrackingPageComponent, {
        remove: { imports: [FornoShellComponent] },
        add: { imports: [FornoShellStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TrackingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await configureTest();
  });

  it('builds derived hero labels and formatted line totals', () => {
    expect(component.hasTracking()).toBe(true);
    expect(component.heroTitle()).toBe('Order #ord-123');
    expect(component.etaValue()).toBe('18 min');
    expect(component.trackingLines()).toEqual([
      {
        id: 'line-1',
        nameLabel: 'Margherita ×2',
        subtotalLabel: '24.00 GBP',
      },
      {
        id: 'line-2',
        nameLabel: 'Cola ×1',
        subtotalLabel: '3.50 GBP',
      },
    ]);
  });

  it('derives the status icon from the current step', () => {
    expect(component.currentStep()?.key).toBe('Preparing');
    expect(component.statusIcon()).toBe('local_fire_department');
  });

  it('builds timeline step state for complete, current, and upcoming items', () => {
    expect(component.timelineSteps()).toEqual([
      {
        key: 'Placed',
        label: 'Order placed',
        bodyText: 'Complete',
        isUpcoming: false,
        isComplete: true,
        isCurrent: false,
        showCheckIcon: true,
        showConnector: true,
        connectorComplete: true,
      },
      {
        key: 'Preparing',
        label: 'Preparing',
        bodyText: 'Chef is stretching dough and firing up the oven.',
        isUpcoming: false,
        isComplete: false,
        isCurrent: true,
        showCheckIcon: false,
        showConnector: true,
        connectorComplete: false,
      },
      {
        key: 'OutForDelivery',
        label: 'Out for delivery',
        bodyText: null,
        isUpcoming: true,
        isComplete: false,
        isCurrent: false,
        showCheckIcon: false,
        showConnector: false,
        connectorComplete: false,
      },
    ]);
  });

  it('renders prepared timeline and line labels in the template', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Order #ord-123');
    expect(text).toContain('18 min');
    expect(text).toContain('Preparing your feast');
    expect(text).toContain('Complete');
    expect(text).toContain('Chef is stretching dough and firing up the oven.');
    expect(text).toContain('Margherita ×2');
    expect(text).toContain('24.00 GBP');
  });

  it('shows the existing error state when order id is missing', async () => {
    await configureTest(null);
    fixture.detectChanges();

    expect(component.hasError()).toBe(true);
    expect(component.error()).toBe('Order id is missing');
    expect(getOrderTrackingUseCase.execute).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Order id is missing');
  });
});
