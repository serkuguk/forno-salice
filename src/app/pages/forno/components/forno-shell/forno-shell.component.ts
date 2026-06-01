import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '@pages/auth/services/auth-state.service';

@Component({
  selector: 'app-forno-shell',
  imports: [CommonModule, RouterLink],
  templateUrl: './forno-shell.component.html',
  styleUrl: './forno-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FornoShellComponent {
  private readonly router = inject(Router);
  private readonly authStateService = inject(AuthStateService);

  public isActive(path: string): boolean {
    return this.router.url.split('?')[0] === path;
  }

  public logout(): void {
    this.authStateService.logout().subscribe();
  }
}

