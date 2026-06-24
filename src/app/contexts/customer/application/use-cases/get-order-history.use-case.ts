import {CustomerRepository} from "@app/contexts/customer/domain/repositories/customer.repository";
import {map, Observable, take} from "rxjs";
import {OrderHistoryVm} from "@app/contexts/customer/application/dto/order-history.vm";
import {OrderHistoryMapper} from "@app/contexts/customer/application/mappers/order-history.mapper";


export class GetOrderHistoryUseCase {

  constructor(private readonly customerRepository: CustomerRepository) {}

  execute(): Observable<OrderHistoryVm> {
    return this.customerRepository
      .getOrderHistory()
      .pipe(map((items) => OrderHistoryMapper.toVm(items)));
  }
}
