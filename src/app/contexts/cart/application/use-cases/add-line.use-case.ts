import { map, Observable, switchMap } from "rxjs";
import { CartRepository } from "../../domain/repositories/cart.repository";
import { CartVm } from "../dto/cart.vm";
import { CartMapper } from "../mappers/cart.mapper";
import { AddCartLineDto } from "../dto/add-cart-line.dto";


export class AddLineUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  execute(input: AddCartLineDto): Observable<CartVm> {
    return this.cartRepository.getCart().pipe(
      map((cart) => {
        cart.addLine(CartMapper.toNewLine(input));
        return cart;
      }),
      switchMap((cart) => this.cartRepository.saveCart(cart)),
      map((cart) => CartMapper.toVm(cart)),
    );
  }
}
