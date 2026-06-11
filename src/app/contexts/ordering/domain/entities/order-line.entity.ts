import { EntityId } from '@app/core/shared-kernel/types/entity-id/entity-id';
import { Money } from '@app/core/shared-kernel/value-objects/money/money.value-object';

export class OrderLine {
  constructor(
    public readonly id: EntityId,
    public readonly name: string,
    public readonly unitPrice: Money,
    public readonly quantity: number,
  ) {
    if (quantity <= 0) {
      throw new Error('OrderLine quantity must be > 0');
    }
  }

  subtotal(): Money {
    return this.unitPrice.multiply(this.quantity);
  }
}
