import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, finalize } from 'rxjs';
import { FornoShellComponent } from '@pages/forno/components/forno-shell/forno-shell.component';
import { GetKitchenOrderBoardUseCase } from '@app/contexts/kitchen/application/use-cases/get-kitchen-order-board.use-case';
import { AdvanceKitchenOrderStatusUseCase } from '@app/contexts/kitchen/application/use-cases/advance-kitchen-order-status.use-case';
import {
  KitchenBoardColumnVm,
  KitchenOrderBoardVm,
} from '@app/contexts/kitchen/application/dto/kitchen-order-board.vm';
import { OrderStatusValue } from '@app/contexts/ordering/domain/value-objects/order-status';

@Component({
  selector: 'app-kitchen-order-board',
  standalone: true,
  imports: [CommonModule, FornoShellComponent],
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

  readonly columns = computed<KitchenBoardColumnVm[]>(
    () => this.board()?.columns ?? [],
  );
  readonly hasOrders = computed(() =>
    this.columns().some((column) => column.orders.length > 0),
  );

  constructor() {
    this.load();
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
}
