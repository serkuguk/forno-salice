export interface KitchenOrderLineResponseDto {
  id: string;
  name: string;
  quantity: number;
}

export interface KitchenOrderResponseDto {
  orderId: string;
  status: string;
  createdAt: string;
  estimatedMinutes: number;
  fulfillment: {
    mode: 'delivery' | 'collection';
  };
  lines: KitchenOrderLineResponseDto[];
}

export interface AdvanceKitchenOrderStatusRequestDto {
  status: string;
}
