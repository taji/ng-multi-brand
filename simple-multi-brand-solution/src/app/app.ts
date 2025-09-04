import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrandRxjsDisplayComponent } from './brand-rxjs-display/brand-rxjs-display.component';
import { BrandSignalsDisplayComponent } from './brand-signals-display/brand-signals-display.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BrandRxjsDisplayComponent, BrandSignalsDisplayComponent],
  templateUrl: './app.html'
})
export class AppComponent {
  constructor() {}
}