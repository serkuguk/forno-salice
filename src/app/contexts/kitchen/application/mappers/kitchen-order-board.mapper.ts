import {
  KitchenBoardColumnVm,
  KitchenColumnKey,
  KitchenOrderBoardVm,
  KitchenOrderCardVm,
  KitchenStation,
  KitchenTimerState,
} from '@app/contexts/kitchen/application/dto/kitchen-order-board.vm';
import { KitchenOrder } from '@app/contexts/kitchen/domain/repositories/kitchen.repository';
import { OrderStatusValue } from '@app/contexts/ordering/domain/value-objects/order-status';

const BOARD_COLUMNS: ReadonlyArray<{
  key: KitchenColumnKey;
  title: string;
  accent: string;
}> = [
  { key: 'queue', title: 'Queue', accent: 'var(--warm-gray-lt)' },
  { key: 'prepping', title: 'Prepping', accent: 'var(--amber)' },
  { key: 'oven', title: 'In Oven', accent: 'var(--red)' },
  { key: 'ready', title: 'Ready', accent: 'var(--olive)' },
];

const STATIONS: ReadonlyArray<KitchenStation> = ['A', 'B', 'C'];

export class KitchenOrderBoardMapper {
  static toVm(orders: KitchenOrder[]): KitchenOrderBoardVm {
    const cards = orders
      .filter((order) => this.resolveColumnKey(order.status) !== null)
      .map((order) => this.toCardVm(order));

    const columns = BOARD_COLUMNS.map<KitchenBoardColumnVm>((column) => ({
      key: column.key,
      title: column.title,
      accent: column.accent,
      orders: cards.filter((card) => card.columnKey === column.key),
    }));

    return {
      columns,
      activeOrders: cards.filter((card) => card.columnKey !== 'ready').length,
      stationSummary: STATIONS.map((station) => ({
        station,
        activeOrders: cards.filter(
          (card) => card.station === station && card.columnKey !== 'ready',
        ).length,
      })),
      emptyTitle: 'No active kitchen orders',
      emptyBody: 'New placed orders will appear here.',
    };
  }

  private static toCardVm(order: KitchenOrder): KitchenOrderCardVm {
    const columnKey = this.resolveColumnKey(order.status);

    if (columnKey === null) {
      throw new Error(`Kitchen board does not support status ${order.status}`);
    }

    const station = this.resolveStation(order.orderId);
    const elapsedMinutes = this.resolveElapsedMinutes(order.createdAt);
    const ovenSeconds = columnKey === 'oven' ? order.estimatedMinutes * 60 : null;
    const timer = this.resolveTimer(order.status, elapsedMinutes, ovenSeconds);

    return {
      id: order.orderId,
      displayId: this.formatDisplayId(order.orderId),
      statusKey: order.status,
      statusLabel: this.formatStatus(order.status),
      columnKey,
      station,
      items: order.lines.map((line) => `${line.name}${line.quantity > 1 ? ` ×${line.quantity}` : ''}`),
      fulfillmentLabel:
        order.fulfillmentMode === 'delivery' ? 'Delivery' : 'Collection',
      createdAtIso: order.createdAt,
      elapsedMinutes,
      isOven: columnKey === 'oven',
      ovenSeconds,
      isReady: columnKey === 'ready',
      timerLabel: timer.label,
      timerState: timer.state,
      footerLabel: timer.footerLabel,
      nextActionLabel: this.resolveNextActionLabel(order.status),
      canAdvance: this.resolveNextActionLabel(order.status) !== null,
    };
  }

  private static resolveColumnKey(
    status: OrderStatusValue,
  ): KitchenColumnKey | null {
    switch (status) {
      case 'Placed':
        return 'queue';
      case 'Confirmed':
      case 'Preparing':
        return 'prepping';
      case 'Baking':
        return 'oven';
      case 'Ready':
      case 'OutForDelivery':
        return 'ready';
      default:
        return null;
    }
  }

  private static resolveNextActionLabel(
    status: OrderStatusValue,
  ): string | null {
    switch (status) {
      case 'Placed':
        return 'Confirm';
      case 'Confirmed':
        return 'Start prep';
      case 'Preparing':
        return 'Send to oven';
      case 'Baking':
        return 'Mark ready';
      case 'Ready':
        return 'Hand to courier';
      case 'OutForDelivery':
        return 'Mark delivered';
      default:
        return null;
    }
  }

  private static resolveStation(orderId: string): KitchenStation {
    const hash = Array.from(orderId).reduce(
      (total, character) => total + character.charCodeAt(0),
      0,
    );

    return STATIONS[hash % STATIONS.length];
  }

  private static resolveElapsedMinutes(createdAt: string): number {
    const createdAtDate = new Date(createdAt);

    if (Number.isNaN(createdAtDate.getTime())) {
      return 0;
    }

    return Math.max(0, Math.floor((Date.now() - createdAtDate.getTime()) / 60000));
  }

  private static resolveTimer(
    status: OrderStatusValue,
    elapsedMinutes: number,
    ovenSeconds: number | null,
  ): {
    label: string;
    state: KitchenTimerState;
    footerLabel: string;
  } {
    if (status === 'Baking' && ovenSeconds !== null) {
      if (ovenSeconds <= 0) {
        return {
          label: 'DONE',
          state: 'done',
          footerLabel: 'Oven',
        };
      }

      return {
        label: this.formatOvenTime(ovenSeconds),
        state: ovenSeconds > 120 ? 'muted' : ovenSeconds > 60 ? 'warning' : 'danger',
        footerLabel: 'Oven',
      };
    }

    if (status === 'Ready') {
      return {
        label: 'Ready for pickup',
        state: 'muted',
        footerLabel: 'Ready',
      };
    }

    if (status === 'OutForDelivery') {
      return {
        label: 'Out for delivery',
        state: 'muted',
        footerLabel: 'Dispatch',
      };
    }

    return {
      label: `${elapsedMinutes} min`,
      state: 'muted',
      footerLabel: 'Elapsed',
    };
  }

  private static formatDisplayId(orderId: string): string {
    const numericPart = orderId.replace(/\D/g, '');

    return `#${numericPart || orderId}`;
  }

  private static formatStatus(status: OrderStatusValue): string {
    switch (status) {
      case 'OutForDelivery':
        return 'Out for delivery';
      default:
        return status;
    }
  }

  private static formatOvenTime(valueInSeconds: number): string {
    const totalSeconds = Math.abs(Math.round(valueInSeconds));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }
}
