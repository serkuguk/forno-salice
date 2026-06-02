import { map, switchMap } from 'rxjs';
import { CartRepository } from '../../domain/repositories/cart.repository';
import { UpdateCartLineDto } from '../dto/update-cart-line.dto';
import { EntityId } from '@app/core/shared-kernel/types/entity-id/entity-id';
import { CartMapper } from '../mappers/cart.mapper';

export class UpdateLineQuantityUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  execute(input: UpdateCartLineDto) {
    return this.cartRepository.getCart().pipe(
      map((cart) => {
        cart.updateLineQuantity(EntityId.create(input.lineId), input.quantity);
        return cart;
      }),
      switchMap((cart) => this.cartRepository.saveCart(cart)),
      map((cart) => CartMapper.toVm(cart)),
    );
  }
}
