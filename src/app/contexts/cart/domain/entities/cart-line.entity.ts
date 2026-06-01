import { EntityId } from "@app/core/shared-kernel/types/entity-id/entity-id";
import { Money } from "@app/core/shared-kernel/value-objects/money/money.value-object";


export class CartLine {
  constructor(
    public readonly id: EntityId,
    public readonly menuItemId: EntityId,
    public readonly name: string,
    public readonly unitPrice: Money,
    private _quantity: number,
    public readonly notes: string | null = null
  ) {
    if (_quantity <= 0) throw new Error("Quantity must be > 0");
  }

  get quantity(): number {
    return this._quantity;
  }

  changeQuantity(quantity: number): void {
    if (quantity <= 0) throw new Error("Quantity must be > 0");
    this._quantity = quantity;
  }

  subtotal(): Money {
    return this.unitPrice.multiply(this._quantity);
  }

  sameConfiguration(other: CartLine): boolean {
    return this.menuItemId.equals(other.menuItemId) && this.notes === other.notes;
  }

  increase(by: number): void {
    if (by <= 0) throw new Error('Increase value must be > 0');
    this._quantity += by;
  }

}
