import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../../domain/entities/order.entity';
import { OrderRepository, PlacedOrder } from '../../domain/repositories/order.repository';
import { PlaceOrderResponseDto } from '../api/order-api.dto';
import { OrderApiMapper } from '../mappers/order-api.mapper';

@Injectable({ providedIn: 'root' })
export class HttpOrderRepository implements OrderRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.server_url}/orders`;

  placeOrder(order: Order): Observable<PlacedOrder> {
    const payload = OrderApiMapper.toApi(order);

    return this.http
      .post<PlaceOrderResponseDto>(this.baseUrl, payload)
      .pipe(map((dto) => OrderApiMapper.toPlacedOrder(dto)));
  }
}
