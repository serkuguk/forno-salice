export interface OrderTrackingStepVm {
  key: string;
  label: string;
  body: string;
  state: 'complete' | 'current' | 'upcoming';
}

export interface OrderTrackingLineVm {
  id: string;
  name: string;
  quantity: number;
  subtotal: number;
  currency: string;
}

export interface OrderTrackingVm {
  orderId: string;
  statusLabel: string;
  statusBody: string;
  etaMinutes: number;
  steps: OrderTrackingStepVm[];
  lines: OrderTrackingLineVm[];
}
