import { Provider } from '@angular/core';
import { CatalogRepository } from './domain/repositories/catalog.repository';
import { HttpCatalogRepository } from './infrastructure/repositories/http-catalog.repository';
import { GetCatalogItemsUseCase } from './application/use-cases/get-catalog-items.use-case';
import { AddCatalogItemToCartUseCase } from './application/use-cases/add-catalog-item-to-cart.use-case';
import { AddLineUseCase } from '../cart/application/use-cases/add-line.use-case';

/**
 * Связывает доменную абстракцию CatalogRepository с её infrastructure-реализацией
 * и публикует use-case как DI-токен. Use-cases остаются чистыми (без @Injectable):
 * их создаёт factory, инжектя абстрактный репозиторий, а не конкретный HTTP-класс.
 */
export const CATALOG_PROVIDERS: Provider[] = [
  { provide: CatalogRepository, useClass: HttpCatalogRepository },
  {
    provide: GetCatalogItemsUseCase,
    useFactory: (repository: CatalogRepository) => new GetCatalogItemsUseCase(repository),
    deps: [CatalogRepository],
  },
  {
    provide: AddCatalogItemToCartUseCase,
    useFactory: (addLineUseCase: AddLineUseCase) => new AddCatalogItemToCartUseCase(addLineUseCase),
    deps: [AddLineUseCase],
  },
];
