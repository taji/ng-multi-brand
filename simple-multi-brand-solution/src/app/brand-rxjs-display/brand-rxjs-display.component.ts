import { Component, OnInit } from '@angular/core'; // Removed OnDestroy
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrandRxjsService } from '../core/brand-rxjs.service';
import { Brand, BrandContent } from '../core/brand.interface'; // Import interfaces
import { Observable } from 'rxjs'; // Import Observable, removed Subscription

@Component({
  selector: 'app-brand-rxjs-display',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './brand-rxjs-display.component.html',
  styleUrls: ['./brand-rxjs-display.component.scss']
})
export class BrandRxjsDisplayComponent implements OnInit { // Removed OnDestroy
  brand$: Observable<Brand | null>; // Exposed as Observable
  content$: Observable<BrandContent | null>; // Exposed as Observable

  constructor(
    private brandRxjsService: BrandRxjsService,
    private route: ActivatedRoute
  ) {
    // Assign observables directly
    this.brand$ = this.brandRxjsService.currentBrand$;
    this.content$ = this.brandRxjsService.content$;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const brandId = params['brand'] || 'acme';
      this.brandRxjsService.loadBrand(brandId);
    });
  }
  // Removed ngOnDestroy
}
