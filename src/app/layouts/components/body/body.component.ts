import { CommonModule } from '@angular/common';
import {Component, input} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-body',
    imports: [CommonModule, RouterModule],
    templateUrl: './body.component.html',
    styleUrl: './body.component.scss'
})
export class BodyComponent {
  collapsed = input<boolean>(false);
  screenWidth = input<number>(0);

  public getBodyClass(): string {
    let styleClass = '';
    if (this.collapsed() && this.screenWidth() > 768) {
      styleClass = 'body-treemed';
    } else if (this.collapsed() && this.screenWidth() <= 768 && this.screenWidth() > 0) {
      styleClass = 'body-md-screen';
    }
    return styleClass;
  }
}
