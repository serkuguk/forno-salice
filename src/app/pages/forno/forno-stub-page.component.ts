import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FornoShellComponent } from './components/forno-shell/forno-shell.component';

type StubModel = {
  title: string;
  eyebrow: string;
  description: string;
};

@Component({
  selector: 'app-forno-stub-page',
  imports: [FornoShellComponent, RouterLink],
  templateUrl: './forno-stub-page.component.html',
  styleUrl: './forno-stub-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FornoStubPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  public model: StubModel = {
    title: 'Coming Soon',
    eyebrow: 'Forno context',
    description: 'This context is planned in the next delivery phase.',
  };

  ngOnInit(): void {
    const key = this.route.snapshot.routeConfig?.path ?? '';

    if (key === 'menu') {
      this.model = {
        title: 'Menu Catalog',
        eyebrow: 'Catalog context',
        description: 'Menu screen is being migrated to the Forno design matrix.',
      };
      return;
    }

    if (key === 'build') {
      this.model = {
        title: 'Build Your Own',
        eyebrow: 'Ordering context',
        description: 'Pizza builder flow is reserved for the next implementation step.',
      };
      return;
    }

    if (key === 'kitchen') {
      this.model = {
        title: 'Kitchen Board',
        eyebrow: 'Kitchen context',
        description: 'Kitchen status board will be connected after MVP contexts are delivered.',
      };
      return;
    }

    if (key === 'cart') {
      this.model = {
        title: 'Cart',
        eyebrow: 'Cart context',
        description: 'Cart and checkout visuals will be integrated in the next MVP batch.',
      };
    }
  }
}

