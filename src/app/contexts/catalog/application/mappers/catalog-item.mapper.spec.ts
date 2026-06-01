import { EntityId } from '@app/core/shared-kernel/types/entity-id/entity-id';
import { Money } from '@app/core/shared-kernel/value-objects/money/money.value-object';
import { MenuItem } from '../../domain/entities/menu-item.entity';
import { CatalogItemMapper } from './catalog-item.mapper';

describe('CatalogItemMapper', () => {
  it('maps signature and spicy flags from text', () => {
    const entity = new MenuItem(
      EntityId.create('pizza-1'),
      'Nduja Signature',
      'Spicy tomato base with pepper',
      'pizza',
      Money.create(12.5, 'eur'),
      undefined,
    );

    const vm = CatalogItemMapper.toVm(entity);

    expect(vm.categoryKey).toBe('signature');
    expect(vm.badge).toBe('spicy');
    expect(vm.isFeatured).toBe(false);
    expect(vm.priceValue).toBe(12.5);
    expect(vm.currency).toBe('EUR');
  });

  it('maps featured item to house fave badge when no stronger badge exists', () => {
    const entity = new MenuItem(
      EntityId.create('pizza-2'),
      'Chef Selection',
      'House fave featured this week',
      'pizza',
      Money.create(14, 'EUR'),
      undefined,
    );

    const vm = CatalogItemMapper.toVm(entity);

    expect(vm.isFeatured).toBe(true);
    expect(vm.badge).toBe('house fave');
  });
});
