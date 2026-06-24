import {
  CustomerOrderHistoryResponseDto,
  CustomerProfileResponseDto
} from "@app/contexts/customer/infrastructure/api/customer-api.dto";
import {CustomerProfile} from "@app/contexts/customer/domain/entities/customer-profile.entity";
import {SavedAddress} from "@app/contexts/customer/domain/entities/saved-address.entity";
import {CustomerOrderHistoryItem} from "@app/contexts/customer/domain/repositories/customer.repository";


export class CustomerApiMapper {

  static toProfile(dto: CustomerProfileResponseDto): CustomerProfile {
    return new CustomerProfile({
      id: dto.id,
      fullName: dto.fullName,
      phone: dto.phone,
      email: dto.email,
      addresses: dto.addresses.map(
        (address) =>
          new SavedAddress({
            id: address.id,
            label: address.label,
            street: address.street,
            city: address.city,
            postalCode: address.postalCode,
            isDefault: address.isDefault,
          }),
      ),
    })
  }

  static toOrderHistoryItem(
    dto: CustomerOrderHistoryResponseDto,
  ): CustomerOrderHistoryItem {
    return {
      orderId: dto.orderId,
      createdAt: dto.createdAt,
      status: dto.status,
      total: dto.total,
      currency: dto.currency,
      lineSummary: dto.lineSummary,
    };
  }
}
