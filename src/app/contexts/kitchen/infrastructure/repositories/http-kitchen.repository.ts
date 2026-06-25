import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderStatusValue } from '@app/contexts/ordering/domain/value-objects/order-status';
import {
  KitchenOrder,
  KitchenRepository,
} from '@app/contexts/kitchen/domain/repositories/kitchen.repository';
import { KitchenOrderResponseDto } from '@app/contexts/kitchen/infrastructure/api/kitchen-api.dto';
import { KitchenApiMapper } from '@app/contexts/kitchen/infrastructure/mappers/kitchen-api.mapper';

@Injectable({ providedIn: 'root' })
export class HttpKitchenRepository implements KitchenRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.server_url}/kitchen/orders`;

  getActiveOrders(): Observable<KitchenOrder[]> {
    return this.http
      .get<KitchenOrderResponseDto[]>(this.baseUrl)
      .pipe(map((items) => items.map((item) => KitchenApiMapper.toDomain(item))));
  }

  advanceOrderStatus(
    orderId: string,
    nextStatus: OrderStatusValue,
  ): Observable<KitchenOrder> {
    return this.http
      .patch<KitchenOrderResponseDto>(
        `${this.baseUrl}/${orderId}/status`,
        KitchenApiMapper.toAdvanceStatusRequest(nextStatus),
      )
      .pipe(map((dto) => KitchenApiMapper.toDomain(dto)));
  }
}
