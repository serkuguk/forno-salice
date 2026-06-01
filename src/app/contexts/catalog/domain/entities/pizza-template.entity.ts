import { EntityId } from "@app/core/shared-kernel/types/entity-id/entity-id";

export class PizzaTemplate {
  constructor(
    public readonly id: EntityId,
    public readonly menuItemId: EntityId,
    public readonly allowedSizes: string[],
    public readonly allowedDoughTypes: string[],
  ) {}
}
