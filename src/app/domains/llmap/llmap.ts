import * as L from 'leaflet';
import omnivore from 'leaflet-omnivore';

export class LLMap {
  llmap!: L.Map;
  busMarker: {
    [busid: string]: L.Marker;
  } = {};
  busstopMarker: {
    [busid: string]: L.Marker;
  } = {};
  busstopMarkerGroup = L.featureGroup();
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
          Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,
          <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
          Imagery © <a href="https://www.mapbox.com/">Mapbox</a>
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
          Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,
          <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
          Imagery © <a href="https://www.mapbox.com/">Mapbox</a>
        `,
        maxZoom: 10,
        id: 'mapbox.satellite', // mapbox.streets | mapbox.satellite
        accessToken: 'your.mapbox.access.token',
      },
    );

    this.llmap = L.map(elem)
      .setView([35.957151, 136.223857], 14)
      .addLayer(streetsLayer);

    L.control
      .layers(
        {
          street: streetsLayer,
          satellite: satelliteLayer,
        },
        {},
        { position: 'bottomright' },
      )
      .addTo(this.llmap);
  }

  putPolyline(rosenid: string) {
    const style = {
      color: 'rgba(236,64,122,0.5)',
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
      width: 28px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      color: #fff;
      font-weight: bold;
      box-shadow: 0 0 0 8px rgba(236,64,122,0.5);
      border-radius: 50%;
      border: 2px solid #fff;
      background-color: rgba(236,64,122,1);
      z-index: 10000;
    `;
    const icon = L.divIcon({
      className: 'marker-icon',
      iconAnchor: [16, 16],
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

  createBusstopMarker(busstop: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  }) {
    /** Icon */
    const markerHtmlStyles1 = `
        position: absolute;
        left: -5px;
        top: -5px;
        background-color: rgba(236,64,122,0.9);
        width: 10px;
        height: 10px;
        z-index: 100;
      `;
    const icon = L.divIcon({
      className: 'busstop-icon',
      iconAnchor: [0, 0],
      popupAnchor: [0, 0],
      html: `
          <span style="${markerHtmlStyles1}" />
        `,
    });

    const comment = `<p>${busstop.name}</p>`;

    this.busstopMarker[`busstop${busstop.id}`] = L.marker([busstop.latitude, busstop.longitude], {
      icon,
      draggable: false,
    })
      .bindPopup(comment);

    this.busstopMarkerGroup.addLayer(this.busstopMarker[`busstop${busstop.id}`]);
  }

  putBusstopMarker() {
    this.busstopMarkerGroup.addTo(this.llmap);
    this.llmap.fitBounds(this.busstopMarkerGroup.getBounds(), {
      maxZoom: 16,
    });
  }

  clearBusstopMarker() {
    Object.values(this.busstopMarker).forEach((marker) => {
      this.llmap.removeLayer(marker);
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
