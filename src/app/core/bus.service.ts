import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

import * as BusModel from './bus.model';

@Injectable({
  providedIn: 'root',
})
export class BusService {
  private readonly routeApi =
    'https://tutujibus.com/rosenLookup.php?rosenid=2&binid=1';
  private readonly busApi = 'https://tutujibus.com/busLookup.php?busid=5';
  private readonly busstopApi = 'https://tutujibus.com/busstopLookup.php';
  private readonly routeNumberApi = 'https://tutujibus.com/rosenidLookup.php';

  constructor(private http: HttpClient) { }

  bus(keyword?: string): Promise<BusModel.Bus> {
    const params = {
      ...new HttpParams(),
      params: keyword ? { keyword } : null,
    };

    return this.http.jsonp<BusModel.Bus>(`${this.busApi}`, 'callback').toPromise();
  }

  route(keyword?: string): Promise<BusModel.Bus> {
    const params = {
      ...new HttpParams(),
      params: keyword ? { keyword } : null,
    };

    return this.http.jsonp<BusModel.Bus>(`${this.routeApi}`, 'callback').toPromise();
  }

  /**
   * 路線ごとのバス停の座標データを取得する
   * @param rosenid 路線ID
   */
  busstop(rosenid: string): Promise<BusModel.Busstops> {
    return this.http.jsonp<BusModel.Busstops>(`${this.busstopApi}?rosenid=${rosenid}`, 'callback').toPromise();
  }

  /**
   * 路線番号と路線名を取得する
   */
  routes(): Promise<BusModel.Routes> {
    return this.http.jsonp<BusModel.Routes>(`${this.routeNumberApi}`, 'callback').toPromise();
  }

    return this.http.jsonp<BusModel.Busstop[]>(`${this.busstopApi}`, 'callback').toPromise();
  }
}
