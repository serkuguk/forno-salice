import { KitchenOrder } from '@app/contexts/kitchen/domain/repositories/kitchen.repository';
import { OrderStatusValue } from '@app/contexts/ordering/domain/value-objects/order-status';
import {
  AdvanceKitchenOrderStatusRequestDto,
  KitchenOrderResponseDto,
} from '@app/contexts/kitchen/infrastructure/api/kitchen-api.dto';

export class KitchenApiMapper {
  static toDomain(dto: KitchenOrderResponseDto): KitchenOrder {
    return {
      orderId: dto.orderId,
      status: dto.status as OrderStatusValue,
      createdAt: dto.createdAt,
      estimatedMinutes: dto.estimatedMinutes,
      fulfillmentMode: dto.fulfillment.mode,
      lines: dto.lines.map((line) => ({
        id: line.id,
        name: line.name,
        quantity: line.quantity,
      })),
    };
  }

  static toAdvanceStatusRequest(
    nextStatus: OrderStatusValue,
  ): AdvanceKitchenOrderStatusRequestDto {
    return {
      status: nextStatus,
    };
  }
}
