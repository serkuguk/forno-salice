import { AddLineUseCase } from "@app/contexts/cart/application/use-cases/add-line.use-case";
import { CatalogItemVm } from "../dto/catalog-item.vm";
import { Observable } from "rxjs";
import { CartVm } from "@app/contexts/cart/application/dto/cart.vm";


export class AddCatalogItemToCartUseCase {

  constructor(private readonly addLineUseCase: AddLineUseCase) {}

  execute(item: CatalogItemVm): Observable<CartVm> {

    return this.addLineUseCase.execute({
      lineId: crypto.randomUUID(),
      menuItemId: item.id,
      name: item.title,
      unitPrice: item.priceValue,
      currency: item.currency,
      quantity: 1,
      notes: null,
      customization:
      item.category === 'pizza'
        ? {
            size: 'medium',
            dough: 'classic',
            extraToppings: [],
          }
        : null,
    });
  }
}
