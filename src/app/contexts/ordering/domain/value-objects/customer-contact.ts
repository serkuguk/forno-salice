import { DomainError } from '@app/core/shared-kernel/errors/domain-error/domain-error';
import { PhoneNumber } from './phone-number';

export interface CustomerContactProps {
  name: string;
  email: string;
  phone: string;
}

/**
 * Контактные данные заказчика: имя, email и телефон (VO PhoneNumber).
 */
export class CustomerContact {
  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly phone: PhoneNumber,
  ) {}

  static create(props: CustomerContactProps): CustomerContact {
    const name = (props.name ?? '').trim();
    const email = (props.email ?? '').trim();

    if (!name) {
      throw new DomainError('ORDERING_INVALID_NAME', 'Customer name is required');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new DomainError('ORDERING_INVALID_EMAIL', 'Customer email is invalid');
    }

    return new CustomerContact(name, email, PhoneNumber.create(props.phone));
  }
}
