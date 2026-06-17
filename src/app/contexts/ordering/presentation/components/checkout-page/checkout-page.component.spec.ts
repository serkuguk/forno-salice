import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CheckoutVm } from '@app/contexts/ordering/application/dto/checkout.vm';
import { OrderConfirmationVm } from '@app/contexts/ordering/application/dto/order-confirmation.vm';
import { GetCheckoutUseCase } from '@app/contexts/ordering/application/use-cases/get-checkout.use-case';
import { PlaceOrderUseCase } from '@app/contexts/ordering/application/use-cases/place-order.use-case';
import { FornoShellComponent } from '@pages/forno/components/forno-shell/forno-shell.component';
import { CheckoutPageComponent } from './checkout-page.component';

@Component({
  selector: 'app-forno-shell',
  standalone: true,
  template: '<ng-content />',
})
class FornoShellStubComponent {}

describe('CheckoutPageComponent', () => {
  let fixture: ComponentFixture<CheckoutPageComponent>;
  let component: CheckoutPageComponent;

  const checkoutVm: CheckoutVm = {
    lines: [
      { id: 'line-1', name: 'Margherita', quantity: 2, subtotal: 24 },
      { id: 'line-2', name: 'Tiramisu', quantity: 1, subtotal: 6.5 },
    ],
    subtotal: 30.5,
    deliveryFee: 4.5,
    currency: 'GBP',
    canSubmit: true,
  };

  const confirmationVm: OrderConfirmationVm = {
    orderId: 'ord-123',
    status: 'Confirmed',
    estimatedMinutes: 25,
    createdAt: '2026-06-17T10:00:00.000Z',
    total: 35,
    currency: 'GBP',
  };

  const getCheckoutUseCase = {
    execute: jest.fn().mockReturnValue(of(checkoutVm)),
  };

  const placeOrderUseCase = {
    execute: jest.fn().mockReturnValue(of(confirmationVm)),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    getCheckoutUseCase.execute.mockReturnValue(of(checkoutVm));
    placeOrderUseCase.execute.mockReturnValue(of(confirmationVm));

    await TestBed.configureTestingModule({
      imports: [CheckoutPageComponent],
      providers: [
        provideRouter([]),
        { provide: GetCheckoutUseCase, useValue: getCheckoutUseCase },
        { provide: PlaceOrderUseCase, useValue: placeOrderUseCase },
      ],
    })
      .overrideComponent(CheckoutPageComponent, {
        remove: { imports: [FornoShellComponent] },
        add: { imports: [FornoShellStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CheckoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('builds derived summary labels and button text in delivery mode', () => {
    expect(component.isDelivery()).toBe(true);
    expect(component.fulfillmentLabel()).toBe('Delivery');
    expect(component.fulfillmentPriceLabel()).toBe('£4.50');
    expect(component.formattedTotal()).toBe('£35.00');
    expect(component.placeOrderLabel()).toBe('Place order — £35.00');
    expect(component.summaryLines()).toEqual([
      {
        id: 'line-1',
        nameLabel: 'Margherita ×2',
        subtotalLabel: '£24.00',
      },
      {
        id: 'line-2',
        nameLabel: 'Tiramisu ×1',
        subtotalLabel: '£6.50',
      },
    ]);
  });

  it('switches derived labels for collection mode', () => {
    component.setMode('collection');

    expect(component.isCollection()).toBe(true);
    expect(component.showDeliveryAddressFields()).toBe(false);
    expect(component.fulfillmentLabel()).toBe('Collection');
    expect(component.fulfillmentPriceLabel()).toBe('Free');
    expect(component.formattedTotal()).toBe('£30.50');
    expect(component.confirmationText()).toBe(
      'Collection from Forno & Slice, Shoreditch',
    );
  });

  it('computes active steps from the current step', () => {
    expect(component.checkoutSteps().map((step) => step.active)).toEqual([
      true,
      false,
      false,
    ]);

    component.step.set(3);

    expect(component.checkoutSteps().map((step) => step.active)).toEqual([
      true,
      true,
      true,
    ]);
    expect(component.isStep3()).toBe(true);
  });

  it('shows control errors only for touched invalid controls', () => {
    const emailControl = component.form.controls.email;

    expect(component.showControlError('email')).toBe(false);
    expect(component.controlErrorMessage('email')).toBe('Enter a valid email.');

    emailControl.markAsTouched();
    emailControl.setValue('invalid');

    expect(component.showControlError('email')).toBe(true);

    emailControl.setValue('valid@example.com');

    expect(component.showControlError('email')).toBe(false);
  });

  it('renders preformatted summary values and hides delivery fields in collection mode', () => {
    component.step.set(3);
    component.setMode('collection');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Collection from Forno & Slice, Shoreditch');
    expect(text).toContain('Margherita ×2');
    expect(text).toContain('£24.00');
    expect(text).toContain('Free');
    expect(text).toContain('£30.50');
    expect(fixture.nativeElement.querySelector('#address')).toBeNull();
  });

  it('uses the placing label while an order request is in flight', () => {
    component.placing.set(true);

    expect(component.placeOrderLabel()).toBe('Placing…');
  });

  it('navigates to tracking after a successful order', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest
      .spyOn(router, 'navigate')
      .mockResolvedValue(true);

    component.placeOrder();

    expect(placeOrderUseCase.execute).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/tracking', confirmationVm.orderId]);
  });
});
