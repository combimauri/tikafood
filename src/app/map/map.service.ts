import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import * as mapboxgl from 'mapbox-gl';

import { environment } from 'src/environments/environment';
import { GeoJson, IGeoJson } from './map';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(private db: AngularFirestore) {
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

  getMarkers(): Observable<any> {
    return this.db.collection('/markers').valueChanges();
  }

  createMarker(data: GeoJson): Promise<void> {
    const geoJson: IGeoJson = {
      $key: this.db.createId(),
      type: data.type,
      geometry: data.geometry,
      properties: data.properties
    };

    return this.db
      .collection('/markers')
      .doc(geoJson.$key)
      .set(geoJson, { merge: true });
  }

  removeMarker($key: string): Promise<void> {
    return this.db
      .collection('/markers/')
      .doc($key)
      .delete();
  }
}
