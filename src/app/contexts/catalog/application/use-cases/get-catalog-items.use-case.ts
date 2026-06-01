import { Observable, map } from 'rxjs';
import { CatalogRepository } from '../../domain/repositories/catalog.repository';
import { CatalogItemVm } from '../dto/catalog-item.vm';
import { CatalogItemMapper } from '../mappers/catalog-item.mapper';

export class GetCatalogItemsUseCase {

  constructor(private readonly catalogRepository: CatalogRepository) {}

  execute(): Observable<CatalogItemVm[]> {
    return this.catalogRepository.getCatalogItems().pipe(
      map((items) => items.map(CatalogItemMapper.toVm)),
    );
  }
}
