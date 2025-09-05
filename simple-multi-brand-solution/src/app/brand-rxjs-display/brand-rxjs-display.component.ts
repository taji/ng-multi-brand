import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrandService } from '../core/brand.service';
import { Brand, BrandContent } from '../core/brand.interface';
import { Observable } from 'rxjs';

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
export class BrandRxjsDisplayComponent {
  brand$: Observable<Brand | null>;
  content$: Observable<BrandContent | null>;

  constructor(
    private brandService: BrandService
  ) {
    this.brand$ = this.brandService.brand$;
    this.content$ = this.brandService.content$;
  }
}