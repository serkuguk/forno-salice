import { FulfillmentMode } from '../../domain/value-objects/fulfillment';

export interface PlaceOrderDto {
  name: string;
  email: string;
  phone: string;
  mode: FulfillmentMode;
  address?: {
    street: string;
    city: string;
    postalCode: string;
  } | null;
}
