export interface CartLineCustomization {
  size: string | null;
  dough: string | null;
  extraToppings: string[];
}

export const EMPTY_CART_LINE_CUSTOMIZATION: CartLineCustomization = {
  size: null,
  dough: null,
  extraToppings: [],
};

export function normalizeCartLineCustomization(
  customization?: Partial<CartLineCustomization> | null,
): CartLineCustomization {
  return {
    size: customization?.size ?? null,
    dough: customization?.dough ?? null,
    extraToppings: [...(customization?.extraToppings ?? [])].sort(),
  };
}

export function sameCartLineCustomization(
  left?: Partial<CartLineCustomization> | null,
  right?: Partial<CartLineCustomization> | null,
): boolean {
  const normalizedLeft = normalizeCartLineCustomization(left);
  const normalizedRight = normalizeCartLineCustomization(right);

  return normalizedLeft.size === normalizedRight.size
    && normalizedLeft.dough === normalizedRight.dough
    && normalizedLeft.extraToppings.length === normalizedRight.extraToppings.length
    && normalizedLeft.extraToppings.every((topping, index) => topping === normalizedRight.extraToppings[index]);
}
