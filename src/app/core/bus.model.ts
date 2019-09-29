export interface Bus {
  binid: string; // "4"
  busid: string; // "3"
  datetime: string; // "20190928154437"
  destination: string; // "公立丹南病院"
  direction: number; // 206
  isRunning: boolean; // true
  isdelay: boolean; // false
  latitude: number; // 35.978236
  longitude: number; // 136.182721
  rosenid: string; // "4"
  speed: number; // 0
}

export interface Busstops {
  busstop: Busstop[];
}

export interface Busstop {
  id: string; // "1"
  latitude: number; // 35.972846
  longitude: number; // 136.181591
  name: string; // "神明駅"
}

export interface Routes {
  rosen: {
    id: string;
    name: string;
  }[];
}
