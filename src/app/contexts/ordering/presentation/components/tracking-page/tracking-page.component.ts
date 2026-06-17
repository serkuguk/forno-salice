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
import {
  OrderTrackingStepVm,
  OrderTrackingVm,
} from '@app/contexts/ordering/application/dto/order-tracking.vm';

interface TrackingTimelineStepVm {
  readonly key: string;
  readonly label: string;
  readonly bodyText: string | null;
  readonly isUpcoming: boolean;
  readonly isComplete: boolean;
  readonly isCurrent: boolean;
  readonly showCheckIcon: boolean;
  readonly showConnector: boolean;
  readonly connectorComplete: boolean;
}

interface TrackingLineItemVm {
  readonly id: string;
  readonly nameLabel: string;
  readonly subtotalLabel: string;
}

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
  readonly hasTracking = computed(() => this.tracking() !== null);
  readonly hasError = computed(() => this.error() !== null);

  readonly currentStep = computed(
    () =>
      this.tracking()?.steps.find((step) => step.state === 'current') ?? null,
  );
  readonly heroTitle = computed(() => `Order #${this.tracking()?.orderId ?? ''}`);
  readonly etaValue = computed(() => `${this.tracking()?.etaMinutes ?? 0} min`);
  readonly trackingLines = computed<TrackingLineItemVm[]>(() =>
    (this.tracking()?.lines ?? []).map((line) => ({
      id: line.id,
      nameLabel: `${line.name} ×${line.quantity}`,
      subtotalLabel: this.formatLineSubtotal(line.subtotal, line.currency),
    })),
  );
  readonly timelineSteps = computed<TrackingTimelineStepVm[]>(() =>
    (this.tracking()?.steps ?? []).map((step, index, steps) =>
      this.buildTimelineStepVm(step, index, steps.length),
    ),
  );
  readonly statusIcon = computed(() => this.resolveStatusIcon(this.currentStep()?.key));

  constructor() {
    this.load();
  }

  private resolveStatusIcon(key?: string): string {
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

  private buildTimelineStepVm(
    step: OrderTrackingStepVm,
    index: number,
    totalSteps: number,
  ): TrackingTimelineStepVm {
    const isComplete = step.state === 'complete';
    const isCurrent = step.state === 'current';
    const isUpcoming = step.state === 'upcoming';

    return {
      key: step.key,
      label: step.label,
      bodyText: isCurrent ? step.body : isComplete ? 'Complete' : null,
      isUpcoming,
      isComplete,
      isCurrent,
      showCheckIcon: isComplete,
      showConnector: index < totalSteps - 1,
      connectorComplete: isComplete,
    };
  }

  private formatLineSubtotal(subtotal: number, currency: string): string {
    return `${subtotal.toFixed(2)} ${currency}`;
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
