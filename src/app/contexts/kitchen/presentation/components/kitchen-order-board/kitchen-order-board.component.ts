import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  KitchenBoardColumnVm,
  KitchenOrderBoardVm,
  KitchenStationSummaryVm,
  KitchenTimerState,
} from '@app/contexts/kitchen/application/dto/kitchen-order-board.vm';
import { AdvanceKitchenOrderStatusUseCase } from '@app/contexts/kitchen/application/use-cases/advance-kitchen-order-status.use-case';
import { GetKitchenOrderBoardUseCase } from '@app/contexts/kitchen/application/use-cases/get-kitchen-order-board.use-case';
import { OrderStatusValue } from '@app/contexts/ordering/domain/value-objects/order-status';
import { EMPTY, catchError, finalize, interval } from 'rxjs';

@Component({
  selector: 'app-kitchen-order-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kitchen-order-board.component.html',
  styleUrl: './kitchen-order-board.component.scss',
})
export class KitchenOrderBoardComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly getKitchenOrderBoardUseCase = inject(GetKitchenOrderBoardUseCase);
  private readonly advanceKitchenOrderStatusUseCase = inject(
    AdvanceKitchenOrderStatusUseCase,
  );

  readonly board = signal<KitchenOrderBoardVm | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly advancingOrderId = signal<string | null>(null);
  readonly now = signal(new Date());

  readonly columns = computed<KitchenBoardColumnVm[]>(
    () => this.board()?.columns ?? [],
  );
  readonly stationSummary = computed<KitchenStationSummaryVm[]>(
    () => this.board()?.stationSummary ?? [],
  );
  readonly hasOrders = computed(() =>
    this.columns().some((column) => column.orders.length > 0),
  );
  readonly activeOrders = computed(() => this.board()?.activeOrders ?? 0);
  readonly clockLabel = computed(() =>
    new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(this.now()),
  );
  readonly dateLabel = computed(() =>
    new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
    }).format(this.now()),
  );

  constructor() {
    this.load();
    this.startClock();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.getKitchenOrderBoardUseCase
      .execute()
      .pipe(
        catchError((err) => {
          console.error('Kitchen board load failed:', err);
          this.error.set('Failed to load kitchen board');
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((vm) => this.board.set(vm));
  }

  advance(orderId: string, currentStatus: string): void {
    this.advancingOrderId.set(orderId);
    this.error.set(null);

    this.advanceKitchenOrderStatusUseCase
      .execute(orderId, currentStatus as OrderStatusValue)
      .pipe(
        catchError((err) => {
          console.error('Kitchen order advance failed:', err);
          this.error.set('Failed to advance order status');
          return EMPTY;
        }),
        finalize(() => this.advancingOrderId.set(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.load());
  }

  isAdvancing(orderId: string): boolean {
    return this.advancingOrderId() === orderId;
  }

  trackById(_: number, order: { id: string }): string {
    return order.id;
  }

  timerClass(state: KitchenTimerState): string {
    return `kitchen-card__timer--${state}`;
  }

  private startClock(): void {
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.now.set(new Date()));
  }
}
