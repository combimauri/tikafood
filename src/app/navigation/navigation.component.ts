import { Component, OnInit } from '@angular/core';

import * as M from 'materialize-css';

@Component({
  selector: 'tika-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  ngOnInit(): void {
    const elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);
  }
}
