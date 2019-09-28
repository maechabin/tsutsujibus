import * as L from 'leaflet';

export class LLMap {
  llmap!: L.Map;
  marker: {
    [busid: string]: L.Marker;
  } = {};

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
        maxZoom: 18,
        id: 'mapbox.satellite', // mapbox.streets | mapbox.satellite
        accessToken: 'your.mapbox.access.token',
      },
    );

    this.llmap = L.map(elem)
      .setView([35.957151, 136.223857], 12)
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

    console.log(marker.busid);
    this.marker[`bus${marker.busid}`] = L.marker([marker.lat, marker.lng], {
      icon,
      draggable: false,
    })
      .addTo(this.llmap);
    // .bindPopup(comment, {
    //   closeButton: true,
    //   autoClose: false,
    //   closeOnClick: false,
    // })
    // .openPopup();
  }

  updateMarkerLatLng(marker: {
    busid: string;
    lat: number;
    lng: number;
  }) {
    console.log(marker.busid);
    const newLatLng = new L.LatLng(marker.lat, marker.lng);
    this.marker[`bus${marker.busid}`].setLatLng(newLatLng);
  }
}
