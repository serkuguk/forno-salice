import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, EMPTY, finalize } from 'rxjs';
import { FornoShellComponent } from '@pages/forno/components/forno-shell/forno-shell.component';
import { CheckoutVm } from '@app/contexts/ordering/application/dto/checkout.vm';
import { OrderConfirmationVm } from '@app/contexts/ordering/application/dto/order-confirmation.vm';
import { PlaceOrderDto } from '@app/contexts/ordering/application/dto/place-order.dto';
import { GetCheckoutUseCase } from '@app/contexts/ordering/application/use-cases/get-checkout.use-case';
import { PlaceOrderUseCase } from '@app/contexts/ordering/application/use-cases/place-order.use-case';

type CheckoutMode = 'delivery' | 'collection';
type CheckoutStep = 1 | 2 | 3;
type CheckoutFieldName =
  | 'name'
  | 'email'
  | 'phone'
  | 'address'
  | 'city'
  | 'postcode'
  | 'card'
  | 'expiry'
  | 'cvv';

interface CheckoutStepVm {
  readonly label: string;
  readonly active: boolean;
}

interface CheckoutSummaryLineVm {
  readonly id: string;
  readonly nameLabel: string;
  readonly subtotalLabel: string;
}

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FornoShellComponent],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent {
  private static readonly STEP_LABELS = [
    'Your details',
    'Payment',
    'Confirm',
  ] as const;

  private static readonly FIELD_ERROR_MESSAGES: Record<CheckoutFieldName, string> = {
    name: 'Please enter your name.',
    email: 'Enter a valid email.',
    phone: 'Please enter a phone number.',
    address: 'Please enter a delivery address.',
    city: 'Please enter a city.',
    postcode: 'Please enter a postcode.',
    card: 'Enter a valid card number.',
    expiry: 'Enter an expiry date.',
    cvv: 'Enter the CVV.',
  };

  private readonly destroyRef = inject(DestroyRef);
  private readonly getCheckoutUseCase = inject(GetCheckoutUseCase);
  private readonly placeOrderUseCase = inject(PlaceOrderUseCase);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly checkout = signal<CheckoutVm | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly mode = signal<CheckoutMode>('delivery');
  readonly step = signal<CheckoutStep>(1);
  readonly placing = signal(false);
  readonly placeError = signal<string | null>(null);
  readonly confirmation = signal<OrderConfirmationVm | null>(null);
  readonly placed = computed(() => this.confirmation() !== null);
  readonly hasCheckout = computed(() => this.checkout() !== null);
  readonly hasError = computed(() => this.error() !== null);
  readonly hasPlaceError = computed(() => this.placeError() !== null);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    postcode: ['', Validators.required],
    card: ['', [Validators.required, Validators.minLength(12)]],
    expiry: ['', [Validators.required, Validators.minLength(4)]],
    cvv: ['', [Validators.required, Validators.minLength(3)]],
  });

  // Money math lives in the domain; the view only picks which precomputed
  // figure applies for the selected fulfillment mode.
  readonly subtotal = computed(() => this.checkout()?.subtotal ?? 0);
  readonly delivery = computed(() =>
    this.mode() === 'delivery' ? (this.checkout()?.deliveryFee ?? 0) : 0,
  );
  readonly total = computed(() => this.subtotal() + this.delivery());
  readonly isDelivery = computed(() => this.mode() === 'delivery');
  readonly isCollection = computed(() => this.mode() === 'collection');
  readonly isStep1 = computed(() => this.step() === 1);
  readonly isStep2 = computed(() => this.step() === 2);
  readonly isStep3 = computed(() => this.step() === 3);
  readonly showDeliveryAddressFields = computed(() => this.isDelivery());
  readonly canSubmitCheckout = computed(() => this.checkout()?.canSubmit ?? false);
  readonly showEmptyCheckout = computed(
    () => this.hasCheckout() && !this.canSubmitCheckout(),
  );
  readonly checkoutSteps = computed<CheckoutStepVm[]>(() =>
    CheckoutPageComponent.STEP_LABELS.map((label, index) => ({
      label,
      active: index + 1 <= this.step(),
    })),
  );
  readonly summaryLines = computed<CheckoutSummaryLineVm[]>(() =>
    (this.checkout()?.lines ?? []).map((line) => ({
      id: line.id,
      nameLabel: `${line.name} ×${line.quantity}`,
      subtotalLabel: this.formatCurrency(line.subtotal),
    })),
  );
  readonly confirmationText = computed(() =>
    this.isDelivery()
      ? 'Delivery'
      : 'Collection from Forno & Slice, Shoreditch',
  );
  readonly fulfillmentLabel = computed(() =>
    this.isDelivery() ? 'Delivery' : 'Collection',
  );
  readonly fulfillmentPriceLabel = computed(() =>
    this.isDelivery() ? this.formattedDelivery() : 'Free',
  );
  readonly formattedDelivery = computed(() => this.formatCurrency(this.delivery()));
  readonly formattedTotal = computed(() => this.formatCurrency(this.total()));
  readonly placeOrderLabel = computed(() =>
    this.placing() ? 'Placing…' : `Place order — ${this.formattedTotal()}`,
  );

  private readonly step1Controls = ['name', 'email', 'phone'] as const;
  private readonly deliveryControls = ['address', 'city', 'postcode'] as const;
  private readonly step2Controls = ['card', 'expiry', 'cvv'] as const;

  constructor() {
    this.load();
  }

  setMode(mode: CheckoutMode): void {
    if (this.mode() === mode) {
      return;
    }
    this.mode.set(mode);

    const required = mode === 'delivery';
    for (const name of this.deliveryControls) {
      const control = this.form.controls[name];
      control.setValidators(required ? [Validators.required] : []);
      control.updateValueAndValidity();
    }
  }

  continueToPayment(): void {
    const controls: string[] = [...this.step1Controls];
    if (this.mode() === 'delivery') {
      controls.push(...this.deliveryControls);
    }

    if (!this.validateControls(controls)) {
      return;
    }
    this.step.set(2);
  }

  reviewOrder(): void {
    if (!this.validateControls([...this.step2Controls])) {
      return;
    }
    this.step.set(3);
  }

  back(): void {
    this.step.update((current) =>
      current > 1 ? ((current - 1) as CheckoutStep) : current,
    );
  }

  placeOrder(): void {
    if (this.placing()) {
      return;
    }
    this.placing.set(true);
    this.placeError.set(null);

    this.placeOrderUseCase
      .execute(this.buildPlaceOrderDto())
      .pipe(
        catchError((err) => {
          console.error('Place order failed:', err);
          this.placeError.set(
            'Failed to place order. Please check your details and try again.',
          );
          return EMPTY;
        }),
        finalize(() => this.placing.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((confirmation) => this.router.navigate(['/tracking', confirmation.orderId]));
  }

  showControlError(name: CheckoutFieldName): boolean {
    const control = this.form.controls[name];
    return control.touched && control.invalid;
  }

  controlErrorMessage(name: CheckoutFieldName): string {
    return CheckoutPageComponent.FIELD_ERROR_MESSAGES[name];
  }

  private buildPlaceOrderDto(): PlaceOrderDto {
    const value = this.form.getRawValue();
    return {
      name: value.name,
      email: value.email,
      phone: value.phone,
      mode: this.mode(),
      address:
        this.mode() === 'delivery'
          ? {
              street: value.address,
              city: value.city,
              postalCode: value.postcode,
            }
          : null,
    };
  }

  private validateControls(names: readonly string[]): boolean {
    let valid = true;
    for (const name of names) {
      const control = this.form.get(name);
      if (!control) {
        continue;
      }
      control.markAsTouched();
      if (control.invalid) {
        valid = false;
      }
    }
    return valid;
  }

  private formatCurrency(value: number): string {
    return `£${value.toFixed(2)}`;
  }
  private load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.getCheckoutUseCase
      .execute()
      .pipe(
        catchError((err) => {
          console.error('Checkout load failed:', err);
          this.error.set('Failed to load checkout');
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((vm) => this.checkout.set(vm));
  }
}
