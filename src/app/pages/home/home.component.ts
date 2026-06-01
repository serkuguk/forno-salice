import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FornoShellComponent } from '../forno/components/forno-shell/forno-shell.component';

@Component({
    selector: 'app-home',
    imports: [RouterLink, FornoShellComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
}
