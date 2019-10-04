export interface Bus {
  /** 便番号 */
  binid: string; // "4"
  /** バス番号 */
  busid: string; // "3"
  /** バスからの送信日時 YYYYMMDDhhmmss */
  datetime: string; // "20190928154437"
  /** 行き先 */
  destination: string; // "公立丹南病院"
  /** 方位（度）　例 0：北 90：東 180：南 270：西 */
  direction: number; // 206
  /** true：運行中 false：運行以外 */
  isRunning: boolean; // true
  /** true:遅れ false：正常 */
  isdelay: boolean; // false
  /** 緯度 */
  latitude: number; // 35.978236
  /** 軽度 */
  longitude: number; // 136.182721
  /** 路線番号 */
  rosenid: string; // "4"
  /** 速度（m/秒） */
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
