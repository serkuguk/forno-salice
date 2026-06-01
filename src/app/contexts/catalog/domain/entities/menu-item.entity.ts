import { EntityId } from "@app/core/shared-kernel/types/entity-id/entity-id";
import { Money } from "@app/core/shared-kernel/value-objects/money/money.value-object";

export type MenuItemCategory = 'pizza' | 'drink' | 'side';

export class MenuItem {
  constructor(
    public readonly id: EntityId,
    public readonly name: string,
    public readonly description: string,
    public readonly category: MenuItemCategory,
    public readonly basePrice: Money,
    public readonly imageUrl?: string
  ) {}
}
