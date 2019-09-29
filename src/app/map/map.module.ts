import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapContainerComponent } from './map.container';
import { NavComponent } from './components/nav/nav.component';
import { AlertComponent } from './components/alert/alert.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MapContainerComponent, NavComponent, AlertComponent],
  exports: [MapContainerComponent],
})
export class MapModule { }
