import { Observable, map } from 'rxjs';
import { CartVm } from '@app/contexts/cart/application/dto/cart.vm';
import { GetCartUseCase } from '@app/contexts/cart/application/use-cases/get-cart.use-case';
import { ClearCartUseCase } from '@app/contexts/cart/application/use-cases/clear-cart.use-case';
import { CartGateway, CartSnapshot } from '../../domain/ports/cart-gateway.port';

/**
 * Anti-corruption layer: единственная точка, где Ordering касается Cart context.
 * Транслирует Cart application (CartVm) в Ordering-owned CartSnapshot, удерживая
 * домен Ordering свободным от чужой ubiquitous language.
 */
export class CartGatewayAdapter implements CartGateway {
  constructor(
    private readonly getCartUseCase: GetCartUseCase,
    private readonly clearCartUseCase: ClearCartUseCase,
  ) {}

  getCart(): Observable<CartSnapshot> {
    return this.getCartUseCase.execute().pipe(map((vm) => this.toSnapshot(vm)));
  }

  clearCart(): Observable<void> {
    return this.clearCartUseCase.execute().pipe(map(() => undefined));
  }

  private toSnapshot(vm: CartVm): CartSnapshot {
    return {
      id: vm.id,
      currency: vm.currency,
      lines: vm.lines.map((line) => ({
        id: line.id,
        name: line.name,
        unitPrice: line.unitPrice,
        currency: line.currency,
        quantity: line.quantity,
      })),
    };
  }
}
