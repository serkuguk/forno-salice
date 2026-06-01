import {Component, computed, inject, input, OnInit, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from "rxjs";
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {OverlayModule} from "@angular/cdk/overlay";
import {CdkMenuModule} from "@angular/cdk/menu";
import {UserPanelComponent} from "@app/componentes/user-panel/user-panel.component";
import {AuthStateService} from "@pages/auth/services/auth-state.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        OverlayModule,
        CdkMenuModule,
        UserPanelComponent
    ],
})
export class HeaderComponent implements OnInit {
    collapsed = input<boolean>(false);
    screenWidth = input<number>(0);

    public onHamburgerClick = output<void>();

    public isMobile = computed(() => this.screenWidth() <= 768);

    public isAuthenticated$: Observable<boolean | null> | undefined;
    public translate = inject(TranslateService);
    private readonly authStateService = inject(AuthStateService);

    ngOnInit(): void {
        this.isAuthenticated$ = this.authStateService.isAuthenticated$;
    }

    public getHeadClass(): string {
        let styleClass = '';
        if (this.collapsed() && this.screenWidth() > 768) {
            styleClass = 'head-trimmed';
        } else {
            styleClass = 'head-md-screen';
        }

        return styleClass;
    }
}
