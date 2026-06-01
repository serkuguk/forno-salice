import {Component, inject, input} from '@angular/core';
import { INavbarData } from '../../interfaces/nav-bar-data.interface';
import { CommonModule } from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: 'app-sublevel-menu',
    imports: [CommonModule,
        RouterLinkActive,
        RouterLink,
        TranslateModule],
    templateUrl: './sublevel-menu.component.html',
    styleUrl: './sublevel-menu.component.scss',
})
export class SublevelMenuComponent {

  public data = input<INavbarData>({
    routerLink: '',
    icon: '',
    label: '',
    items: []
  });
  public collapsed = input<boolean>(false);
  public animating = input<boolean>(false);
  public expanded = input<boolean>(false);
  public multiple = input<boolean>(false);

  public router: Router = inject(Router);

  public hundleClick(item: INavbarData): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded;
  }

  public getActiveClass(item: INavbarData): string {
    return item.expanded && this.router.url.includes(item.routerLink) ? 'active-sublevel':'';
  }

  public shrinkItems(item: INavbarData): void {
    if (!this.multiple()) {
      const data = this.data();
      if (data.items && data.items.length > 0) {
        for(let modelItem of data.items) {
          if (item !== modelItem && modelItem.expanded) {
            modelItem.expanded = false;
          }
        }
      }
    }
  }
}
