import { inject, Injectable } from "@angular/core";
import { CartRepository } from "../../domain/repositories/cart.repository";
import { map, Observable } from "rxjs";
import { Cart } from "../../domain/entities/cart.entity";
import { HttpClient } from "@angular/common/http";
import { CartApiResponseDto } from "../api/cart-api.dto";
import { CartApiMapper } from "../mappers/cart-api.mapper";
import { environment } from "src/environments/environment";
import { AddCartLineDto } from "../../application/dto/add-cart-line.dto";


@Injectable({ providedIn: 'root' })
export class HttpCartRepository implements CartRepository {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.server_url}/cart`;


  getCart(): Observable<Cart> {
    return this.http.get<CartApiResponseDto>(this.baseUrl)
      .pipe(map((dto) => CartApiMapper.toDomain(dto)));
  }

  addLine(input: AddCartLineDto): Observable<unknown> {
    return this.http.put(this.baseUrl, input);
  }

  saveCart(cart: Cart): Observable<Cart> {
    const payload = CartApiMapper.toApi(cart);

    return this.http
      .put<CartApiResponseDto>(this.baseUrl, payload)
      .pipe(map((dto) => CartApiMapper.toDomain(dto)));
  }

}
