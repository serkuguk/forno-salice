import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerProfile } from '../../domain/entities/customer-profile.entity';
import {
  CustomerOrderHistoryItem,
  CustomerRepository,
} from '../../domain/repositories/customer.repository';
import {
  CustomerOrderHistoryResponseDto,
  CustomerProfileResponseDto,
} from '../api/customer-api.dto';
import { CustomerApiMapper } from '../mappers/customer-api.mapper';

@Injectable({ providedIn: 'root' })
export class HttpCustomerRepository implements CustomerRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.server_url}/customer`;

  getProfile(): Observable<CustomerProfile> {
    return this.http
      .get<CustomerProfileResponseDto>(`${this.baseUrl}/profile`)
      .pipe(map((dto) => CustomerApiMapper.toProfile(dto)));
  }

  getOrderHistory(): Observable<CustomerOrderHistoryItem[]> {
    return this.http
      .get<CustomerOrderHistoryResponseDto[]>(`${this.baseUrl}/orders`)
      .pipe(
        map((items) =>
          items.map((item) => CustomerApiMapper.toOrderHistoryItem(item)),
        ),
      );
  }
}
