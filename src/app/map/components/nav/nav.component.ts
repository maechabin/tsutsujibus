import { Component, Input, Output, EventEmitter } from '@angular/core';

import * as busModel from '../../../core/bus.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  @Input() routes: busModel.Routes;
  @Output() routeClick = new EventEmitter<string>();

  handleRouteClick(id: string) {
    this.routeClick.emit(id);
  }
}
