import {SavedAddress} from "@app/contexts/customer/domain/entities/saved-address.entity";

export interface CustomerProfileProps {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  addresses: SavedAddress[];
}

export class CustomerProfile {

  constructor(private readonly props: CustomerProfileProps) {}

  get id(): string {
    return this.props.id;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get phone(): string {
    return this.props.phone;
  }

  get email(): string {
    return this.props.email;
  }

  get addresses(): ReadonlyArray<SavedAddress> {
    return this.props.addresses;
  }

  defaultAddress(): SavedAddress | null {
    return this.props.addresses.find((address) => address.isDefault) ?? null;
  }
}
