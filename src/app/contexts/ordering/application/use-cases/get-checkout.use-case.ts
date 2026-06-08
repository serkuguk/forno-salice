import { Observable, map } from 'rxjs';
import { CheckoutVm } from '@app/contexts/ordering/application/dto/checkout.vm';
import { GetCartUseCase } from '@app/contexts/cart/application/use-cases/get-cart.use-case';

export class GetCheckoutUseCase {
  constructor(private readonly getCartUseCase: GetCartUseCase) {}

  execute(): Observable<CheckoutVm> {
    return this.getCartUseCase.execute().pipe(
      map((cart) => ({
        cart,
        canSubmit: cart.lines.length > 0,
      })),
    );
  }
}
