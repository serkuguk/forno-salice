import { DomainError } from '@app/core/shared-kernel/errors/domain-error/domain-error';
import { Money } from '@app/core/shared-kernel/value-objects/money/money.value-object';
import { OrderLine } from './order-line.entity';
import { OrderStatus } from '../value-objects/order-status';
import { Fulfillment } from '../value-objects/fulfillment';
import { CustomerContact } from '../value-objects/customer-contact';

export interface OrderDraftProps {
  contact: CustomerContact;
  fulfillment: Fulfillment;
  lines: OrderLine[];
}

/**
 * Order aggregate root. На этапе checkout создаётся через draft() в статусе
 * Placed. Номер заказа генерируется backend-ом при подтверждении (spec rule 6),
 * поэтому в draft id отсутствует. Инвариант rule 3: нельзя оформить пустую
 * корзину.
 */
export class Order {
  private constructor(
    public readonly contact: CustomerContact,
    public readonly fulfillment: Fulfillment,
    private readonly _lines: OrderLine[],
    private readonly _status: OrderStatus,
  ) {}

  static draft(props: OrderDraftProps): Order {
    if (props.lines.length === 0) {
      throw new DomainError('ORDERING_EMPTY_CART', 'Cannot place an order with no items');
    }
    return new Order(props.contact, props.fulfillment, [...props.lines], OrderStatus.placed());
  }

  get lines(): ReadonlyArray<OrderLine> {
    return this._lines;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get currency(): string {
    return this._lines[0].unitPrice.currency;
  }

  itemsCount(): number {
    return this._lines.reduce((count, line) => count + line.quantity, 0);
  }

  subtotal(): Money {
    return this._lines.reduce(
      (acc, line) => acc.add(line.subtotal()),
      Money.create(0, this.currency),
    );
  }

  deliveryFee(): Money {
    return this.fulfillment.fee(this.currency);
  }

  total(): Money {
    return this.subtotal().add(this.deliveryFee());
  }
}
