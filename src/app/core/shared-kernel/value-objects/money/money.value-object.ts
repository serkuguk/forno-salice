export class Money {

  private constructor(
    public readonly amount: number,
    public readonly currency: string
  ) {}

   static create(amount: number, currency: string): Money {

    if (!Number.isFinite(amount)) {
      throw new Error('Money amount must be a finite number');
    }

    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }

    if (!currency || typeof currency !== 'string') {
      throw new Error('Money currency is required');
    }

    return new Money(amount, currency.toUpperCase());
  }

   add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
   }

   multiply(factor: number): Money {
    if (!Number.isFinite(factor)) {
      throw new Error('Money factor must be a finite number');
    }
    return new Money(this.amount * factor, this.currency);
   }

   equals(other: Money): boolean {
    return this.currency === other.currency && this.amount === other.amount;
   }

   private ensureSameCurrency(other: Money): void {
      if (this.currency !== other.currency) {
        throw new Error('Money currency mismatch');
      }
   }
}
