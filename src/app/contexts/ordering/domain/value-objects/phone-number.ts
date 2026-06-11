import { DomainError } from '@app/core/shared-kernel/errors/domain-error/domain-error';

/**
 * Телефон клиента. Валидирует, что в значении есть достаточно цифр для
 * корректного звонка курьера; хранит нормализованную (trimmed) форму.
 */
export class PhoneNumber {
  private constructor(public readonly value: string) {}

  static create(value: string): PhoneNumber {
    const normalized = (value ?? '').trim();
    const digits = normalized.replace(/\D/g, '');

    if (digits.length < 7) {
      throw new DomainError('ORDERING_INVALID_PHONE', 'Phone number is invalid');
    }

    return new PhoneNumber(normalized);
  }

  equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }
}
