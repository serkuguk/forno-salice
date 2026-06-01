import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CatalogRepository } from '../../domain/repositories/catalog.repository';
import { CatalogApiItemDto, CatalogApiResponse } from '../api/catalog-api.dto';
import { environment } from 'src/environments/environment';
import { EntityId } from '@app/core/shared-kernel/types/entity-id/entity-id';
import { Money } from '@app/core/shared-kernel/value-objects/money/money.value-object';
import { MenuItem } from '../../domain/entities/menu-item.entity';

@Injectable()
export class HttpCatalogRepository implements CatalogRepository {
  private readonly serverUrl = environment.server_url;
  private readonly endpoint = `${this.serverUrl}/catalog/items`;
  private static readonly DEFAULT_CURRENCY = 'EUR';

  constructor(private readonly http: HttpClient) {}

  getCatalogItems(): Observable<MenuItem[]> {
    return this.http
      .get<CatalogApiResponse>(this.endpoint)
      .pipe(map((response) => response.items.map((dto) => this.toDomain(dto))));
  }

  private toDomain(dto: CatalogApiItemDto): MenuItem {
    const amount = dto.type === 'pizza' ? dto.basePrices.small : dto.price;

    return new MenuItem(
      EntityId.create(dto.id),
      dto.name,
      dto.description,
      dto.type,
      Money.create(amount, HttpCatalogRepository.DEFAULT_CURRENCY),
      dto.imageUrl,
    );
  }
}
