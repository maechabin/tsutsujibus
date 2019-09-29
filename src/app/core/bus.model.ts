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

export interface Timetables {
  timetable: Timetable[];
}

export interface Timetable {
  /** 便番号 */
  binid: string; // "1"
  /** 行き先 */
  destination: string; // "JR鯖江駅"
  /** 1:開講日運行 2:休講日運行 3:常に運行 */
  konendaigakucd: string; // "3"
  /** 1:平日のみ運行 2:休日のみ運行 3:常に運行 */
  weekdaycd: string; // "1"
  /** 1:冬季日のみ運行 2:冬季日以外運行 3:常に運行 */
  wintercd: string; // "3"
  /** 時刻表 */
  list: List[];
}

export interface List {
  /** 発車予定時刻 */
  time: string; // "08:00:00"
  /** バス停番号 */
  busstopid: string; // "745"
}
