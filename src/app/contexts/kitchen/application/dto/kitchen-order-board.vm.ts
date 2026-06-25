export interface KitchenOrderCardVm {
  id: string;
  orderNumberLabel: string;
  statusKey: string;
  statusLabel: string;
  etaLabel: string;
  createdAtLabel: string;
  fulfillmentLabel: string;
  linesLabel: string;
  nextActionLabel: string | null;
  canAdvance: boolean;
}

export interface KitchenBoardColumnVm {
  key: string;
  title: string;
  orders: KitchenOrderCardVm[];
}

export interface KitchenOrderBoardVm {
  columns: KitchenBoardColumnVm[];
  emptyTitle: string;
  emptyBody: string;
}
