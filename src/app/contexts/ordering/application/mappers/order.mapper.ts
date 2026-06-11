import { EntityId } from '@app/core/shared-kernel/types/entity-id/entity-id';
import { Money } from '@app/core/shared-kernel/value-objects/money/money.value-object';
import { Order } from '../../domain/entities/order.entity';
import { OrderLine } from '../../domain/entities/order-line.entity';
import { Address } from '../../domain/value-objects/address';
import { CustomerContact } from '../../domain/value-objects/customer-contact';
import { Fulfillment } from '../../domain/value-objects/fulfillment';
import { CartSnapshot } from '../../domain/ports/cart-gateway.port';
import { PlacedOrder } from '../../domain/repositories/order.repository';
import { PlaceOrderDto } from '../dto/place-order.dto';
import { OrderConfirmationVm } from '../dto/order-confirmation.vm';

export class OrderMapper {
  static toOrder(dto: PlaceOrderDto, snapshot: CartSnapshot): Order {
    const contact = CustomerContact.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
    });

    const address = dto.address ? Address.create(dto.address) : null;
    const fulfillment = Fulfillment.create(dto.mode, address);

    const lines = snapshot.lines.map(
      (line) =>
        new OrderLine(
          EntityId.create(line.id),
          line.name,
          Money.create(line.unitPrice, line.currency),
          line.quantity,
        ),
    );

    return Order.draft({ contact, fulfillment, lines });
  }

  static toConfirmationVm(placed: PlacedOrder, order: Order): OrderConfirmationVm {
    const total = order.total();

    return {
      orderId: placed.orderId,
      status: placed.status,
      estimatedMinutes: placed.estimatedMinutes,
      createdAt: placed.createdAt,
      total: total.amount,
      currency: total.currency,
    };
  }
}
