import { KitchenOrder } from '@app/contexts/kitchen/domain/repositories/kitchen.repository';
import { KitchenOrderBoardMapper } from './kitchen-order-board.mapper';

describe('KitchenOrderBoardMapper', () => {
  const realDateNow = Date.now;

  beforeEach(() => {
    Date.now = jest.fn(() => new Date('2026-06-26T10:20:00.000Z').getTime());
  });

  afterEach(() => {
    Date.now = realDateNow;
  });

  it('maps domain statuses into four kitchen board columns', () => {
    const orders: KitchenOrder[] = [
      {
        orderId: 'ord-101',
        status: 'Placed',
        createdAt: '2026-06-26T10:15:00.000Z',
        estimatedMinutes: 12,
        fulfillmentMode: 'delivery',
        lines: [
          { id: 'line-1', name: 'Margherita', quantity: 2 },
          { id: 'line-2', name: 'Cola', quantity: 1 },
        ],
      },
      {
        orderId: 'ord-102',
        status: 'Preparing',
        createdAt: '2026-06-26T10:12:00.000Z',
        estimatedMinutes: 8,
        fulfillmentMode: 'collection',
        lines: [{ id: 'line-3', name: 'Pepperoni', quantity: 1 }],
      },
      {
        orderId: 'ord-103',
        status: 'Baking',
        createdAt: '2026-06-26T10:10:00.000Z',
        estimatedMinutes: 4,
        fulfillmentMode: 'delivery',
        lines: [{ id: 'line-4', name: 'Diavola', quantity: 1 }],
      },
      {
        orderId: 'ord-104',
        status: 'OutForDelivery',
        createdAt: 'not-a-date',
        estimatedMinutes: 5,
        fulfillmentMode: 'delivery',
        lines: [{ id: 'line-5', name: 'Funghi', quantity: 1 }],
      },
    ];

    const vm = KitchenOrderBoardMapper.toVm(orders);

    expect(vm.columns.map((column) => column.key)).toEqual([
      'queue',
      'prepping',
      'oven',
      'ready',
    ]);
    expect(vm.activeOrders).toBe(3);
    expect(vm.stationSummary).toEqual([
      { station: 'A', activeOrders: 1 },
      { station: 'B', activeOrders: 1 },
      { station: 'C', activeOrders: 1 },
    ]);
    expect(vm.columns[0]?.orders[0]).toMatchObject({
      id: 'ord-101',
      displayId: '#101',
      columnKey: 'queue',
      station: 'A',
      items: ['Margherita ×2', 'Cola'],
      timerLabel: '5 min',
      footerLabel: 'Elapsed',
      canAdvance: true,
    });
    expect(vm.columns[1]?.orders[0]).toMatchObject({
      id: 'ord-102',
      columnKey: 'prepping',
      station: 'B',
      timerLabel: '8 min',
      footerLabel: 'Elapsed',
    });
    expect(vm.columns[2]?.orders[0]).toMatchObject({
      id: 'ord-103',
      columnKey: 'oven',
      station: 'C',
      ovenSeconds: 240,
      timerLabel: '4:00',
      timerState: 'muted',
      footerLabel: 'Oven',
    });
    expect(vm.columns[3]?.orders[0]).toMatchObject({
      id: 'ord-104',
      columnKey: 'ready',
      timerLabel: 'Out for delivery',
      footerLabel: 'Dispatch',
      createdAtIso: 'not-a-date',
    });
  });

  it('returns empty board columns when there are no active orders', () => {
    const vm = KitchenOrderBoardMapper.toVm([]);

    expect(vm.columns).toHaveLength(4);
    expect(vm.columns.every((column) => column.orders.length === 0)).toBe(true);
    expect(vm.activeOrders).toBe(0);
    expect(vm.emptyBody).toBe('New placed orders will appear here.');
  });
});
