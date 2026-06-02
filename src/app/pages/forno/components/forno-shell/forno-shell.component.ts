import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartDrawerComponent } from '@app/contexts/cart/presentation/components/cart-drawer/cart-drawer.component';
import { CartDrawerService } from '@app/contexts/cart/presentation/services/cart-drawer.service';

@Component({
  selector: 'app-forno-shell',
  imports: [CommonModule, RouterLink, CartDrawerComponent],
  templateUrl: './forno-shell.component.html',
  styleUrl: './forno-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FornoShellComponent {
  private readonly router = inject(Router);
  readonly cartDrawer = inject(CartDrawerService);

  public isActive(path: string): boolean {
    return this.router.url.split('?')[0] === path;
  }
}
