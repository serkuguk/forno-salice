import {OrderStatusValue} from "@app/contexts/ordering/domain/value-objects/order-status";
import {KitchenOrder} from "@app/contexts/kitchen/domain/repositories/kitchen.repository";
import {KitchenOrderBoardVm, KitchenOrderCardVm} from "@app/contexts/kitchen/application/dto/kitchen-order-board.vm";


const BOARD_COLUMNS: ReadonlyArray<{ key: OrderStatusValue; title: string }> = [
  { key: 'Placed', title: 'Placed' },
  { key: 'Confirmed', title: 'Confirmed' },
  { key: 'Preparing', title: 'Preparing' },
  { key: 'Baking', title: 'Baking' },
  { key: 'Ready', title: 'Ready' },
  { key: 'OutForDelivery', title: 'Delivery' },
];

export class KitchenOrderBoardMapper {

  static toVm(orders: KitchenOrder[]): KitchenOrderBoardVm {
    return {
      columns: BOARD_COLUMNS.map((column) => ({
        key: column.key,
        title: column.title,
        orders: orders
          .filter((order) => order.status === column.key)
          .map((order) => this.toCardVm(order)),
      })),
      emptyTitle: 'No active kitchen orders',
      emptyBody: 'New placed orders will appear here.',
    };
  }

  private static toCardVm(order: KitchenOrder): KitchenOrderCardVm {
    return {
      id: order.orderId,
      orderNumberLabel: `Order #${order.orderId}`,
      statusKey: order.status,
      statusLabel: this.formatStatus(order.status),
      etaLabel: `${order.estimatedMinutes} min`,
      createdAtLabel: this.formatDate(order.createdAt),
      fulfillmentLabel:
        order.fulfillmentMode === 'delivery' ? 'Delivery' : 'Collection',
      linesLabel: order.lines.map((line) => `${line.name} ×${line.quantity}`).join(', '),
      nextActionLabel: this.resolveNextActionLabel(order.status),
      canAdvance: this.resolveNextActionLabel(order.status) !== null,
    };
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

  private static formatStatus(status: OrderStatusValue): string {
    switch (status) {
      case 'OutForDelivery':
        return 'Out for delivery';
      default:
        return status;
    }
  }

  private static formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
}

