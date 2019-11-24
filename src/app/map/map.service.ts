import { Injectable } from '@angular/core';

import { LLMap } from '../domains/llmap/llmap';
import { BusService } from '../core/bus.service';
import { SpinnerService } from '../core/spinner.service';
import * as busModel from '../core/bus.model';
import * as colors from '../core/colors';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  /** mapインスタンス */
  public readonly map: LLMap = new LLMap();
  /** バスが運行中かどうか */
  private IsRunning = true;
  /** 選択された路線番号 */
  private SelectedRouteid = '1';
  /** 路線情報 */
  private Routes: busModel.Routes;
  /** 全てのバス路線の時刻表 */
  private timetables: busModel.Timetable[] = [];
  /** 運行中のバス路線の時刻表 */
  private runningTimetables: busModel.Timetable[] = [];
  /** バスapiを呼び出すタイマー */
  private timer: any;

  /** 路線情報 */
  get routes(): busModel.Routes {
    return this.Routes;
  }
  set routes(routes: busModel.Routes) {
    this.Routes = routes;
  }

  /** 選択された路線番号 */
  get selectedRouteid(): string {
    return this.SelectedRouteid;
  }
  set selectedRouteid(routeId: string) {
    this.SelectedRouteid = routeId;
  }

  /** バスが運行中かどうか */
  get isRunning(): boolean {
    return this.IsRunning;
  }
  set isRunning(isRunning: boolean) {
    this.IsRunning = isRunning;
  }

  constructor(
    private busService: BusService,
    private spinnerService: SpinnerService,
  ) {}

  async init(mapElement: HTMLElement) {
    this.routes = await this.busService.routes();
    setTimeout(() => {
      this.map.initMap(mapElement);
    }, 0);
  }

  async initRoute(routeid: string = this.selectedRouteid) {
    this.spinnerService.startSpinner();
    this.isRunning = true;
    this.selectedRouteid = routeid;
    await Promise.all([this.getBusstop(), this.getTimeTable()])
      .then(result => {
        this.isRunning = result[1];
      })
      .catch(() => {
        this.isRunning = false;
      })
      .finally(() => {
        this.spinnerService.stopSpinner();
      });
  }

  restart() {
    this.getTimeTable()
      .then(result => {
        this.isRunning = result;
      })
      .catch(() => {
        this.isRunning = false;
      });
  }

  async getTimeTable(): Promise<boolean> {
    const timeTable = await this.busService.timeTable(this.selectedRouteid);
    this.timetables = timeTable.timetable;
    this.runningTimetables = this.getRunningTimetables();

    if (this.runningTimetables.length > 0) {
      const runningBusTimetables = await Promise.all(
        this.runningTimetables.map(async (timetable: busModel.Timetable) => {
          // this.map.llmap.on('zoomend', () => {
          //   this.map.clearBusMarker();
          //   this.startBusLocation(timetable.binid);
          // });
          return await this.startBusLocation(timetable.binid);
        }),
      );
      const areRunning =
        runningBusTimetables.filter((isRunning: boolean) => isRunning === true)
          .length > 0;

      return Promise.resolve(areRunning);
    } else {
      return Promise.resolve(false);
    }
  }

  clearBusMarker() {
    this.map.clearBusMarker();
  }

  private getColorId(selectedRouteid: string): string {
    return Number(selectedRouteid) > 11
      ? Number(selectedRouteid) - 7 + ''
      : selectedRouteid;
  }

  private async getBusstop() {
    this.map.clearBusstopMarker();
    this.map.clearBusMarker();
    this.map.clearPolyline();

    const colorId = this.getColorId(this.selectedRouteid);
    const busstops = await this.busService.busstop(this.selectedRouteid);

    busstops.busstop.forEach(busstop => {
      this.map.createBusstopMarker(busstop, colors[`Route${colorId}`].busstop);
    });
    this.map.putBusstopMarker();
    this.map.putPolyline(colorId, colors[`Route${colorId}`].route);
  }

  private getRunningTimetables(): busModel.Timetable[] {
    return this.timetables.filter(timetable => {
      const startTime = timetable.list[0].time.split(':');
      const finishTime = timetable.list[timetable.list.length - 1].time.split(
        ':',
      );

      const startTimeNum =
        Number(startTime[0]) * 3600 + Number(startTime[1]) * 60 + 0 / 1000;
      const finishTimeNum =
        Number(finishTime[0]) * 3600 + Number(finishTime[1]) * 60 + 0 / 1000;
      const currentTimeNum =
        new Date().getHours() * 3600 + new Date().getMinutes() * 60 + 0 / 1000;

      return startTimeNum <= currentTimeNum && currentTimeNum <= finishTimeNum;
    });
  }

  private async startBusLocation(binid: string): Promise<boolean> {
    clearInterval(this.timer);
    const isRunning = await this.locateBus(binid);

    if (isRunning) {
      this.timer = setInterval(() => {
        this.locateBus(binid);
      }, 5000);
    }

    return Promise.resolve(isRunning);
  }

  private async locateBus(binid: string): Promise<boolean> {
    const runningBus = await this.busService.route(this.selectedRouteid, binid);

    if (runningBus && runningBus.busid) {
      this.map.updateMarkerLatLng({
        busid: runningBus.busid,
        lat: runningBus.latitude,
        lng: runningBus.longitude,
        comment: this.createBusComment(runningBus),
      });
    }

    return Promise.resolve(!!(runningBus && runningBus.busid));
  }

  private createBusComment(businfo: busModel.Bus) {
    const colorId = this.getColorId(this.selectedRouteid);
    const rosen = this.routes.rosen.find(r => r.id === businfo.rosenid);
    const runningState = businfo.isdelay
      ? '遅れています'
      : '正常通り運行中です';
    const speed = `${Math.round((businfo.speed * 60) / 1000)}km/分`;
    const style = {
      name: `
        text-align: center;
        margin: 0 0 8px 0;
        padding-bottom: 2px;
        border-bottom: 2px solid ${colors[`Route${colorId}`].busstop};
      `,
      info: `
        margin: 0;
        text-align: center;
      `,
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
