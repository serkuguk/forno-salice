import { EntityId } from "@app/core/shared-kernel/types/entity-id/entity-id";
import { CartLine } from "./cart-line.entity";
import { Money } from "@app/core/shared-kernel/value-objects/money/money.value-object";

export class Cart {
  private _lines: CartLine[] = [];

  constructor(public readonly id: EntityId) {}

  get lines(): ReadonlyArray<CartLine> {
    return this._lines;
  }

  addLine(newLine: CartLine): void {
    const existing = this._lines.find((l) => l.sameConfiguration(newLine));
    if (existing) {
      existing.increase(newLine.quantity);
      return;
    } else {
      this._lines = [...this._lines, newLine];
    }
  }

  updateLineQuantity(lineId: EntityId, quantity: number): void {
    const line = this._lines.find((l) => l.id.equals(lineId));
    if (!line) throw new Error('CartLine not found');

    if (quantity <= 0) {
      this.removeLine(lineId);
      return;
    }

    line.changeQuantity(quantity);
  }

  removeLine(lineId: EntityId): void {
    this._lines = this._lines.filter((l) => !l.id.equals(lineId)); // Assuming EntityId has an equals method
  }

  totalItems(): number {
    return this._lines.reduce((total, line) => total + line.quantity, 0);
  }

  totalAmount(): Money {
    if (this._lines.length === 0) {
      return Money.create(0, 'EUR');
    }

    const currency = this._lines[0].unitPrice.currency;

    return this._lines.reduce(
      (acc, line) => acc.add(line.subtotal()),
      Money.create(0, currency),
    );
  }

  isEmpty(): boolean {
    return this._lines.length === 0;
  }

  clear(): void {
    this._lines = [];
  }
}
