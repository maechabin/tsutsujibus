export const UserName = 'maechabin';
export const StreetStyleId = 'ck4e56i4t0iuw1cmdi8rfkyn3';
export const SatelliteStyleId = 'ck4edjkdr2zp01cjzsvya2cw9';
export const Token =
  'pk.eyJ1IjoibWFlY2hhYmluIiwiYSI6ImNrNGU0eHYxMzAya3YzZm1odWRyYjAycmsifQ.dL1yZ_6587JwS6uYjwPkGg';

export const StreetLayer =
  `https://api.mapbox.com/styles/v1/${UserName}/${StreetStyleId}/tiles/256/{z}/{x}/{y}?` +
  `access_token=${Token}`;

export const SatelliteLayer =
  `https://api.mapbox.com/styles/v1/${UserName}/${SatelliteStyleId}/tiles/256/{z}/{x}/{y}?` +
  `access_token=${Token}`;

export const Attribution = `
  © <a href="https://apps.mapbox.com/feedback/">Mapbox</a>,
  © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>
`;

export enum LayerId {
  MapboxStreets = 'mapbox.streets',
  MapboxSatellite = 'mapbox.satellite',
}
