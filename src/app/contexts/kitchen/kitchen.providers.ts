import { Provider } from '@angular/core';
import { KitchenRepository } from '@app/contexts/kitchen/domain/repositories/kitchen.repository';
import { HttpKitchenRepository } from '@app/contexts/kitchen/infrastructure/repositories/http-kitchen.repository';
import { GetKitchenOrderBoardUseCase } from '@app/contexts/kitchen/application/use-cases/get-kitchen-order-board.use-case';
import { AdvanceKitchenOrderStatusUseCase } from '@app/contexts/kitchen/application/use-cases/advance-kitchen-order-status.use-case';

export const KITCHEN_PROVIDERS: Provider[] = [
  { provide: KitchenRepository, useClass: HttpKitchenRepository },
  {
    provide: GetKitchenOrderBoardUseCase,
    useFactory: (repository: KitchenRepository) =>
      new GetKitchenOrderBoardUseCase(repository),
    deps: [KitchenRepository],
  },
  {
    provide: AdvanceKitchenOrderStatusUseCase,
    useFactory: (repository: KitchenRepository) =>
      new AdvanceKitchenOrderStatusUseCase(repository),
    deps: [KitchenRepository],
  },
];
