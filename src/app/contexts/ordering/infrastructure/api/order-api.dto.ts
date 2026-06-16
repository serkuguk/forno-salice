import { FulfillmentMode } from '../../domain/value-objects/fulfillment';

export interface OrderApiLineDto {
  id: string;
  name: string;
  unitPrice: number;
  currency: string;
  quantity: number;
  subtotal: number;
}

export interface PlaceOrderRequestDto {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  fulfillment: {
    mode: FulfillmentMode;
  };
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
  } | null;
  lines: OrderApiLineDto[];
  total: number;
  currency: string;
}

export interface PlaceOrderResponseDto {
  orderId: string;
  status: string;
  estimatedMinutes: number;
  createdAt: string;
}

export interface OrderTrackingResponseDto {
  orderId: string;
  status: string;
  estimatedMinutes: number;
  createdAt: string;
  fulfillment: {
    mode: FulfillmentMode;
  };
  lines: OrderApiLineDto[];
}
