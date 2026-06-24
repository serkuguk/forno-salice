export interface OrderHistoryItemVm {
  id: string;
  orderNumberLabel: string;
  dateLabel: string;
  statusLabel: string;
  totalLabel: string;
  summaryLabel: string;
}

export interface OrderHistoryVm {
  items: OrderHistoryItemVm[];
  emptyTitle: string;
  emptyBody: string;
}
