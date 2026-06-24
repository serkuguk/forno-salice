import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type PizzaArtVariant = 'mini' | 'featured';

/** Topping seed map ported from the design (`forno-shared.jsx` MiniPizza). */
const TOPPING_SEEDS: Record<string, number[]> = {
  margherita: [0, 1, 2],
  diavola: [0, 2, 4],
  funghi: [1, 3, 5],
  norma: [0, 3],
  prosciutto: [1, 4],
  marinara: [],
  bianca: [0, 5],
  nduja: [2, 3, 4],
};

/** Candidate topping coordinates for the `mini` 220x220 viewBox. */
const TOPPING_POSITIONS: ReadonlyArray<readonly [number, number]> = [
  [105, 95],
  [130, 80],
  [80, 115],
  [120, 115],
  [95, 130],
  [140, 110],
];

let uidCounter = 0;

@Component({
  selector: 'app-pizza-art',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (variant() === 'featured') {
      <svg
        viewBox="0 0 280 280"
        width="260"
        height="260"
        class="pizza-art pizza-art--featured">
        <defs>
          <radialGradient [attr.id]="crustId()" cx="38%" cy="33%">
            <stop offset="0%" stop-color="#E8CA6C" />
            <stop offset="100%" stop-color="#C49838" />
          </radialGradient>
        </defs>
        <ellipse cx="142" cy="147" rx="108" ry="103" fill="rgba(0,0,0,.3)" />
        <circle cx="140" cy="140" r="108" [attr.fill]="'url(#' + crustId() + ')'" />
        <circle cx="140" cy="140" r="90" [attr.fill]="sauceColor()" opacity=".93" />
        <ellipse cx="126" cy="120" rx="32" ry="28" fill="#F0E0BC" opacity=".9" />
        <ellipse cx="158" cy="145" rx="26" ry="23" fill="#EED8B0" opacity=".84" />
        <ellipse cx="118" cy="155" rx="20" ry="18" fill="#F0E0BC" opacity=".86" />
        <circle cx="148" cy="122" r="8" fill="#C02010" opacity=".82" />
        <circle cx="162" cy="138" r="6" fill="#3A1808" opacity=".78" />
        <circle cx="130" cy="148" r="9" fill="#C02010" opacity=".78" />
        <circle cx="155" cy="160" r="6" fill="#3A1808" opacity=".7" />
        <circle cx="138" cy="132" r="4" fill="#E8901A" opacity=".8" />
        <circle
          cx="140"
          cy="140"
          r="108"
          fill="none"
          stroke="rgba(255,255,255,.1)"
          stroke-width="5" />
      </svg>
    } @else {
      <svg
        viewBox="0 0 220 220"
        width="140"
        height="140"
        class="pizza-art pizza-art--mini">
        <defs>
          <radialGradient [attr.id]="crustId()" cx="40%" cy="35%">
            <stop offset="0%" stop-color="#E8C870" />
            <stop offset="100%" stop-color="#C4A040" />
          </radialGradient>
          <radialGradient [attr.id]="sauceId()" cx="50%" cy="50%">
            <stop offset="0%" [attr.stop-color]="sauceColor()" stop-opacity=".95" />
            <stop offset="100%" [attr.stop-color]="sauceColor()" stop-opacity=".85" />
          </radialGradient>
        </defs>
        <ellipse cx="112" cy="118" rx="82" ry="78" fill="rgba(28,26,22,.12)" />
        <circle cx="110" cy="110" r="82" [attr.fill]="'url(#' + crustId() + ')'" />
        <circle cx="110" cy="110" r="66" [attr.fill]="'url(#' + sauceId() + ')'" />
        <ellipse cx="100" cy="98" rx="28" ry="24" fill="#F0E8C0" opacity=".88" />
        <ellipse cx="126" cy="118" rx="22" ry="20" fill="#EEE5B8" opacity=".82" />
        <ellipse cx="95" cy="126" rx="18" ry="16" fill="#F0E8C0" opacity=".84" />
        @for (pos of toppings(); track $index) {
          <circle [attr.cx]="pos[0]" [attr.cy]="pos[1]" r="7" fill="rgba(28,26,22,.22)" opacity=".7" />
        }
        <circle
          cx="110"
          cy="110"
          r="82"
          fill="none"
          stroke="rgba(255,255,255,.18)"
          stroke-width="4" />
      </svg>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .pizza-art--mini {
      opacity: .92;
    }

    .pizza-art--featured {
      filter: drop-shadow(0 16px 40px rgba(0, 0, 0, .5));
    }
  `,
})
export class PizzaArtComponent {
  readonly pizzaId = input<string>('');
  readonly sauceColor = input<string>('#B83018');
  readonly variant = input<PizzaArtVariant>('mini');

  /** Stable unique suffix so multiple instances don't share gradient ids. */
  private readonly uid = `${uidCounter++}`;

  private readonly idSuffix = computed(() => {
    const id = this.pizzaId().trim();
    const safe = id.replace(/[^a-zA-Z0-9_-]/g, '-');
    return safe ? `${safe}-${this.uid}` : this.uid;
  });

  readonly crustId = computed(() => `crust-${this.idSuffix()}`);
  readonly sauceId = computed(() => `sauce-${this.idSuffix()}`);

  readonly toppings = computed(() => {
    const seeds = TOPPING_SEEDS[this.pizzaId()] ?? [0, 1];
    return TOPPING_POSITIONS.filter((_, i) => seeds.includes(i));
  });
}
