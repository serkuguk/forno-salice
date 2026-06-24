import {Observable} from "rxjs";
import {CustomerProfile} from "@app/contexts/customer/domain/entities/customer-profile.entity";

export interface CustomerOrderHistoryItem {
  orderId: string;
  createdAt: string;
  status: string;
  total: number;
  currency: string;
  lineSummary: string;
}

export abstract class CustomerRepository {
  abstract getProfile(): Observable<CustomerProfile>;
  abstract getOrderHistory(): Observable<CustomerOrderHistoryItem[]>;
}
