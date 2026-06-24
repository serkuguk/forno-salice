import {CustomerOrderHistoryItem} from "@app/contexts/customer/domain/repositories/customer.repository";
import {OrderHistoryItemVm, OrderHistoryVm} from "@app/contexts/customer/application/dto/order-history.vm";


export class OrderHistoryMapper {

  static toVm(items: CustomerOrderHistoryItem[]): OrderHistoryVm {
    return {
      items: items.map((item) => this.toItemVm(item)),
      emptyTitle: 'No orders yet',
      emptyBody: 'Your completed checkouts will appear here.',
    };
  }

  private static toItemVm(item: CustomerOrderHistoryItem): OrderHistoryItemVm {
    return {
      id: item.orderId,
      orderNumberLabel: `Order #${item.orderId}`,
      dateLabel: this.formatDate(item.createdAt),
      statusLabel: this.formatStatus(item.status),
      totalLabel: `${item.total.toFixed(2)} ${item.currency}`,
      summaryLabel: item.lineSummary,
    };
  }

  private static formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }

  private static formatStatus(value: string): string {
    switch (value) {
      case 'Placed':
        return 'Placed';
      case 'Confirmed':
        return 'Confirmed';
      case 'Preparing':
        return 'Preparing';
      case 'Baking':
        return 'Baking';
      case 'Ready':
        return 'Ready';
      case 'OutForDelivery':
        return 'Out for delivery';
      case 'Delivered':
        return 'Delivered';
      default:
        return value;
    }
  }
}

