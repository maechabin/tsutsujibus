import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapContainerComponent } from './map.container';
import { NavComponent } from './components/nav/nav.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MapContainerComponent, NavComponent],
  exports: [MapContainerComponent],
})
export class MapModule { }
