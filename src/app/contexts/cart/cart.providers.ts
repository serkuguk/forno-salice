import { Provider } from '@angular/core';
import { CartRepository } from './domain/repositories/cart.repository';
import { HttpCartRepository } from './infrastructure/repositories/http-cart.repository';
import { AddLineUseCase } from './application/use-cases/add-line.use-case';
import { GetCartUseCase } from './application/use-cases/get-cart.use-case';
import { RemoveLineUseCase } from './application/use-cases/remove-line.use-case';
import { UpdateLineQuantityUseCase } from './application/use-cases/update-line-quantity.use-case';
import { ClearCartUseCase } from './application/use-cases/clear-cart.use-case';

/**
 * Связывает доменную абстракцию CartRepository с её repositories-реализацией
 * и публикует use-cases как DI-токены через factory, сохраняя application-слой
 * свободным от Angular-зависимостей.
 */
export const CART_PROVIDERS: Provider[] = [
  { provide: CartRepository, useClass: HttpCartRepository },
  {
    provide: AddLineUseCase,
    useFactory: (repository: CartRepository) => new AddLineUseCase(repository),
    deps: [CartRepository],
  },
  {
    provide: GetCartUseCase,
    useFactory: (repository: CartRepository) => new GetCartUseCase(repository),
    deps: [CartRepository],
  },
  {
    provide: RemoveLineUseCase,
    useFactory: (repository: CartRepository) => new RemoveLineUseCase(repository),
    deps: [CartRepository],
  },
  {
    provide: UpdateLineQuantityUseCase,
    useFactory: (repository: CartRepository) => new UpdateLineQuantityUseCase(repository),
    deps: [CartRepository],
  },
  {
    provide: ClearCartUseCase,
    useFactory: (repository: CartRepository) => new ClearCartUseCase(repository),
    deps: [CartRepository],
  },
];
