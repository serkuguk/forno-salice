import {ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, OnInit, signal} from '@angular/core';
import {languages, userItems} from './header-dummy-data';
import {AsyncPipe, NgClass} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AvatarComponent} from "@shared/components/avatar/avatar.component";
import {DatePickerModule} from "primeng/datepicker";
import {Observable} from "rxjs";
import {AuthStateService} from "@pages/auth/services/auth-state.service";

@Component({
    selector: 'app-user-panel',
    imports: [
        NgClass,
        TranslateModule,
        AsyncPipe,
        AvatarComponent,
        DatePickerModule
    ],
    templateUrl: './user-panel.component.html',
    styleUrl: './user-panel.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserPanelComponent implements OnInit {
    public translate = inject(TranslateService);
    private readonly authStateService = inject(AuthStateService);

    public userData$: Observable<any | null> | undefined;
    public selectedLanguage: any;
    public languages = languages;
    public userItems = userItems;
    public showPanel = signal<boolean>(false);
    private elementRef = inject(ElementRef);

    ngOnInit(): void {
        this.translate.setDefaultLang('sp');
        this.selectedLanguage = this.languages[0];
        this.userData$ = this.authStateService.user$;
    }

    public userMenuToggle(): void {
        this.showPanel.update((currentValue) => !currentValue);
    }

    @HostListener('document:click', ['$event'])
    public onClosePanelExternalClick(event: MouseEvent): void {
        const clickedOutside = this.elementRef.nativeElement.contains(event.target as HTMLElement);
        if (!clickedOutside && this.showPanel()) {
            this.showPanel.set(false);
        }
    }

    public executeUserEvent(eventName: string): void {
        const methodName = eventName as keyof this;

        if (typeof this[methodName] === 'function') {
            (this[methodName] as Function).apply(this);
        }
    }

    public logout(): void {
        this.authStateService.logout().subscribe();
    }
}
