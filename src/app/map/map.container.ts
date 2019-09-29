import { Component, OnInit, ElementRef } from '@angular/core';

import { LLMap } from '../domains/llmap/llmap';
import { BusService } from '../core/bus.service';
import * as busModel from '../core/bus.model';

@Component({
  selector: 'app-map',
  template: `
  <div class="app">
    <app-nav
      [routes]="routes"
      class="nav"
      (routeClick)="handleRouteClick($event)"
    ></app-nav>
    <div class="map"></div>
  </div>
  `,
  styles: [
    `
      .app {
        display: flex;
      }

      .map {
        width: calc(100% - 320px);
        height: 100vh;
      }

      .nav {
        width: 320px;
        height: 100vh;
        overflow: scroll;
      }
    `,
  ],
})
export class MapContainerComponent implements OnInit {
  private el: HTMLElement;
  readonly map = new LLMap();
  routes: busModel.Routes;
  routeid = '1';

  constructor(private elementRef: ElementRef, private busService: BusService) { }

  async ngOnInit() {
    this.el = this.elementRef.nativeElement;
    const mapElem = this.el.querySelector('.map') as HTMLElement;
    this.map.initMap(mapElem);

    this.getBusstop();

    this.routes = await this.busService.routes();

    const route = await this.busService.route();
    const bus = await this.busService.bus();

    this.map.putMarker({
      busid: bus.busid,
      lat: bus.latitude,
      lng: bus.longitude,
    });

    setInterval(async () => {
      const b = await this.busService.bus();
      this.map.updateMarkerLatLng({
        busid: b.busid,
        lat: b.latitude,
        lng: b.longitude,
      });
    }, 5000);

    console.log(busstop);
    // console.log(route);

  handleRouteClick(routeid: string) {
    console.log(routeid);
    this.routeid = routeid;
    this.getBusstop();
  }

  async getBusstop() {
    this.map.clearBusstopMarker();
    const busstops = await this.busService.busstop(this.routeid);
    console.log(busstops.busstop);

    busstops.busstop.forEach(busstop => {
      this.map.putBusstopMarker(busstop);
    });
  }
}
