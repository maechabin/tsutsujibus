import * as L from 'leaflet';
import 'leaflet.gridlayer.googlemutant';
import omnivore from 'leaflet-omnivore';

import * as Constants from './constants';

export class LLMap {
  llmap!: L.Map;
  private readonly busMarker: Map<string, L.Marker> = new Map();
  private readonly busstopMarker: Map<string, L.Marker> = new Map();
  private busstopMarkerGroup: L.FeatureGroup;
  private polyline: L.Layer;

  initMap(elem: HTMLElement) {
    /** Layer */
    const streetsLayer = L.tileLayer(Constants.StreetLayer, {
      attribution: Constants.Attribution,
      maxZoom: 18,
      id: Constants.LayerId.MapboxStreets,
      accessToken: Constants.Token,
    });

    const satelliteLayer = L.tileLayer(Constants.SatelliteStyleId, {
      attribution: Constants.Attribution,
      maxZoom: 18,
      id: Constants.LayerId.MapboxSatellite,
      accessToken: Constants.Token,
    });

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

    this.busMarker.set(
      `bus${marker.busid}`,
      L.marker([marker.lat, marker.lng], {
        icon: this.createIcon(marker.busid),
        draggable: false,
      })
        .setZIndexOffset(1000)
        .addTo(this.llmap)
        .bindPopup('', {
          className: 'comment',
          autoClose: false,
        }),
    );
  }

  clearBusMarker() {
    this.busMarker.forEach(marker => {
      this.llmap.removeLayer(marker);
    });
    this.busMarker.clear();
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

    this.busstopMarker.set(
      `busstop${busstop.id}`,
      L.marker([busstop.latitude, busstop.longitude], {
        icon,
        draggable: false,
      }).bindPopup(comment),
    );
  }

  putBusstopMarker() {
    let busstopMarkers = [];
    this.busstopMarker.forEach(marker => {
      busstopMarkers = [...busstopMarkers, marker];
    });
    this.busstopMarkerGroup = L.featureGroup(busstopMarkers);
    this.busstopMarkerGroup.addTo(this.llmap);
    this.llmap.fitBounds(this.busstopMarkerGroup.getBounds(), {
      maxZoom: 16,
    });
  }

  clearBusstopMarker() {
    this.busstopMarker.forEach(marker => {
      this.llmap.removeLayer(marker);
    });
    this.busstopMarker.clear();
  }

  updateMarkerLatLng(marker: {
    busid: string;
    lat: number;
    lng: number;
    comment: string;
  }) {
    const newLatLng = new L.LatLng(marker.lat, marker.lng);

    if (!this.busMarker.has(`bus${marker.busid}`)) {
      this.putMarker(marker);
    }

    this.busMarker
      .get(`bus${marker.busid}`)
      .setIcon(this.createIcon(marker.busid, 'marker-icon-active'))
      .setLatLng(newLatLng)
      .setPopupContent(marker.comment);
  }
}
