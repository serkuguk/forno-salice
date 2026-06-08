import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, EMPTY, finalize } from 'rxjs';
import { FornoShellComponent } from '@pages/forno/components/forno-shell/forno-shell.component';
import { CheckoutVm } from '@app/contexts/ordering/application/dto/checkout.vm';
import { GetCheckoutUseCase } from '@app/contexts/ordering/application/use-cases/get-checkout.use-case';

type CheckoutMode = 'delivery' | 'collection';
type CheckoutStep = 1 | 2 | 3;

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FornoShellComponent],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly getCheckoutUseCase = inject(GetCheckoutUseCase);
  private readonly fb = inject(FormBuilder);

  readonly checkout = signal<CheckoutVm | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly mode = signal<CheckoutMode>('delivery');
  readonly step = signal<CheckoutStep>(1);
  readonly placed = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    postcode: ['', Validators.required],
    card: ['', [Validators.required, Validators.minLength(12)]],
    expiry: ['', [Validators.required, Validators.minLength(4)]],
    cvv: ['', [Validators.required, Validators.minLength(3)]],
  });

  readonly subtotal = computed(() => this.checkout()?.cart.totalAmount ?? 0);
  readonly delivery = computed(() => (this.mode() === 'delivery' ? 2.5 : 0));
  readonly total = computed(() => this.subtotal() + this.delivery());

  private readonly step1Controls = ['name', 'email', 'phone'] as const;
  private readonly deliveryControls = ['address', 'postcode'] as const;
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
    this.step.update((current) => (current > 1 ? ((current - 1) as CheckoutStep) : current));
  }

  placeOrder(): void {
    this.placed.set(true);
  }

  get confirmationText(): string {
    if (this.mode() === 'delivery') {
      const address = this.form.controls.address.value || 'your address';
      return `Delivering to ${address} — est. 30–40 min`;
    }
    return 'Collection from Forno & Slice, Shoreditch — est. 15–20 min';
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
