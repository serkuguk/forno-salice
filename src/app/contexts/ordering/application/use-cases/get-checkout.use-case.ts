import { Observable, map } from 'rxjs';
import { CheckoutVm } from '../dto/checkout.vm';
import { CartGateway } from '../../domain/ports/cart-gateway.port';
import { CheckoutMapper } from '../mappers/checkout.mapper';

export class GetCheckoutUseCase {
  constructor(private readonly cartGateway: CartGateway) {}

  execute(): Observable<CheckoutVm> {
    return this.cartGateway.getCart().pipe(
      map((snapshot) => CheckoutMapper.toVm(snapshot)),
    );
  }
}
