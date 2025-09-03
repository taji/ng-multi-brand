import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrandService } from './core/brand.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatToolbarModule, MatButtonModule, MatCardModule],
  template: `
    <div class="app-container">
      @if (brandService.getCurrentBrand()(); as brand) {
        <mat-toolbar color="primary">
          <img [src]="brand.logo" [alt]="brand.name" class="logo">
          <span>{{ brand.name }}</span>
        </mat-toolbar>

        <main class="main-content">
          @if (brandService.getContent()(); as content) {
            <mat-card class="hero-card">
              <img [src]="content.heroImage" [alt]="content.title" class="hero-image">
              <mat-card-content>
                <h1>{{ content.title }}</h1>
                <p>{{ content.subtitle }}</p>
                <button mat-raised-button color="primary">{{ content.ctaText }}</button>
              </mat-card-content>
            </mat-card>
          }
        </main>
      } @else {
        <div class="loading">Loading brand...</div>
      }
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
    }
    .logo {
      height: 40px;
      margin-right: 16px;
    }
    .main-content {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .hero-card {
      text-align: center;
    }
    .hero-image {
      width: 100%;
      max-width: 400px;
      height: auto;
    }
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-size: 18px;
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(
    public brandService: BrandService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const brandId = params['brand'] || 'acme';
      this.brandService.loadBrand(brandId);
    });
  }
}