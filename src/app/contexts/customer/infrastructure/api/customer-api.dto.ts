export interface CustomerAddressResponseDto {
  id: string;
  label: string;
  street: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export interface CustomerProfileResponseDto {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  addresses: CustomerAddressResponseDto[];
}

export interface CustomerOrderHistoryResponseDto {
  orderId: string;
  createdAt: string;
  status: string;
  total: number;
  currency: string;
  lineSummary: string;
}
