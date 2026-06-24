import { Observable } from 'rxjs';

/**
 * Read-model корзины на языке Ordering context. Это anti-corruption boundary:
 * Ordering не знает о CartVm/CartLine из Cart context — только об этом снимке.
 */
export interface CartSnapshotLine {
  id: string;
  name: string;
  unitPrice: number;
  currency: string;
  quantity: number;
}

export interface CartSnapshot {
  id: string;
  currency: string;
  lines: CartSnapshotLine[];
}

/**
 * Порт (ACL) для чтения и очистки корзины. Реализация в repositories
 * транслирует Cart context в термины Ordering, инвертируя зависимость.
 */
export abstract class CartGateway {
  abstract getCart(): Observable<CartSnapshot>;
  abstract clearCart(): Observable<void>;
}
