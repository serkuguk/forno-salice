import { MenuItem } from '../entities/menu-item.entity';
import { Observable } from 'rxjs';

export abstract class CatalogRepository {
  abstract getCatalogItems(): Observable<MenuItem[]>;
}
