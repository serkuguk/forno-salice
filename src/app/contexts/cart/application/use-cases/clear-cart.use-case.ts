import { map, switchMap } from "rxjs";
import { CartRepository } from "../../domain/repositories/cart.repository";
import { CartMapper } from "../mappers/cart.mapper";

export class ClearCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  execute() {
    return this.cartRepository.getCart().pipe(
      map((cart) => {
        cart.clear();
        return cart;
      }),
      switchMap((cart) => this.cartRepository.saveCart(cart)),
      map((cart) => CartMapper.toVm(cart)),
    );
  }
}
