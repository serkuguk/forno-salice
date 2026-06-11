import { DomainError } from '@app/core/shared-kernel/errors/domain-error/domain-error';

export interface AddressProps {
  street: string;
  city: string;
  postalCode: string;
}

/**
 * Адрес доставки. Обязателен только для режима delivery; все поля непустые.
 */
export class Address {
  private constructor(
    public readonly street: string,
    public readonly city: string,
    public readonly postalCode: string,
  ) {}

  static create(props: AddressProps): Address {
    const street = (props.street ?? '').trim();
    const city = (props.city ?? '').trim();
    const postalCode = (props.postalCode ?? '').trim();

    if (!street || !city || !postalCode) {
      throw new DomainError('ORDERING_INVALID_ADDRESS', 'Delivery address is incomplete');
    }

    return new Address(street, city, postalCode);
  }
}
