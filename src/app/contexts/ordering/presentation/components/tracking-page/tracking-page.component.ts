import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  catchError,
  distinctUntilChanged,
  EMPTY,
  map,
  switchMap,
  timer,
} from 'rxjs';
import { FornoShellComponent } from '@pages/forno/components/forno-shell/forno-shell.component';
import { OrderConfirmationVm } from '@app/contexts/ordering/application/dto/order-confirmation.vm';
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

type TrackingStatusKey =
  | 'Placed'
  | 'Confirmed'
  | 'Preparing'
  | 'Baking'
  | 'Ready'
  | 'OutForDelivery'
  | 'Delivered';

@Component({
  selector: 'app-tracking-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FornoShellComponent],
  templateUrl: './tracking-page.component.html',
  styleUrl: './tracking-page.component.scss',
})
export class TrackingPageComponent {
  private static readonly STATUS_ORDER: readonly TrackingStatusKey[] = [
    'Placed',
    'Confirmed',
    'Preparing',
    'Baking',
    'Ready',
    'OutForDelivery',
    'Delivered',
  ];

  private static readonly STATUS_THRESHOLDS = new Map<TrackingStatusKey, number>([
    ['Placed', 0],
    ['Confirmed', 0.12],
    ['Preparing', 0.3],
    ['Baking', 0.5],
    ['Ready', 0.72],
    ['OutForDelivery', 0.9],
    ['Delivered', 1],
  ]);

  private static readonly POLL_INTERVAL_MS = 15000;

  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly getOrderTrackingUseCase = inject(GetOrderTrackingUseCase);

  readonly tracking = signal<OrderTrackingVm | null>(null);
  readonly checkoutConfirmation = signal<OrderConfirmationVm | null>(
    this.readCheckoutConfirmation(),
  );
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly now = signal(Date.now());
  readonly displayedTracking = computed(() =>
    this.resolveDisplayedTracking(
      this.tracking(),
      this.checkoutConfirmation(),
      this.now(),
    ),
  );
  readonly hasTracking = computed(() => this.displayedTracking() !== null);
  readonly hasError = computed(() => this.error() !== null);

  readonly currentStep = computed(
    () =>
      this.displayedTracking()?.steps.find((step) => step.state === 'current') ?? null,
  );
  readonly heroTitle = computed(
    () => `Order #${this.displayedTracking()?.orderId ?? ''}`,
  );
  readonly etaValue = computed(
    () => `${this.displayedTracking()?.etaMinutes ?? 0} min`,
  );
  readonly trackingLines = computed<TrackingLineItemVm[]>(() =>
    (this.displayedTracking()?.lines ?? []).map((line) => ({
      id: line.id,
      nameLabel: `${line.name} ×${line.quantity}`,
      subtotalLabel: this.formatLineSubtotal(line.subtotal, line.currency),
    })),
  );
  readonly timelineSteps = computed<TrackingTimelineStepVm[]>(() =>
    (this.displayedTracking()?.steps ?? []).map((step, index, steps) =>
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

  private readCheckoutConfirmation(): OrderConfirmationVm | null {
    const currentState =
      this.router.getCurrentNavigation()?.extras.state?.['confirmation'];
    const historyState = globalThis.history?.state?.confirmation;
    const candidate = currentState ?? historyState;

    if (!candidate || typeof candidate !== 'object') {
      return null;
    }

    return candidate as OrderConfirmationVm;
  }

  private resolveDisplayedTracking(
    tracking: OrderTrackingVm | null,
    confirmation: OrderConfirmationVm | null,
    now: number,
  ): OrderTrackingVm | null {
    if (!tracking) {
      return null;
    }

    const optimisticStatus = this.deriveOptimisticStatus(
      tracking,
      confirmation,
      now,
    );
    const apiIndex = this.findCurrentStatusIndex(tracking);
    const optimisticIndex = this.findStatusIndex(optimisticStatus);

    if (optimisticIndex < 0 || apiIndex <= optimisticIndex) {
      return tracking;
    }

    return this.withDisplayedStatus(tracking, optimisticStatus);
  }

  private deriveOptimisticStatus(
    tracking: OrderTrackingVm,
    confirmation: OrderConfirmationVm | null,
    now: number,
  ): TrackingStatusKey {
    const createdAt = this.resolveTrackingCreatedAt(tracking, confirmation);

    if (Number.isNaN(createdAt)) {
      return confirmation?.status as TrackingStatusKey;
    }

    const totalMinutes = Math.max(tracking.etaMinutes, confirmation?.estimatedMinutes ?? 1);
    const elapsedMinutes = Math.max(0, (now - createdAt) / 60000);
    const progress = Math.min(elapsedMinutes / totalMinutes, 1);

    for (let index = TrackingPageComponent.STATUS_ORDER.length - 1; index >= 0; index -= 1) {
      const status = TrackingPageComponent.STATUS_ORDER[index];
      const threshold = TrackingPageComponent.STATUS_THRESHOLDS.get(status) ?? 1;

      if (progress >= threshold) {
        return status;
      }
    }

    return 'Placed';
  }

  private resolveTrackingCreatedAt(
    tracking: OrderTrackingVm,
    confirmation: OrderConfirmationVm | null,
  ): number {
    const trackingCreatedAt = Date.parse(tracking.createdAt);

    if (!Number.isNaN(trackingCreatedAt)) {
      return trackingCreatedAt;
    }

    return confirmation ? Date.parse(confirmation.createdAt) : Number.NaN;
  }

  private findCurrentStatusIndex(tracking: OrderTrackingVm): number {
    const currentStepKey =
      tracking.steps.find((step) => step.state === 'current')?.key ?? 'Placed';

    return this.findStatusIndex(currentStepKey);
  }

  private findStatusIndex(key: string): number {
    return TrackingPageComponent.STATUS_ORDER.findIndex((status) => status === key);
  }

  private withDisplayedStatus(
    tracking: OrderTrackingVm,
    status: TrackingStatusKey,
  ): OrderTrackingVm {
    const targetIndex = tracking.steps.findIndex((step) => step.key === status);

    if (targetIndex < 0) {
      return tracking;
    }

    const activeStep = tracking.steps[targetIndex];

    return {
      ...tracking,
      statusLabel: activeStep.label,
      statusBody: activeStep.body,
      steps: tracking.steps.map((step, index) => ({
        ...step,
        state:
          index < targetIndex
            ? 'complete'
            : index === targetIndex
              ? 'current'
              : 'upcoming',
      })),
    };
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

          return timer(0, TrackingPageComponent.POLL_INTERVAL_MS).pipe(
            switchMap(() =>
              this.getOrderTrackingUseCase.execute(orderId).pipe(
                catchError((err) => {
                  console.error('Tracking load failed:', err);
                  this.error.set('Failed to load tracking');
                  return EMPTY;
                }),
              ),
            ),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((vm) => {
        this.loading.set(false);
        this.error.set(null);
        this.now.set(Date.now());
        this.tracking.set(vm);
      });
  }
}
