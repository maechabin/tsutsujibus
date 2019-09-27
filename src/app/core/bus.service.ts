import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BusService {
  private readonly routeApi =
    'https://tutujibus.com/rosenLookup.php?rosenid=1&binid=2';
  private readonly busApi = 'http://tutujibus.com/busLookup.php?binid=2';
  private readonly busstopApi = 'http://tutujibus.com/busstopLookup.php?rosenid=2';

  constructor(private http: HttpClient) { }

  bus(keyword?: string): Promise<any> {
    const params = {
      ...new HttpParams(),
      params: keyword ? { keyword } : null,
    };

    return this.http.jsonp(`${this.busApi}`, 'callback').toPromise();
  }

  route(keyword?: string): Promise<any> {
    const params = {
      ...new HttpParams(),
      params: keyword ? { keyword } : null,
    };

    return this.http.jsonp(`${this.routeApi}`, 'callback').toPromise();
  }

  busstop(keyword?: string): Promise<any> {
    const params = {
      ...new HttpParams(),
      params: keyword ? { keyword } : null,
    };

    return this.http.jsonp(`${this.busstopApi}`, 'callback').toPromise();
  }
}
