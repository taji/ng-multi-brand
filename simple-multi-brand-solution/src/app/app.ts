import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrandRxjsDisplayComponent } from './brand-rxjs-display/brand-rxjs-display.component';
import { BrandSignalsDisplayComponent } from './brand-signals-display/brand-signals-display.component';
import { ThemeService } from './core/theme.service';
import { BrandService } from './core/brand.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BrandRxjsDisplayComponent,
    BrandSignalsDisplayComponent,
    MatToolbarModule,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class AppComponent implements OnInit {
  brand = this.brandService.brand;

  constructor(
    private themeService: ThemeService,
    private route: ActivatedRoute,
    private brandService: BrandService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const brandId = params['brand'] || 'acme';
      this.brandService.loadBrand(brandId);
    });
  }
}
