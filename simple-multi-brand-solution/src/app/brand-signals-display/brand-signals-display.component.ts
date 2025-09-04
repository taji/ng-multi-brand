import { Component, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrandService } from '../core/brand.service';
import { Brand, BrandContent } from '../core/brand.interface';

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
export class BrandSignalsDisplayComponent implements OnInit {
  brand: Signal<Brand | null>;
  content: Signal<BrandContent | null>;

  constructor(
    private brandService: BrandService,
    private route: ActivatedRoute
  ) {
    this.brand = this.brandService.getCurrentBrand();
    this.content = this.brandService.getContent();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const brandId = params['brand'] || 'acme';
      this.brandService.loadBrand(brandId);
    });
  }
}