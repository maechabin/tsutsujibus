import * as L from 'leaflet';
import 'leaflet.gridlayer.googlemutant';
import omnivore from 'leaflet-omnivore';

export class LLMap {
  llmap!: L.Map;
  busMarker: {
    [busid: string]: L.Marker;
  } = {};
  busstopMarker: {
    [busid: string]: L.Marker;
  } = {};
  busstopMarkerGroup: L.FeatureGroup;
  polyline: any;

  initMap(elem: any) {
    const UserName = 'maechabin';
    const StreetStyleId = 'ck4e56i4t0iuw1cmdi8rfkyn3';
    const SatelliteStyleId = 'ck4edjkdr2zp01cjzsvya2cw9';
    const Token =
      'pk.eyJ1IjoibWFlY2hhYmluIiwiYSI6ImNrNGU0eHYxMzAya3YzZm1odWRyYjAycmsifQ.dL1yZ_6587JwS6uYjwPkGg';

    /** Layer */
    const streetsLayer = L.tileLayer(
      `https://api.mapbox.com/styles/v1/${UserName}/${StreetStyleId}/tiles/256/{z}/{x}/{y}?` +
        `access_token=${Token}`,
      {
        attribution: `
        © <a href="https://apps.mapbox.com/feedback/">Mapbox</a>,
        © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>
        `,
        maxZoom: 18,
        id: 'mapbox.streets', // mapbox.streets | mapbox.satellite
        accessToken: 'your.mapbox.access.token',
      },
    );

    const satelliteLayer = L.tileLayer(
      `https://api.mapbox.com/styles/v1/${UserName}/${SatelliteStyleId}/tiles/256/{z}/{x}/{y}?` +
        `access_token=${Token}`,
      {
        attribution: `
        © <a href="https://apps.mapbox.com/feedback/">Mapbox</a>,
        © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>
        `,
        maxZoom: 18,
        id: 'mapbox.satellite', // mapbox.streets | mapbox.satellite
        accessToken: 'your.mapbox.access.token',
      },
    );

    const googlemaps = L.gridLayer.googleMutant({
      type: 'roadmap', // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
    });

    this.llmap = L.map(elem)
      .setView([35.957151, 136.223857], 14)
      .addLayer(streetsLayer);

    L.control
      .layers(
        {
          Street: streetsLayer,
          Satellite: satelliteLayer,
          'Google Maps': googlemaps,
        },
        {},
        { position: 'bottomright' },
      )
      .addTo(this.llmap);
  }

  putPolyline(rosenid: string, color: string) {
    const style = {
      color,
      weight: 8,
      opacity: 0.8,
    };

    const geoJson = L.geoJSON(null, {
      style,
    }).addTo(this.llmap);

    this.polyline = omnivore.kml(
      `../../../assets/kml/${rosenid}.kml`,
      null,
      geoJson,
    );
  }

  clearPolyline() {
    if (this.polyline) {
      this.llmap.removeLayer(this.polyline);
    }
  }

  createIcon(busid: string, className: string = 'marker-icon') {
    /** Icon */
    const markerHtmlStyles = `
      position: absolute;
      width: 24px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      color: #fff;
      font-weight: bold;
      border-radius: 50%;
      border: 2px solid #fff;
      background-color: rgba(215,1,112,0.9);
    `;
    return L.divIcon({
      className,
      iconAnchor: [14, 14],
      popupAnchor: [0, -8],
      html: `
          <span style="${markerHtmlStyles}">${busid}</span>
        `,
    });
  }

  putMarker(marker: { busid: string; lat: number; lng: number }) {
    // const comment = `
    // <p style="font-size: 14px;">
    //   <a href="${marker.link}" target="_blank"><img src="${marker.img}" width="24" style="vertical-align: middle;" /></a>
    //   <a href="${marker.link}" target="_blank">
    //     <b>${marker.name}</b>
    //   </a>
    // </p>
    // <p>${marker.text}</p>
    // <p><date>${marker.createdAt}</date> ${marker.place}</p>
    // `;

    this.busMarker[`bus${marker.busid}`] = L.marker([marker.lat, marker.lng], {
      icon: this.createIcon(marker.busid),
      draggable: false,
    })
      .setZIndexOffset(1000)
      .addTo(this.llmap)
      .bindPopup('', {
        className: 'comment',
        autoClose: false,
      });
  }

  clearBusMarker() {
    Object.values(this.busMarker).forEach(marker => {
      this.llmap.removeLayer(marker);
    });
    Object.keys(this.busMarker).forEach(key => {
      delete this.busMarker[key];
    });
  }

  createBusstopMarker(
    busstop: {
      id: string;
      name: string;
      latitude: number;
      longitude: number;
    },
    color: string,
  ) {
    /** Icon */
    const markerHtmlStyles1 = `
        position: absolute;
        left: -6px;
        top: -6px;
        border-radius: 50%;
        background-color: ${color};
        width: 12px;
        height: 12px;
      `;
    const markerHtmlStyles2 = `
        position: absolute;
        left: 5px;
        bottom: -24px;
        width: 2px;
        height: 24px;
        background-color: ${color};
      `;
    const icon = L.divIcon({
      className: 'busstop-icon',
      iconAnchor: [0, 30],
      popupAnchor: [0, -30],
      html: `
          <span style="${markerHtmlStyles1}" />
          <span style="${markerHtmlStyles2}" />
        `,
    });

    const comment = `<p>${busstop.name}</p>`;

    this.busstopMarker[`busstop${busstop.id}`] = L.marker(
      [busstop.latitude, busstop.longitude],
      {
        icon,
        draggable: false,
      },
    ).bindPopup(comment);
  }

  putBusstopMarker() {
    this.busstopMarkerGroup = L.featureGroup(Object.values(this.busstopMarker));
    this.busstopMarkerGroup.addTo(this.llmap);
    this.llmap.fitBounds(this.busstopMarkerGroup.getBounds(), {
      maxZoom: 16,
    });
  }

  clearBusstopMarker() {
    Object.values(this.busstopMarker).forEach(marker => {
      this.llmap.removeLayer(marker);
    });
    Object.keys(this.busstopMarker).forEach(key => {
      delete this.busstopMarker[key];
    });
  }

  updateMarkerLatLng(marker: {
    busid: string;
    lat: number;
    lng: number;
    comment: string;
  }) {
    const newLatLng = new L.LatLng(marker.lat, marker.lng);

    if (!this.busMarker[`bus${marker.busid}`]) {
      this.putMarker(marker);
    }

    this.busMarker[`bus${marker.busid}`]
      .setIcon(this.createIcon(marker.busid, 'marker-icon-active'))
      .setLatLng(newLatLng)
      .setPopupContent(marker.comment);
  }
}
