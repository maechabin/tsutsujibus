import { Component, OnInit, ElementRef, HostListener } from '@angular/core';

import { LLMap } from '../domains/llmap/llmap';
import { BusService } from '../core/bus.service';
import * as busModel from '../core/bus.model';
import * as colors from '../core/colors';

@Component({
  selector: 'app-map',
  template: `
    <app-header class="header"></app-header>
    <div class="app">
      <app-nav
        [routes]="routes"
        [routeid]="routeid"
        class="nav"
        (routeClick)="handleRouteClick($event)"
      ></app-nav>
      <div class="map-wrapper">
        <app-alert class="alert" [isRunning]="isRunning"></app-alert>
        <div class="map"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .header {
        height: 40px;
      }

      .app {
        display: flex;
      }

      .nav {
        width: 266px;
        height: calc(100vh - 40px);
        overflow: scroll;
      }

      .map-wrapper {
        position: relative;
        width: calc(100% - 266px);
        height: calc(100vh - 40px);
      }

      .map {
        width: 100%;
        height: 100%;
      }

      .alert {
        position: absolute;
        z-index: 10000;
        left: calc(50% - 220px);
        right: calc(50% - 220px);
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
  isRunning = true;

  @HostListener('window:focus', ['$event'])
  onFocus(event: FocusEvent): void {
    this.getTimeTable();
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: FocusEvent): void {
    this.map.clearBusMarker();
  }

  constructor(private elementRef: ElementRef, private busService: BusService) { }

  async ngOnInit() {
    this.el = this.elementRef.nativeElement;
    const mapElem = this.el.querySelector('.map') as HTMLElement;
    this.map.initMap(mapElem);

    this.getBusstop();
    this.getTimeTable();

    this.routes = await this.busService.routes();

    this.map.llmap.on('zoomend', () => {
      // this.map.clearBusMarker();
      // this.getTimeTable();
    });
  }

  handleRouteClick(routeid: string) {
    this.isRunning = true;
    this.routeid = routeid;
    this.getBusstop();
    this.getTimeTable();
  }

  async getBusstop() {
    let routeid = '1';
    this.map.clearBusstopMarker();
    this.map.clearBusMarker();
    this.map.clearPolyline();
    const busstops = await this.busService.busstop(this.routeid);

    if (Number(this.routeid) > 11) {
      routeid = (Number(this.routeid) - 7) + '';
    } else {
      routeid = this.routeid;
    }

    busstops.busstop.forEach(busstop => {
      this.map.createBusstopMarker(busstop, colors[`Route${routeid}`].busstop);
    });
    this.map.putBusstopMarker();
    this.map.putPolyline(routeid, colors[`Route${routeid}`].route);
  }

  async getTimeTable() {
    const timeTable = await this.busService.timeTable(this.routeid);
    this.timetables = timeTable.timetable;
    this.runningTimetables = this.getRunningTimetables();
    if (this.runningTimetables.length > 0) {
      this.getRunningTimetables().forEach(timetable => {
        // this.map.llmap.on('zoomend', () => {
        //   this.map.clearBusMarker();
        //   this.startBusLocation(timetable.binid);
        // });
        this.startBusLocation(timetable.binid);
      });
    } else {
      this.isRunning = false;
    }
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
    this.locateBus(binid);
    setInterval(() => this.locateBus(binid), 5000);
  }

  private async locateBus(binid: string) {
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
  }
}
