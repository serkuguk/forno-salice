import { Order } from '../../domain/entities/order.entity';
import { OrderStatusValue } from '../../domain/value-objects/order-status';
import { PlacedOrder } from '../../domain/repositories/order.repository';
import { PlaceOrderRequestDto, PlaceOrderResponseDto } from '../api/order-api.dto';

export class OrderApiMapper {
  static toApi(order: Order): PlaceOrderRequestDto {
    const address = order.fulfillment.address;

    return {
      customer: {
        name: order.contact.name,
        email: order.contact.email,
        phone: order.contact.phone.value,
      },
      fulfillment: {
        mode: order.fulfillment.mode,
      },
      deliveryAddress: address
        ? { street: address.street, city: address.city, postalCode: address.postalCode }
        : null,
      lines: order.lines.map((line) => ({
        id: line.id.value,
        name: line.name,
        unitPrice: line.unitPrice.amount,
        currency: line.unitPrice.currency,
        quantity: line.quantity,
        subtotal: line.subtotal().amount,
      })),
      total: order.total().amount,
      currency: order.currency,
    };
  }

  static toPlacedOrder(dto: PlaceOrderResponseDto): PlacedOrder {
    return {
      orderId: dto.orderId,
      status: dto.status as OrderStatusValue,
      estimatedMinutes: dto.estimatedMinutes,
      createdAt: dto.createdAt,
    };
  }
}
