import {Provider} from "@angular/core";
import {CustomerRepository} from "@app/contexts/customer/domain/repositories/customer.repository";
import {HttpCustomerRepository} from "@app/contexts/customer/infrastructure/repositories/http-customer.repository";
import {GetOrderHistoryUseCase} from "@app/contexts/customer/application/use-cases/get-order-history.use-case";


export const CUSTOMER_PROVIDERS: Provider[] = [
  {provide: CustomerRepository, useClass: HttpCustomerRepository},
  {
    provide: GetOrderHistoryUseCase,
    useFactory: (repository: CustomerRepository) => new GetOrderHistoryUseCase(repository),
    deps: [CustomerRepository],
  }
]
