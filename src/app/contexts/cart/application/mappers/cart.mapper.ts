import { Cart } from "@app/contexts/cart/domain/entities/cart.entity";
import { CartVm } from "../dto/cart.vm";
import { Money } from "@app/core/shared-kernel/value-objects/money/money.value-object";
import { EntityId } from "@app/core/shared-kernel/types/entity-id/entity-id";
import { CartLine } from "@app/contexts/cart/domain/entities/cart-line.entity";
import { AddCartLineDto } from "../dto/add-cart-line.dto";
import { CartLineVm } from "../dto/cart-line.vm";
import { normalizeCartLineCustomization } from "../../domain/value-objects/cart-line-customization";


export class CartMapper {
  static toVm(cart: Cart): CartVm {
    const lines = cart.lines.map((line) => this.toLineVm(line));
    const total = cart.totalAmount();

    return {
      id: cart.id.value,
      lines,
      totalItems: cart.totalItems(),
      totalAmount: total.amount,
      currency: total.currency,
    };
  }

  static toNewLine(dto: AddCartLineDto): CartLine {
    return new CartLine(
      EntityId.create(dto.lineId),
      EntityId.create(dto.menuItemId),
      dto.name,
      Money.create(dto.unitPrice, dto.currency),
      dto.quantity,
      dto.notes ?? null,
      normalizeCartLineCustomization(dto.customization),
    );
  }

  private static toLineVm(line: CartLine): CartLineVm {
    const subtotal = line.subtotal();

    return {
      id: line.id.value,
      menuItemId: line.menuItemId.value,
      name: line.name,
      unitPrice: line.unitPrice.amount,
      currency: line.unitPrice.currency,
      quantity: line.quantity,
      notes: line.notes,
      customization: normalizeCartLineCustomization(line.customization),
      subtotal: subtotal.amount,
    };
  }
}
