import { Component, Signal, computed } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrandService } from '../core/brand.service';
import { Brand, HeroContent } from '../core/brand.interface';
import { switchMap, filter } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-brand-signals-display',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './brand-signals-display.component.html',
  styleUrls: ['./brand-signals-display.component.scss']
})
export class BrandSignalsDisplayComponent {
  brand: Signal<Brand | null>;
  content: Signal<HeroContent | undefined>;

  constructor(
    private brandService: BrandService
  ) {
    this.brand = this.brandService.brand;

    const brandId$ = toObservable(this.brand).pipe(
      filter((brand): brand is Brand => brand !== null),
      switchMap(brand => this.brandService.getHeroContent(brand.id))
    );
    this.content = toSignal(brandId$);
  }
}
