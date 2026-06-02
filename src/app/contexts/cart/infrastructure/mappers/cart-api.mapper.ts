import { EntityId } from '@core/shared-kernel/types/entity-id/entity-id';
import { Money } from '@core/shared-kernel/value-objects/money/money.value-object';
import { Cart } from '../../domain/entities/cart.entity';
import { CartLine } from '../../domain/entities/cart-line.entity';
import { CartApiLineDto, CartApiResponseDto } from '../api/cart-api.dto';
import { normalizeCartLineCustomization } from '../../domain/value-objects/cart-line-customization';

export class CartApiMapper {

  static toDomain(dto: CartApiResponseDto): Cart {
    const cart = new Cart(EntityId.create(dto.id));

    dto.lines.forEach((lineDto) => {
      cart.addLine(this.toDomainLine(lineDto, dto.currency));
    });

    return cart;
  }

  static toApi(cart: Cart): CartApiResponseDto {
    const cartCurrency = cart.lines[0]?.unitPrice.currency ?? 'EUR';

    return {
      id: cart.id.value,
      currency: cartCurrency,
      lines: cart.lines.map((line) => ({
        id: line.id.value,
        menuItemId: line.menuItemId.value,
        name: line.name,
        unitPrice: line.unitPrice.amount,
        currency: line.unitPrice.currency,
        quantity: line.quantity,
        notes: line.notes,
        customization: normalizeCartLineCustomization(line.customization),
      })),
    };
  }

  private static toDomainLine(dto: CartApiLineDto, currency: string): CartLine {
    return new CartLine(
      EntityId.create(dto.id),
      EntityId.create(dto.menuItemId),
      dto.name,
      Money.create(dto.unitPrice, dto.currency ?? currency),
      dto.quantity,
      dto.notes ?? null,
      normalizeCartLineCustomization(dto.customization),
    );
  }
}
