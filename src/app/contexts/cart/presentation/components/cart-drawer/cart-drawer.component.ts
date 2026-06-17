import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, finalize } from 'rxjs';
import { CartVm } from '@app/contexts/cart/application/dto/cart.vm';
import { GetCartUseCase } from '@app/contexts/cart/application/use-cases/get-cart.use-case';
import { RemoveLineUseCase } from '@app/contexts/cart/application/use-cases/remove-line.use-case';
import { UpdateLineQuantityUseCase } from '@app/contexts/cart/application/use-cases/update-line-quantity.use-case';
import { CartDrawerService } from '../../services/cart-drawer.service';
import { Router } from '@angular/router';

interface CartDrawerLineVm {
  readonly id: string;
  readonly name: string;
  readonly quantity: number;
  readonly notesLabel: string | null;
  readonly customizationLabel: string | null;
  readonly subtotalLabel: string;
}

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartDrawerComponent {
  private readonly destroyRef = inject(DestroyRef);
  readonly drawerService = inject(CartDrawerService);
  private readonly getCartUseCase = inject(GetCartUseCase);
  private readonly removeLineUseCase = inject(RemoveLineUseCase);
  private readonly updateLineQuantityUseCase = inject(UpdateLineQuantityUseCase);
  private readonly router = inject(Router);

  readonly cart = signal<CartVm | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly hasCart = computed(() => this.cart() !== null);
  readonly hasError = computed(() => this.error() !== null);

  readonly isEmpty = computed(() => {
    const c = this.cart();
    return !c || c.lines.length === 0;
  });

  readonly subtotal = computed(() => this.cart()?.totalAmount ?? 0);
  readonly delivery = 2.5;
  readonly total = computed(() => this.subtotal() + this.delivery);
  readonly itemCountLabel = computed(() => {
    const totalItems = this.cart()?.lines.length ?? 0;

    if (totalItems === 0) {
      return 'Your order';
    }

    return `${totalItems} item${totalItems === 1 ? '' : 's'}`;
  });
  readonly cartLines = computed<CartDrawerLineVm[]>(() =>
    (this.cart()?.lines ?? []).map((line) => ({
      id: line.id,
      name: line.name,
      quantity: line.quantity,
      notesLabel: line.notes,
      customizationLabel: this.buildCustomizationLabel(line),
      subtotalLabel: this.formatMoney(line.subtotal, line.currency),
    })),
  );
  readonly formattedSubtotal = computed(() =>
    this.formatMoney(this.subtotal(), this.cart()?.currency ?? ''),
  );
  readonly formattedDelivery = computed(() =>
    this.formatMoney(this.delivery, this.cart()?.currency ?? ''),
  );
  readonly formattedTotal = computed(() =>
    this.formatMoney(this.total(), this.cart()?.currency ?? ''),
  );
  readonly showFooter = computed(() => !this.isEmpty() && !this.loading());

  constructor() {
    effect(() => {
      if (this.drawerService.isOpen()) {
        this.load();
      }
    });
  }

  close(): void {
    this.drawerService.close();
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
    .subscribe((cart) => {
      this.cart.set(cart);
      this.drawerService.setCount(cart.totalItems);
    });
  }

  goToCheckout(): void {
    this.drawerService.close();
    this.router.navigate(['/checkout']);
  }

  private buildCustomizationLabel(line: CartVm['lines'][number]): string | null {
    const parts = [
      line.customization.size,
      line.customization.dough,
      ...line.customization.extraToppings,
    ].filter((value): value is string => Boolean(value));

    return parts.length > 0 ? parts.join(' · ') : null;
  }

  private formatMoney(amount: number, currency: string): string {
    return `${amount.toFixed(2)} ${currency}`.trim();
  }
}
