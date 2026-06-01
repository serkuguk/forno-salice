import { DomainError } from "../../errors/domain-error/domain-error";

export class Result<T> {

  private constructor(
    public readonly _isSuccess: boolean,
    private readonly _value?: T,
    public readonly _error?: DomainError,
  ) {}

  static ok<T>(value: T): Result<T> {
    return new Result<T>(true, value);
  }

  static fail<T>(error: DomainError): Result<T> {
    return new Result<T>(false, undefined, error);
  }

  get isSuccess(): boolean {
    return this._isSuccess;
  }

  get isFailure(): boolean {
    return !this._isSuccess;
  }

  get value(): T {
    if (this.isFailure) {
       throw new Error('Cannot read value from failed result');
    }

    return this._value as T;
  }

  get error(): DomainError {
    if (this.isSuccess) {
      throw new Error('Cannot read error from successful result');
    }

    return this._error as DomainError;
  }
}
