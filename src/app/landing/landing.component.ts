import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
  Inject
} from '@angular/core';

import * as M from 'materialize-css';

import { WINDOW } from '../core/services/window.service';

@Component({
  selector: 'tika-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  @ViewChild('bannerElement') private bannerRef: ElementRef;

  constructor(@Inject(WINDOW) private window: Window) {}

  ngOnInit(): void {
    const elems = document.querySelectorAll('.parallax');
    M.Parallax.init(elems);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const range = 300;
    const banner = this.bannerRef.nativeElement;
    const scrollTop = this.window.scrollY;
    const height = banner.offsetHeight;
    const offset = height / 1.1;
    const calc = 1 - (scrollTop - offset + range) / range;

    banner.style.opacity = calc.toString();

    if (calc > 1) {
      banner.style.opacity = '1';
    } else if (calc < 0) {
      banner.style.opacity = '0';
    }
  }
}
