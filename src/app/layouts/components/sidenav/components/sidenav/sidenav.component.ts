import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
  signal,
  computed,
  input,
  ElementRef,
  output
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import {SublevelMenuComponent} from "@app/layouts";
import {ISideNavToggle} from "@layouts/components/sidenav/interfaces/side-nav-toggle.interface";
import {navabarData} from "@layouts/components/sidenav/nav-data";
import {INavbarData} from "@layouts/components/sidenav/interfaces/nav-bar-data.interface";
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: 'app-sidenav',
    imports: [CommonModule,
        SublevelMenuComponent,
        RouterLink,
        RouterLinkActive,
        RouterModule,
        TranslateModule,
    ],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent implements OnInit, OnDestroy {

  public mobileOpen = input<boolean>(false);

  public onToggleSideNav = output<ISideNavToggle>();
  public onClose = output<void>();

  public collapsed = signal<boolean>(false);
  public screenWidth = signal<number>(0);
  public navData: INavbarData[] = navabarData;
  public multiple: boolean = false;

  public router: Router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  public isMobile = computed(() => this.screenWidth() <= 768);
  public isExpanded = computed(() => this.collapsed() || (this.isMobile() && this.mobileOpen()));

  // Floating menu
  public isSubMenuVisible = signal<boolean>(false);
  public hoveredMenuItem = signal<INavbarData | null>(null);
  public submenuPosition = signal<{ top: string; left: string }>({ top: '0px', left: '0px' });
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  @HostListener('window:resize')
  public onResize(): void {
    this.screenWidth.set(window.innerWidth);
    this.onToggleSideNav.emit({collapsed: this.collapsed(), screenWidth: this.screenWidth()});
  }

  @HostListener('document:click', ['$event'])
  public onClosePanelExternalClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target as HTMLElement);
    if (!clickedInside && this.collapsed() && !this.isMobile()) {
      this.collapsed.set(false);
      this.onToggleSideNav.emit({collapsed: this.collapsed(), screenWidth: this.screenWidth()});
    }
  }

  ngOnInit(): void {
    this.screenWidth.set(window.innerWidth);
  }

  ngOnDestroy(): void {
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
  }

  // Floating menu
  public showSubMenu(menuItem: INavbarData, event: MouseEvent): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    this.isSubMenuVisible.set(true);
    this.hoveredMenuItem.set(menuItem);

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.submenuPosition.set({
      top: `${rect.top}px`,
      left: `${rect.right + 19}px`
    });
  }

  public hideSubMenu(): void {
    this.hideTimeout = setTimeout(() => {
      this.isSubMenuVisible.set(false);
      this.hoveredMenuItem.set(null);
    }, 200);
  }

  public keepSubMenuOpen(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  public toggleCollapse(): void {
    this.collapsed.update((collapsed) => !collapsed);
    this.onToggleSideNav.emit({collapsed: this.collapsed(), screenWidth: this.screenWidth()});
  }

  public closeSidenav(): void {
    this.collapsed.set(false);
    this.onToggleSideNav.emit({collapsed: this.collapsed(), screenWidth: this.screenWidth()});
  }

  public closeDrawer(): void {
    this.onClose.emit();
  }

  public onNavLinkClick(): void {
    if (this.isMobile()) {
      this.onClose.emit();
    }
  }

  public getActiveClass(item: INavbarData): string {
    return this.router.url.includes(item.routerLink) ? 'active' : '';
  }

  public handleClick(item: INavbarData): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded;
  }

  public shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for (const modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }
}
