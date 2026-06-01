export class EntityId {

  private constructor(public readonly value: string) {}

  static create(value: string): EntityId {
    if (!value || value.trim().length === 0) {
      throw new Error('EntityId value cannot be empty');
    }
    return new EntityId(value.trim());
  }

  equals(other: EntityId): boolean {
    return this.value === other.value;
  }
}
