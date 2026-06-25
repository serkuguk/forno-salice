import { map, Observable } from 'rxjs';
import { KitchenRepository } from '@app/contexts/kitchen/domain/repositories/kitchen.repository';
import { KitchenOrderBoardVm } from '@app/contexts/kitchen/application/dto/kitchen-order-board.vm';
import { KitchenOrderBoardMapper } from '@app/contexts/kitchen/application/mappers/kitchen-order-board.mapper';

export class GetKitchenOrderBoardUseCase {
  constructor(private readonly kitchenRepository: KitchenRepository) {}

  execute(): Observable<KitchenOrderBoardVm> {
    return this.kitchenRepository
      .getActiveOrders()
      .pipe(map((orders) => KitchenOrderBoardMapper.toVm(orders)));
  }
}
