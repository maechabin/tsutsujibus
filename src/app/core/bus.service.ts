import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

import * as BusModel from './bus.model';

@Injectable({
  providedIn: 'root',
})
export class BusService {
  private readonly routeApi =
    'https://tutujibus.com/rosenLookup.php?rosenid=2&binid=1';
  private readonly busApi = 'https://tutujibus.com/busLookup.php?busid=10';
  private readonly busstopApi = 'https://tutujibus.com/busstopLookup.php?rosenid=2';

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

  busstop(keyword?: string): Promise<BusModel.Busstop[]> {
    const params = {
      ...new HttpParams(),
      params: keyword ? { keyword } : null,
    };

    return this.http.jsonp<BusModel.Busstop[]>(`${this.busstopApi}`, 'callback').toPromise();
  }
}
