import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import * as BusModel from './bus.model';

@Injectable({
  providedIn: 'root',
})
export class BusService {
  private readonly routeApi = 'https://tutujibus.com/rosenLookup.php';
  private readonly busApi = 'https://tutujibus.com/busLookup.php?busid=5';
  private readonly busstopApi = 'https://tutujibus.com/busstopLookup.php';
  private readonly routeNumberApi = 'https://tutujibus.com/rosenidLookup.php';
  private readonly timeTableApi = 'https://tutujibus.com/timetableLookup.php';

  constructor(private http: HttpClient) {}

  bus(keyword?: string): Promise<BusModel.Bus> {
    const params = {
      ...new HttpParams(),
      params: keyword ? { keyword } : null,
    };

    return this.http
      .jsonp<BusModel.Bus>(`${this.busApi}`, 'callback')
      .toPromise();
  }

  route(rosenid: string, binid: string): Promise<BusModel.Bus> {
    return this.http
      .jsonp<BusModel.Bus>(
        `${this.routeApi}?rosenid=${rosenid}&binid=${binid}`,
        'callback',
      )
      .toPromise();
  }

  /**
   * 路線ごとのバス停の座標データを取得する
   * @param rosenid 路線ID
   */
  busstop(rosenid: string): Promise<BusModel.Busstops> {
    return this.http
      .jsonp<BusModel.Busstops>(
        `${this.busstopApi}?rosenid=${rosenid}`,
        'callback',
      )
      .toPromise();
  }

  /**
   * 路線番号と路線名を取得する
   */
  routes(): Promise<BusModel.Routes> {
    return this.http
      .jsonp<BusModel.Routes>(`${this.routeNumberApi}`, 'callback')
      .toPromise();
  }

  /**
   * 路線ごとのバス停の座標データを取得する
   * @param rosenid 路線ID
   */
  timeTable(rosenid: string): Promise<BusModel.Timetables> {
    return this.http
      .jsonp<BusModel.Timetables>(
        `${this.timeTableApi}?rosenid=${rosenid}`,
        'callback',
      )
      .toPromise();
  }
}
