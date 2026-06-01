import { map, Observable } from "rxjs";
import { CartRepository } from "../../domain/repositories/cart.repository";
import { CartMapper } from "../mappers/cart.mapper";
import { CartVm } from "../dto/cart.vm";


export class GetCartUseCase {

  constructor(private readonly repository: CartRepository) {}

  execute(): Observable<CartVm> {
    return this.repository.getCart().pipe(
      map((cart) => CartMapper.toVm(cart))
    );
  }
}
