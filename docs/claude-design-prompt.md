# Prompt For Claude Design

Скопируй этот prompt в `https://claude.ai/design`.

```text
Design a premium yet approachable responsive web storefront for a fictional pizza brand called "Forno & Slice".

This is not a generic fast-food app. The brand should feel like a contemporary city pizzeria with an open kitchen, warm lighting, crafted ingredients, and fast digital ordering. Avoid the usual red-white fast-food cliché and avoid a typical SaaS dashboard look.

Create a complete storefront design system and page concept for an Angular implementation with these screens:
- Landing / home
- Catalog / menu
- Pizza customization flow
- Cart
- Checkout
- Order tracking
- Kitchen status board (internal screen, simpler but same brand family)

Visual direction:
- Warm editorial feel, appetizing but controlled
- Strong hero section with a surprising layout
- Cream-toned background, charred tomato red, deep olive, warm amber, dark charcoal
- No pure white, no pure black
- No gradient text
- Avoid glassmorphism
- Avoid repetitive card grids as the only layout pattern

UX requirements:
- Mobile-first but strong desktop layout
- Clear navigation between menu, cart, and checkout
- Pizza builder should feel like a workbench, not a boring form
- Price updates and selected ingredients should be visually obvious
- Order status should be easy to scan
- Kitchen board should prioritize operational clarity over decoration

Typography:
- Expressive high-contrast heading style with food-magazine energy
- Clean readable sans-serif for UI text

Deliverables:
- A cohesive visual concept
- Key page mockups
- Component ideas for cards, buttons, navigation, product builder, cart summary, status timeline
- Color palette with accessible contrast
- Spacing and typography guidance
- Notes that help a developer implement the design in Angular with reusable components

Extra constraint:
The result must feel intentional and brand-led, not like an AI-generated default food delivery template.
```

## What To Ask Claude Next

После первого результата попроси:

1. `Now turn this into a component inventory for Angular.`
2. `Now define reusable design tokens in CSS variables.`
3. `Now describe the responsive behavior for mobile, tablet, and desktop.`
4. `Now give me a screen-by-screen implementation brief for Angular components.`
