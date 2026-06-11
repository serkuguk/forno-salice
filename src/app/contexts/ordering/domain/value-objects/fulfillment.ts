import { DomainError } from '@app/core/shared-kernel/errors/domain-error/domain-error';
import { Money } from '@app/core/shared-kernel/value-objects/money/money.value-object';
import { Address } from './address';

export type FulfillmentMode = 'delivery' | 'collection';

const DELIVERY_FEE_AMOUNT = 2.5;

/**
 * Способ получения заказа и связанная с ним ценовая политика.
 * Здесь живёт правило стоимости доставки — раньше "магическая" 2.5 была
 * захардкожена в presentation. Для delivery адрес обязателен.
 */
export class Fulfillment {
  private constructor(
    public readonly mode: FulfillmentMode,
    public readonly address: Address | null,
  ) {}

  static delivery(address: Address): Fulfillment {
    return new Fulfillment('delivery', address);
  }

  static collection(): Fulfillment {
    return new Fulfillment('collection', null);
  }

  static create(mode: FulfillmentMode, address: Address | null): Fulfillment {
    if (mode === 'delivery') {
      if (!address) {
        throw new DomainError('ORDERING_ADDRESS_REQUIRED', 'Delivery requires an address');
      }
      return Fulfillment.delivery(address);
    }
    return Fulfillment.collection();
  }

  fee(currency: string): Money {
    return Fulfillment.feeFor(this.mode, currency);
  }

  /** Ценовая политика без привязки к адресу — для предпросмотра на checkout. */
  static feeFor(mode: FulfillmentMode, currency: string): Money {
    return Money.create(mode === 'delivery' ? DELIVERY_FEE_AMOUNT : 0, currency);
  }
}
