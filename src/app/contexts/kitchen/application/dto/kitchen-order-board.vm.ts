export type KitchenColumnKey = 'queue' | 'prepping' | 'oven' | 'ready';

export type KitchenStation = 'A' | 'B' | 'C';

export type KitchenTimerState = 'muted' | 'warning' | 'danger' | 'done';

export interface KitchenOrderCardVm {
  id: string;
  displayId: string;
  statusKey: string;
  statusLabel: string;
  columnKey: KitchenColumnKey;
  station: KitchenStation;
  items: string[];
  fulfillmentLabel: string;
  createdAtIso: string;
  elapsedMinutes: number;
  isOven: boolean;
  ovenSeconds: number | null;
  isReady: boolean;
  timerLabel: string;
  timerState: KitchenTimerState;
  footerLabel: string;
  nextActionLabel: string | null;
  canAdvance: boolean;
}

export interface KitchenBoardColumnVm {
  key: KitchenColumnKey;
  title: string;
  accent: string;
  orders: KitchenOrderCardVm[];
}

export interface KitchenStationSummaryVm {
  station: KitchenStation;
  activeOrders: number;
}

export interface KitchenOrderBoardVm {
  columns: KitchenBoardColumnVm[];
  activeOrders: number;
  stationSummary: KitchenStationSummaryVm[];
  emptyTitle: string;
  emptyBody: string;
}
