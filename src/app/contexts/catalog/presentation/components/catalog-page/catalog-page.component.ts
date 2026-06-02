import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, finalize } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CatalogItemVm } from '@app/contexts/catalog/application/dto/catalog-item.vm';
import { GetCatalogItemsUseCase } from '@app/contexts/catalog/application/use-cases/get-catalog-items.use-case';
import { AddLineUseCase } from '@app/contexts/cart/application/use-cases/add-line.use-case';
import { FornoShellComponent } from '@pages/forno/components/forno-shell/forno-shell.component';

type MenuCategory = 'all' | 'classics' | 'signature';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss',
  imports: [CommonModule, RouterLink, FornoShellComponent],
})
export class CatalogPageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly useCase = inject(GetCatalogItemsUseCase);
  private readonly addLineUseCase = inject(AddLineUseCase);

  readonly items = signal<CatalogItemVm[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly activeCategory = signal<MenuCategory>('all');
  readonly addedItemId = signal<string | null>(null);

  readonly featured = computed(() => {
    const currentItems = this.items();
    return currentItems.find((item) => item.isFeatured) ?? currentItems[0] ?? null;
  });

  readonly filtered = computed(() => {
    const category = this.activeCategory();
    const currentItems = this.items();
    if (category === 'all') {
      return currentItems;
    }
    return currentItems.filter((item) => item.categoryKey === category);
  });

  readonly rest = computed(() => {
    const category = this.activeCategory();
    const currentItems = this.filtered();
    const featured = this.featured();

    if (category !== 'all' || !featured) {
      return currentItems;
    }

    return currentItems.filter((item) => item.id !== featured.id);
  });

  readonly sectionTitle = computed(() => {
    const category = this.activeCategory();
    if (category === 'classics') {
      return 'The classics';
    }
    if (category === 'signature') {
      return 'Signature pies';
    }
    return 'All pizzas';
  });

  readonly count = computed(() => this.rest().length);

  constructor() {
    effect((onCleanup) => {
      const itemId = this.addedItemId();
      if (!itemId) {
        return;
      }

      const timeoutId = window.setTimeout(() => {
        if (this.addedItemId() === itemId) {
          this.addedItemId.set(null);
        }
      }, 1800);

      onCleanup(() => window.clearTimeout(timeoutId));
    });

    this.load();
  }

  setCategory(category: MenuCategory): void {
    this.activeCategory.set(category);
  }

  addToCart(item: CatalogItemVm): void {
    this.addLineUseCase
      .execute({
        lineId: crypto.randomUUID(),
        menuItemId: item.id,
        name: item.title,
        unitPrice: item.priceValue,
        currency: item.currency,
        quantity: 1,
        notes: `${item.description.slice(0, 50)}${item.description.length > 50 ? '...' : ''}`,
        customization: item.category === 'pizza'
          ? {
              size: 'medium',
              dough: 'classic',
              extraToppings: [],
            }
          : null,
      })
      .pipe(
        catchError((err) => {
          console.error('Add to cart failed:', err);
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.addedItemId.set(item.id));
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.useCase.execute()
      .pipe(
        catchError((err) => {
          console.error('Catalog load failed:', err);
          this.error.set('Failed to load catalog');
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((items) => this.items.set(items));
  }
}
