import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Brand, BrandContent } from './brand.interface';

@Injectable({ providedIn: 'root' })
export class BrandService {
  private currentBrand = signal<Brand | null>(null);
  private content = signal<BrandContent | null>(null);

  constructor(private http: HttpClient) {}

  getCurrentBrand() {
    return this.currentBrand.asReadonly();
  }

  getContent() {
    return this.content.asReadonly();
  }

  async loadBrand(brandId: string) {
    try {
      const brand = await this.http.get<Brand>(`http://localhost:3001/api/brands/${brandId}`).toPromise();
      const brandContent = await this.http.get<BrandContent>(`http://localhost:3001/api/content/${brandId}`).toPromise();
      
      this.currentBrand.set(brand!);
      this.content.set(brandContent!);
      this.applyTheme(brand!);
    } catch (error) {
      console.error('Failed to load brand:', error);
    }
  }

  private applyTheme(brand: Brand) {
    document.documentElement.style.setProperty('--brand-primary', brand.primaryColor);
    document.documentElement.style.setProperty('--brand-secondary', brand.secondaryColor);
  }
}