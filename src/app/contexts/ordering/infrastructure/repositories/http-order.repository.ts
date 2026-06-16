import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { OrderApiMapper } from '../../infrastructure/mappers/order-api.mapper';
import { OrderTrackingResponseDto } from '../../infrastructure/api/order-api.dto';
import { Order } from '../../domain/entities/order.entity';
import { OrderRepository, PlacedOrder, TrackedOrder } from '../../domain/repositories/order.repository';

@Injectable({ providedIn: 'root' })
export class HttpOrderRepository implements OrderRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.server_url}/orders`;

  placeOrder(order: Order): Observable<PlacedOrder> {
    const payload = OrderApiMapper.toApi(order);

    return this.http
      .post<PlacedOrder>(this.baseUrl, payload)
      .pipe(map((dto) => OrderApiMapper.toPlacedOrder(dto)));
  }

  getOrderTracking(orderId: string): Observable<TrackedOrder> {
    return this.http
      .get<OrderTrackingResponseDto>(`${this.baseUrl}/${orderId}`)
      .pipe(map((dto) => OrderApiMapper.toTrackedOrder(dto)));
  }
}
