import { Component, OnInit, ElementRef } from '@angular/core';

import { LLMap } from '../domains/llmap/llmap';
import { BusService } from '../core/bus.service';

@Component({
  selector: 'app-map',
  template: `
    <div class="map"></div>
  `,
  styles: [
    `
      .map {
        width: 100%;
        height: 100vh;
      }
    `,
  ],
})
export class MapContainerComponent implements OnInit {
  private el: HTMLElement;
  readonly map = new LLMap();

  constructor(private elementRef: ElementRef, private busService: BusService) { }

  async ngOnInit() {
    this.el = this.elementRef.nativeElement;
    const mapElem = this.el.querySelector('.map') as HTMLElement;
    this.map.initMap(mapElem);

    const busstop = await this.busService.busstop();
    const route = await this.busService.route();
    const bus = await this.busService.bus();

    console.log(busstop);
    console.log(route);
    console.log(bus);
  }
}
