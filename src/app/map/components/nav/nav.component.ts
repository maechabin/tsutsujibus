import { Component, Input, Output, EventEmitter } from '@angular/core';

import * as busModel from '../../../core/bus.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  @Input() routes: busModel.Routes;
  @Input() routeid: string;
  @Output() routeClick = new EventEmitter<string>();

  handleRouteClick(id: string) {
    if (id !== this.routeid) {
      this.routeClick.emit(id);
    }
  }
}
