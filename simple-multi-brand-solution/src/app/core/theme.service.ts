import { Injectable, effect } from '@angular/core';
import { BrandService } from './brand.service';
import { Brand } from './brand.interface';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  constructor(
    private brandService: BrandService
  ) {
    effect(() => {
      const brand = this.brandService.brand();
      if (brand) {
        this.applyTheme(brand);
      }
    });
  }

  private applyTheme(brand: Brand) {
    document.documentElement.style.setProperty('--brand-primary', brand.primaryColor);
    document.documentElement.style.setProperty('--brand-secondary', brand.secondaryColor);
  }
}