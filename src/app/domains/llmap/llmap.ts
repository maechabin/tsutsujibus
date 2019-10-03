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
    const token =
      'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    /** Layer */
    const streetsLayer = L.tileLayer(
      `
    https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${token}
    `,
      {
        attribution: `
          <a href="https://www.openstreetmap.org/">OpenStreetMap</a>,
          <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
          <a href="https://www.mapbox.com/">Mapbox</a>
        `,
        maxZoom: 18,
        id: 'mapbox.streets', // mapbox.streets | mapbox.satellite
        accessToken: 'your.mapbox.access.token',
      },
    );

    const satelliteLayer = L.tileLayer(
      `
    https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${token}
    `,
      {
        attribution: `
          <a href="https://www.openstreetmap.org/">OpenStreetMap</a>,
          <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
          <a href="https://www.mapbox.com/">Mapbox</a>
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

    this.polyline = omnivore.kml(`../../../assets/kml/${rosenid}.kml`, null, geoJson);
  }

  clearPolyline() {
    if (this.polyline) {
      this.llmap.removeLayer(this.polyline);
    }
  }

  putMarker(marker: {
    busid: string;
    lat: number;
    lng: number;
  }) {
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
    const icon = L.divIcon({
      className: 'marker-icon',
      iconAnchor: [14, 14],
      popupAnchor: [0, 0],
      html: `
        <span style="${markerHtmlStyles}">${marker.busid}</span>
      `,
    });

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
      icon,
      draggable: false,
    })
      .setZIndexOffset(1000)
      .addTo(this.llmap).bindPopup('');
  }

  clearBusMarker() {
    Object.values(this.busMarker).forEach((marker) => {
      this.llmap.removeLayer(marker);
    });
    Object.keys(this.busMarker).forEach((key) => {
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

    this.busstopMarker[`busstop${busstop.id}`] = L.marker([busstop.latitude, busstop.longitude], {
      icon,
      draggable: false,
    })
      .bindPopup(comment);
  }

  putBusstopMarker() {
    this.busstopMarkerGroup = L.featureGroup(Object.values(this.busstopMarker));
    this.busstopMarkerGroup.addTo(this.llmap);
    this.llmap.fitBounds(this.busstopMarkerGroup.getBounds(), {
      maxZoom: 16,
    });
  }

  clearBusstopMarker() {
    Object.values(this.busstopMarker).forEach((marker) => {
      this.llmap.removeLayer(marker);
    });
    Object.keys(this.busstopMarker).forEach((key) => {
      delete this.busstopMarker[key];
    });
  }

  updateMarkerLatLng(marker: {
    busid: string;
    lat: number;
    lng: number;
    comment: string;
  }) {
    console.log(marker.busid);
    const newLatLng = new L.LatLng(marker.lat, marker.lng);

    if (!this.busMarker[`bus${marker.busid}`]) {
      this.putMarker(marker);
    }

    this.busMarker[`bus${marker.busid}`].setLatLng(newLatLng);
    // .setPopupContent(marker.comment).openPopup();
  }
}
