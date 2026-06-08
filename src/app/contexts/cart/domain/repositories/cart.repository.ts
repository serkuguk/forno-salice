import { Observable } from 'rxjs';
import { Cart } from '../entities/cart.entity';

export abstract class CartRepository {
  abstract getCart(): Observable<Cart>;
  abstract saveCart(cart: Cart): Observable<Cart>;
}
