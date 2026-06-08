import { Provider } from '@angular/core';
import { GetCartUseCase } from '@app/contexts/cart/application/use-cases/get-cart.use-case';
import { GetCheckoutUseCase } from './application/use-cases/get-checkout.use-case';


export const ORDERING_PROVIDERS: Provider[] = [
  {
    provide: GetCheckoutUseCase,
    useFactory: (getCartUseCase: GetCartUseCase) => new GetCheckoutUseCase(getCartUseCase),
    deps: [GetCartUseCase],
  }
];
