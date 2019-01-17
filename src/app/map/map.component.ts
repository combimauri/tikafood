import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tika-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  title = 'Cochabamba';
  lat = -17.393695;
  lng = -66.157126;

  constructor() {}

  ngOnInit() {}
}
