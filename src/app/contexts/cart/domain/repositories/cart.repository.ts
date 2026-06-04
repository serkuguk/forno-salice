import { Observable } from 'rxjs';
import { Cart } from '../entities/cart.entity';
import { AddCartLineDto } from '../../application/dto/add-cart-line.dto';

export abstract class CartRepository {
  abstract getCart(): Observable<Cart>;
  abstract saveCart(cart: Cart): Observable<Cart>;
  abstract addLine(input: AddCartLineDto): Observable<unknown>;
}
