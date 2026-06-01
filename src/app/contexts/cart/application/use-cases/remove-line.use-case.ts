import { map, switchMap } from "rxjs";
import { CartRepository } from "../../domain/repositories/cart.repository";
import { EntityId } from "@app/core/shared-kernel/types/entity-id/entity-id";
import { CartMapper } from "../mappers/cart.mapper";
import { RemoveCartLineDto } from "../dto/remove-cart-line.dto";

export class RemoveLineUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  execute(input: RemoveCartLineDto) {
    return this.cartRepository.getCart().pipe(
      map((cart) => {
        cart.removeLine(EntityId.create(input.lineId));
        return cart;
      }),
      switchMap((cart) => this.cartRepository.saveCart(cart)),
      map((cart) => CartMapper.toVm(cart)),
    );
  }
}
