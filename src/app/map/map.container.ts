import {
  Component,
  OnInit,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material';

import * as busModel from '../core/bus.model';
import { MapService } from './map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.container.html',
  styleUrls: ['./map.container.scss'],
})
export class MapContainerComponent implements OnInit {
  private el: HTMLElement;
  readonly mobileQuery: MediaQueryList = this.media.matchMedia(
    '(max-width: 720px)',
  );

  @ViewChild('sidenav', { static: false }) private readonly sidenav: MatSidenav;

  @HostListener('window:focus', ['$event'])
  onFocus(event: FocusEvent): void {
    this.mapService.getTimeTable();
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: FocusEvent): void {
    this.mapService.clearBusMarker();
  }

  /** 路線情報 */
  get routes(): busModel.Routes {
    return this.mapService.routes;
  }

  /** 選択された路線番号 */
  get selectedRouteid(): string {
    return this.mapService.selectedRouteid;
  }

  /** バスが運行中かどうか */
  get isRunning(): boolean {
    return this.mapService.isRunning;
  }

  constructor(
    private elementRef: ElementRef,
    private mapService: MapService,
    private media: MediaMatcher,
  ) {}

  async ngOnInit() {
    await this.mapService.getRoutes();
    this.initMap();
    await this.mapService.initRoute();
    if (this.mobileQuery.matches) {
      this.sidenav.close();
    }

    // this.mapService.map.llmap.on('zoomend', () => {
    //   this.mapService.clearBusMarker();
    //   this.mapService.getTimeTable();
    // });
  }

  initMap() {
    this.el = this.elementRef.nativeElement;
    const mapElem = this.el.querySelector('.map') as HTMLElement;
    this.mapService.initMap(mapElem);
  }

  async handleRouteClick(routeid: string) {
    await this.mapService.initRoute(routeid);
    if (this.mobileQuery.matches) {
      this.sidenav.close();
    }
  }

  handleMenuClick() {
    this.sidenav.toggle();
  }
}
