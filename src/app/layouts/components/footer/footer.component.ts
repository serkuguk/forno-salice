import {CommonModule} from '@angular/common';
import {Component, inject, input, OnInit} from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {Observable} from "rxjs";
import {AuthStateService} from "@pages/auth/services/auth-state.service";

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    imports: [CommonModule, TranslateModule],
    providers: [TranslateService]
})
export class FooterComponent implements OnInit {
    isAuthenticated$: Observable<boolean | null> | undefined;
    private readonly authStateService = inject(AuthStateService);
    collapsed = input<boolean>(false);
    screenWidth = input<number>(0);

    ngOnInit(): void {
        this.isAuthenticated$ = this.authStateService.isAuthenticated$;
    }

    getFooterClass(): string {
        let styleClass = '';
        if (this.collapsed() && this.screenWidth() > 768) {
            styleClass = 'footer-treemed';
        } else if (this.collapsed() && this.screenWidth() <= 768 && this.screenWidth() > 0) {
            styleClass = 'footer-md-screen';
        }
        return styleClass;
    }

    translate = inject(TranslateService);
}
