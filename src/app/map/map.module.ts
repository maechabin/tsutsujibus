import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CustomMaterialModule } from '../core/custom-material.module';
import { MapContainerComponent } from './map.container';
import { HeaderComponent } from './components/header/header.component';
import { NavComponent } from './components/nav/nav.component';
import { AlertComponent } from './components/alert/alert.component';

@NgModule({
  imports: [BrowserModule, CustomMaterialModule],
  declarations: [
    MapContainerComponent,
    HeaderComponent,
    NavComponent,
    AlertComponent,
  ],
  exports: [MapContainerComponent],
})
export class MapModule {}
