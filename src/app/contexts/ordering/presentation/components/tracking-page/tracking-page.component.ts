import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  catchError,
  distinctUntilChanged,
  EMPTY,
  finalize,
  map,
  switchMap,
} from 'rxjs';
import { FornoShellComponent } from '@pages/forno/components/forno-shell/forno-shell.component';
import { GetOrderTrackingUseCase } from '@app/contexts/ordering/application/use-cases/get-order-tracking.use-case';
import { OrderTrackingVm } from '@app/contexts/ordering/application/dto/order-tracking.vm';

@Component({
  selector: 'app-tracking-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FornoShellComponent],
  templateUrl: './tracking-page.component.html',
  styleUrl: './tracking-page.component.scss',
})
export class TrackingPageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly getOrderTrackingUseCase = inject(GetOrderTrackingUseCase);

  readonly tracking = signal<OrderTrackingVm | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly currentStep = computed(
    () =>
      this.tracking()?.steps.find((step) => step.state === 'current') ?? null,
  );

  constructor() {
    this.load();
  }

  statusIcon(): string {
    const key = this.currentStep()?.key;

    switch (key) {
      case 'Placed':
      case 'Confirmed':
        return 'task_alt';
      case 'Preparing':
        return 'local_fire_department';
      case 'Baking':
        return 'oven';
      case 'Ready':
        return 'inventory_2';
      case 'OutForDelivery':
        return 'local_shipping';
      case 'Delivered':
        return 'done_all';
      default:
        return 'receipt_long';
    }
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.route.paramMap
      .pipe(
        map((params) => params.get('orderId')),
        distinctUntilChanged(),
        switchMap((orderId) => {
          if (!orderId) {
            this.error.set('Order id is missing');
            this.loading.set(false);
            return EMPTY;
          }

          return this.getOrderTrackingUseCase.execute(orderId).pipe(
            catchError((err) => {
              console.error('Tracking load failed:', err);
              this.error.set('Failed to load tracking');
              return EMPTY;
            }),
            finalize(() => this.loading.set(false)),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((vm) => this.tracking.set(vm));
  }
}
