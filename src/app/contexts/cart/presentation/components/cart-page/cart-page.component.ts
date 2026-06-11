import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, EMPTY, finalize } from 'rxjs';
import { CartVm } from '@app/contexts/cart/application/dto/cart.vm';
import { GetCartUseCase } from '@app/contexts/cart/application/use-cases/get-cart.use-case';
import { RemoveLineUseCase } from '@app/contexts/cart/application/use-cases/remove-line.use-case';
import { UpdateLineQuantityUseCase } from '@app/contexts/cart/application/use-cases/update-line-quantity.use-case';
import { FornoShellComponent } from '@pages/forno/components/forno-shell/forno-shell.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
  imports: [CommonModule, RouterLink, FornoShellComponent],
})
export class CartPageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly getCartUseCase = inject(GetCartUseCase);
  private readonly removeLineUseCase = inject(RemoveLineUseCase);
  private readonly updateLineQuantityUseCase = inject(UpdateLineQuantityUseCase);

  readonly cart = signal<CartVm | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly isEmpty = computed(() => {
    const current = this.cart();
    return !current || current.lines.length === 0;
  });

  constructor() {
    this.load();
  }

  removeLine(lineId: string): void {
    this.removeLineUseCase
      .execute({ lineId })
      .pipe(
        catchError((err) => {
          console.error('Remove cart line failed:', err);
          this.error.set('Failed to remove item');
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((cart) => this.cart.set(cart));
  }

  updateLineQuantity(lineId: string, quantity: number): void {
    this.updateLineQuantityUseCase
      .execute({ lineId, quantity })
      .pipe(
        catchError((err) => {
          console.error('Update cart line quantity failed:', err);
          this.error.set('Failed to update quantity');
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((cart) => this.cart.set(cart));
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.getCartUseCase
      .execute()
      .pipe(
        catchError((err) => {
          console.error('Cart load failed:', err);
          this.error.set('Failed to load cart');
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((cart) => this.cart.set(cart));
  }
}
