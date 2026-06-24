import {Component, computed, DestroyRef, inject, signal} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {FornoShellComponent} from "@pages/forno/components/forno-shell/forno-shell.component";
import {GetOrderHistoryUseCase} from "@app/contexts/customer/application/use-cases/get-order-history.use-case";
import {OrderHistoryVm} from "@app/contexts/customer/application/dto/order-history.vm";
import {catchError, EMPTY, finalize} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";


@Component({
  selector: 'app-order-history-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FornoShellComponent],
  templateUrl: './order-history-page.component.html',
  styleUrl: './order-history-page.component.scss',
})
export class OrderHistoryPageComponent {

  private readonly destroyRef = inject(DestroyRef);
  private readonly getOrderHistoryUseCase = inject(GetOrderHistoryUseCase);

  readonly history = signal<OrderHistoryVm  | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly hasHistory = computed(() => this.history() !== null);
  readonly hasItems = computed(() => (this.history()?.items.length ?? 0) > 0);
  readonly hasError = computed(() => this.error() !== null);

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.getOrderHistoryUseCase
      .execute()
      .pipe(
        catchError((err) => {
          console.error('Order history load failed:', err);
          this.error.set('Failed to load order history');
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((vm) => this.history.set(vm));
  }
}
