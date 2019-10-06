import {
  Component,
  OnInit,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material';

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
    this.mapService.restart();
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: FocusEvent): void {
    this.mapService.clearBusMarker();
  }

  constructor(
    public mapService: MapService,
    private elementRef: ElementRef,
    private media: MediaMatcher,
  ) {}

  async ngOnInit() {
    this.initMap();
    this.initRoute();

    // this.mapService.map.llmap.on('zoomend', () => {
    //   this.mapService.clearBusMarker();
    //   this.mapService.getTimeTable();
    // });
  }

  /** 路線を洗濯した時の処理 */
  handleRouteClick(routeid: string) {
    this.initRoute(routeid);
  }

  /** ヘッダーのハンバーガーメニューをクリックした時の処理 */
  handleMenuClick() {
    this.sidenav.toggle();
  }

  private initMap() {
    this.el = this.elementRef.nativeElement;
    const mapElem = this.el.querySelector('.map') as HTMLElement;
    this.mapService.init(mapElem);
  }

  private async initRoute(routeid?: string) {
    await this.mapService.initRoute(routeid);
    if (this.mobileQuery.matches) {
      this.sidenav.close();
    }
  }
}
