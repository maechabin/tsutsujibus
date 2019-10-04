import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material';

import { LLMap } from '../domains/llmap/llmap';
import { BusService } from '../core/bus.service';
import { SpinnerService } from '../core/spinner.service';
import * as busModel from '../core/bus.model';
import * as colors from '../core/colors';

@Component({
  selector: 'app-map',
  templateUrl: './map.container.html',
  styleUrls: ['./map.container.scss'],
})
export class MapContainerComponent implements OnInit {
  private el: HTMLElement;
  readonly map = new LLMap();
  routes: busModel.Routes;
  routeid = '1';
  timetables: busModel.Timetable[] = [];
  runningTimetables: busModel.Timetable[] = [];
  isRunning = true;
  timer: any;
  readonly mobileQuery: MediaQueryList = this.media.matchMedia('(max-width: 720px)');

  @ViewChild('sidenav', { static: false }) private readonly sidenav: MatSidenav;

  @HostListener('window:focus', ['$event'])
  onFocus(event: FocusEvent): void {
    this.getTimeTable();
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: FocusEvent): void {
    this.map.clearBusMarker();
  }

  constructor(
    private elementRef: ElementRef,
    private busService: BusService,
    private spinnerService: SpinnerService,
    private media: MediaMatcher,
  ) { }

  async ngOnInit() {
    this.routes = await this.busService.routes();
    this.initMap();
    this.initRoute(this.routeid);

    this.map.llmap.on('zoomend', () => {
      // this.map.clearBusMarker();
      // this.getTimeTable();
    });
  }

  initMap() {
    this.el = this.elementRef.nativeElement;
    const mapElem = this.el.querySelector('.map') as HTMLElement;
    this.map.initMap(mapElem);
  }

  initRoute(routeid: string = '1') {
    this.spinnerService.startSpinner();
    this.isRunning = true;
    this.routeid = routeid;
    Promise.all([
      this.getBusstop(),
      this.getTimeTable(),
    ]).then((result) => {
      this.isRunning = result[1];
    }).catch(() => {
      this.isRunning = false;
    }).finally(() => {
      if (this.mobileQuery.matches) {
        this.sidenav.close();
      }
      this.spinnerService.stopSpinner();
    });
  }

  handleRouteClick(routeid: string) {
    this.initRoute(routeid);
  }

  handleMenuClick() {
    this.sidenav.toggle();
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
        return Promise.resolve(false);
      });
    } else {
      return Promise.resolve(false);
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
    clearInterval(this.timer);
    this.locateBus(binid);
    this.timer = setInterval(() => this.locateBus(binid), 5000);
  }

  private async locateBus(binid: string) {
    const b = await this.busService.route(this.routeid, binid);

    if (b && b.busid) {
      this.map.updateMarkerLatLng({
        busid: b.busid,
        lat: b.latitude,
        lng: b.longitude,
        comment: this.createBusComment(b),
      });

      this.isRunning = true;
    }
  }

  private createBusComment(businfo: busModel.Bus) {
    let routeid = '1';
    if (Number(this.routeid) > 11) {
      routeid = (Number(this.routeid) - 7) + '';
    } else {
      routeid = this.routeid;
    }

    const rosen = this.routes.rosen.find(r => r.id === businfo.rosenid);
    const runningState = businfo.isdelay ? '遅れています' : '正常通り運行中です';
    const speed = `${Math.round(businfo.speed * 60 / 1000)}km/分`;
    const style = {
      name: `
        text-align: center;
        margin: 0 0 8px 0;
        padding-bottom: 2px;
        border-bottom: 2px solid ${colors[`Route${routeid}`].busstop};
      `,
      info: `
        margin: 0;
        text-align: center;
      `
    };

    return `
      <div>
        <p style="${style.name}"><strong>${rosen.name}${businfo.busid}番バス ${businfo.destination}行き</strong></p>

        <p style="${style.info}">「${runningState}」</p>
        <p style="${style.info}">${speed}</p>
      </div>
    `;
  }
}
