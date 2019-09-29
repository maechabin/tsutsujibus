import { Component, OnInit, ElementRef } from '@angular/core';

import { LLMap } from '../domains/llmap/llmap';
import { BusService } from '../core/bus.service';
import * as busModel from '../core/bus.model';
import { ThrowStmt } from '@angular/compiler';

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
  timetables: busModel.Timetable[] = [];
  runningTimetables: busModel.Timetable[] = [];

  constructor(private elementRef: ElementRef, private busService: BusService) { }

  async ngOnInit() {
    this.el = this.elementRef.nativeElement;
    const mapElem = this.el.querySelector('.map') as HTMLElement;
    this.map.initMap(mapElem);

    this.getBusstop();
    this.getTimeTable();

    this.routes = await this.busService.routes();

    // const route = await this.busService.route();
    const bus = await this.busService.bus();

    // this.map.putMarker({
    //   busid: bus.busid,
    //   lat: bus.latitude,
    //   lng: bus.longitude,
    // });
  }

  handleRouteClick(routeid: string) {
    this.routeid = routeid;
    this.getBusstop();
    this.getTimeTable();
  }

  async getBusstop() {
    this.map.clearBusstopMarker();
    this.map.clearBusMarker();
    const busstops = await this.busService.busstop(this.routeid);

    busstops.busstop.forEach(busstop => {
      this.map.createBusstopMarker(busstop);
    });
    this.map.putBusstopMarker();
  }

  async getTimeTable() {
    const timeTable = await this.busService.timeTable(this.routeid);
    this.timetables = timeTable.timetable;
    this.runningTimetables = this.getRunningTimetables();
    this.getRunningTimetables().forEach(timetable => {
      this.startBusLocation(timetable.binid);
    });
  }

  getRunningTimetables(): busModel.Timetable[] {
    return this.timetables.filter(timetable => {
      const startTime = timetable.list[0].time.split(':');
      const finishTime = timetable.list[timetable.list.length - 1].time.split(':');

      const startTimeNum = Number(startTime[0]) * 3600 + Number(startTime[1]) * 60 + 0 / 1000;
      const finishTimeNum = Number(finishTime[0]) * 3600 + Number(finishTime[1]) * 60 + 0 / 1000;
      const currentTimeNum = new Date().getHours() * 3600 + new Date().getMinutes() * 60 + 0 / 1000;

      return startTimeNum <= currentTimeNum && currentTimeNum <= finishTimeNum;
    });
  }

  startBusLocation(binid: string) {
    setInterval(async () => {
      const b = await this.busService.route(this.routeid, binid);
      const rosen = this.routes.rosen.find(r => r.id === b.rosenid);

      if (b && b.busid) {
        const comment = `
        <div>
          <p>${rosen.name}</p>
          <p>行き先: ${b.destination}</p>
        </div>
      `;

        this.map.updateMarkerLatLng({
          busid: b.busid,
          lat: b.latitude,
          lng: b.longitude,
          comment,
        });
      }
    }, 5000);
  }
}
