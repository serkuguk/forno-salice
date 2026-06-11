import { DomainError } from '@app/core/shared-kernel/errors/domain-error/domain-error';

export type OrderStatusValue =
  | 'Placed'
  | 'Confirmed'
  | 'Preparing'
  | 'Baking'
  | 'Ready'
  | 'OutForDelivery'
  | 'Delivered'
  | 'Cancelled';

/**
 * Жизненный этап заказа (spec §12). Таблица переходов кодирует доменные
 * правила: нельзя вернуть Ready→Placed (rule 4) и нельзя отменить после
 * начала приготовления (rule 5). MVP checkout создаёт только Placed;
 * сами переходы — задел под Kitchen context (Phase 3).
 */
const TRANSITIONS: Record<OrderStatusValue, ReadonlyArray<OrderStatusValue>> = {
  Placed: ['Confirmed', 'Cancelled'],
  Confirmed: ['Preparing', 'Cancelled'],
  Preparing: ['Baking'],
  Baking: ['Ready'],
  Ready: ['OutForDelivery'],
  OutForDelivery: ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

export class OrderStatus {
  private constructor(public readonly value: OrderStatusValue) {}

  static placed(): OrderStatus {
    return new OrderStatus('Placed');
  }

  static create(value: OrderStatusValue): OrderStatus {
    if (!(value in TRANSITIONS)) {
      throw new DomainError('ORDERING_INVALID_STATUS', `Unknown order status: ${value}`);
    }
    return new OrderStatus(value);
  }

  canTransitionTo(next: OrderStatusValue): boolean {
    return TRANSITIONS[this.value].includes(next);
  }

  transitionTo(next: OrderStatusValue): OrderStatus {
    if (!this.canTransitionTo(next)) {
      throw new DomainError(
        'ORDERING_ILLEGAL_TRANSITION',
        `Cannot move order from ${this.value} to ${next}`,
      );
    }
    return OrderStatus.create(next);
  }

  equals(other: OrderStatus): boolean {
    return this.value === other.value;
  }
}
