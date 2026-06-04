import { map, Observable, switchMap } from "rxjs";
import { CartRepository } from "../../domain/repositories/cart.repository";
import { CartVm } from "../dto/cart.vm";
import { CartMapper } from "../mappers/cart.mapper";
import { AddCartLineDto } from "../dto/add-cart-line.dto";


export class AddLineUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  execute(input: AddCartLineDto): Observable<CartVm> {
    return this.cartRepository.addLine(input).pipe(
      switchMap(() => this.cartRepository.getCart()),
      map((cart) => CartMapper.toVm(cart)),
    );
  }
}
