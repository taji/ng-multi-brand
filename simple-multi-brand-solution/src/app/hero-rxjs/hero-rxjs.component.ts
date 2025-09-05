import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrandService } from '../core/brand.service';
import { Brand, HeroContent } from '../core/brand.interface';
import { Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-hero-rxjs',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './hero-rxjs.component.html',
  styleUrls: ['./hero-rxjs.component.scss']
})
export class HeroRxjsComponent implements OnInit {
  brand$: Observable<Brand | null>;
  content$!: Observable<HeroContent>;

  constructor(
    private brandService: BrandService
  ) {
    this.brand$ = this.brandService.brand$;
  }

  ngOnInit(): void {
    this.content$ = this.brand$.pipe(
      filter((brand): brand is Brand => brand !== null),
      switchMap(brand => this.brandService.getHeroContent(brand.id))
    );
  }
}
