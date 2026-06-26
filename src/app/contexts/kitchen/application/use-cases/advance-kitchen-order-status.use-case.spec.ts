import { of } from 'rxjs';
import { KitchenOrder } from '@app/contexts/kitchen/domain/repositories/kitchen.repository';
import { KitchenRepository } from '@app/contexts/kitchen/domain/repositories/kitchen.repository';
import { AdvanceKitchenOrderStatusUseCase } from './advance-kitchen-order-status.use-case';

describe('AdvanceKitchenOrderStatusUseCase', () => {
  const advancedOrder: KitchenOrder = {
    orderId: 'ord-201',
    status: 'Confirmed',
    createdAt: '2026-06-26T10:00:00.000Z',
    estimatedMinutes: 20,
    fulfillmentMode: 'delivery',
    lines: [{ id: 'line-1', name: 'Margherita', quantity: 1 }],
  };

  const kitchenRepository: Pick<KitchenRepository, 'advanceOrderStatus'> = {
    advanceOrderStatus: jest.fn().mockReturnValue(of(advancedOrder)),
  };

  let useCase: AdvanceKitchenOrderStatusUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    (kitchenRepository.advanceOrderStatus as jest.Mock).mockReturnValue(
      of(advancedOrder),
    );
    useCase = new AdvanceKitchenOrderStatusUseCase(
      kitchenRepository as KitchenRepository,
    );
  });

  it('advances the order through the next allowed ordering status', () => {
    let result: unknown;

    useCase.execute('ord-201', 'Placed').subscribe((value) => {
      result = value;
    });

    expect(kitchenRepository.advanceOrderStatus).toHaveBeenCalledWith(
      'ord-201',
      'Confirmed',
    );
    expect(result).toBe(advancedOrder);
  });

  it('throws when the kitchen tries to advance a terminal status', () => {
    expect(() => useCase.execute('ord-201', 'Delivered')).toThrow(
      'Kitchen cannot advance status from Delivered',
    );
    expect(kitchenRepository.advanceOrderStatus).not.toHaveBeenCalled();
  });
});
