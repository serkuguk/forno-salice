import { EntityId } from '@core/shared-kernel/types/entity-id/entity-id';
import { Money } from '@core/shared-kernel/value-objects/money/money.value-object';
import { Cart } from '../../domain/entities/cart.entity';
import { CartLine } from '../../domain/entities/cart-line.entity';
import { CartApiLineDto, CartApiResponseDto } from '../api/cart-api.dto';

export class CartApiMapper {

  static toDomain(dto: CartApiResponseDto): Cart {
    const cart = new Cart(EntityId.create(dto.id));

    dto.lines.forEach((lineDto) => {
      cart.addLine(this.toDomainLine(lineDto));
    });

    return cart;
  }

  static toApi(cart: Cart): CartApiResponseDto {
    return {
      id: cart.id.value,
      lines: cart.lines.map((line) => ({
        id: line.id.value,
        menuItemId: line.menuItemId.value,
        name: line.name,
        unitPrice: line.unitPrice.amount,
        currency: line.unitPrice.currency,
        quantity: line.quantity,
        notes: line.notes,
      })),
    };
  }

  private static toDomainLine(dto: CartApiLineDto): CartLine {
    return new CartLine(
      EntityId.create(dto.id),
      EntityId.create(dto.menuItemId),
      dto.name,
      Money.create(dto.unitPrice, dto.currency),
      dto.quantity,
      dto.notes ?? null,
    );
  }
}
