import { Component, OnInit } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import * as M from 'materialize-css';

import { GeoJson, FeatureCollection } from './map';
import { MapService } from './map.service';

const cochaLat = -17.393695;
const cochaLng = -66.157126;

@Component({
  selector: 'tika-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  /// default settings
  map: mapboxgl.Map;
  style = 'mapbox://styles/mauri075/cjr822ih905uy2tlbgxqkecg6';
  lat = cochaLat;
  lng = cochaLng;
  message = 'Hello World!';

  // data
  source: any;
  markers: any;
  currentLngLat: any;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    const elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);

    this.markers = [];
    this.initializeMap();
  }

  removeMarker(marker: any): void {
    this.mapService.removeMarker(marker.$key);
  }

  flyTo(data: GeoJson): void {
    this.map.flyTo({
      center: data.geometry.coordinates
    });
  }

  addMarkerHere(): void {
    console.log('hola mundo');
    const coordinates = [this.currentLngLat.lng, this.currentLngLat.lat];
    const newMarker = new GeoJson(coordinates, { message: this.message });
    this.mapService.createMarker(newMarker);
  }

  private initializeMap(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.map.flyTo({
          center: [this.lng, this.lat]
        });
      });
    }

    this.buildMap();
  }

  private buildMap(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 17,
      center: [this.lng, this.lat]
    });

    this.addMapControls();
    this.addMapEvents();
  }

  private addMapControls(): void {
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(
      new mapboxgl.GeolocateControl({ trackUserLocation: true })
    );
  }

  private addMapEvents(): void {
    this.addMapMarkerOnClick();
    this.addMapDataOnLoad();
  }

  private addMapMarkerOnClick(): void {
    this.map.on('click', event => {
      this.currentLngLat = event.lngLat;
      const popup = new mapboxgl.Popup();
      popup.setLngLat(event.lngLat);
      popup.setHTML(
        '<button data-target="add-marker-modal" class="btn modal-trigger" style="margin: 5px;">Add Marker</button>'
      );
      popup.addTo(this.map);
    });
  }

  private addMapDataOnLoad(): void {
    this.map.on('load', () => {
      // Register source
      this.map.addSource('firebase', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      this.source = this.map.getSource('firebase');

      // Subscribe to realtime database and set data source
      this.mapService.getMarkers().subscribe(markers => {
        this.markers = markers;
        const data = new FeatureCollection(markers);
        this.source.setData(data);
      });

      // Create map layers with realtime data
      this.map.addLayer({
        id: 'firebase',
        source: 'firebase',
        type: 'symbol',
        layout: {
          'text-field': '{message}',
          'text-size': 24,
          'text-transform': 'uppercase',
          'icon-image': 'rocket-15',
          'text-offset': [0, 1.5]
        },
        paint: {
          'text-color': '#f16624',
          'text-halo-color': '#fff',
          'text-halo-width': 2
        }
      });
    });
  }
}
