
export interface SavedAddressProps {
  id: string;
  label: string;
  street: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export class SavedAddress {
  constructor(private readonly props: SavedAddressProps) {}

  get id(): string {
    return this.props.id;
  }

  get label(): string {
    return this.props.label;
  }

  get street(): string {
    return this.props.street;
  }

  get city(): string {
    return this.props.city;
  }

  get postalCode(): string {
    return this.props.postalCode;
  }

  get isDefault(): boolean {
    return this.props.isDefault;
  }

  fullAddress(): string {
    return `${this.street}, ${this.city}, ${this.postalCode}`;
  }
}
