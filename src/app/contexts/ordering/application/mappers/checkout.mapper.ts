import { Money } from '@app/core/shared-kernel/value-objects/money/money.value-object';
import { CartSnapshot } from '../../domain/ports/cart-gateway.port';
import { Fulfillment } from '../../domain/value-objects/fulfillment';
import { CheckoutVm } from '../dto/checkout.vm';

export class CheckoutMapper {
  static toVm(snapshot: CartSnapshot): CheckoutVm {
    const currency = snapshot.currency || 'EUR';

    const lines = snapshot.lines.map((line) => ({
      id: line.id,
      name: line.name,
      quantity: line.quantity,
      subtotal: Money.create(line.unitPrice, line.currency).multiply(line.quantity).amount,
    }));

    const subtotal = snapshot.lines.reduce(
      (acc, line) => acc.add(Money.create(line.unitPrice, line.currency).multiply(line.quantity)),
      Money.create(0, currency),
    );

    return {
      lines,
      subtotal: subtotal.amount,
      deliveryFee: Fulfillment.feeFor('delivery', currency).amount,
      currency,
      canSubmit: snapshot.lines.length > 0,
    };
  }
}
