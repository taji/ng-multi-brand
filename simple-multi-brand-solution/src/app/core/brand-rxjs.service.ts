import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Brand, BrandContent } from './brand.interface'; // Re-use interfaces

@Injectable({ providedIn: 'root' })
export class BrandRxjsService {
  private currentBrandSubject = new BehaviorSubject<Brand | null>(null);
  private contentSubject = new BehaviorSubject<BrandContent | null>(null);

  currentBrand$: Observable<Brand | null> = this.currentBrandSubject.asObservable();
  content$: Observable<BrandContent | null> = this.contentSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadBrand(brandId: string): void {
    forkJoin({
      brand: this.http.get<Brand>(`http://localhost:3001/api/brands/${brandId}`),
      content: this.http.get<BrandContent>(`http://localhost:3001/api/content/${brandId}`)
    }).pipe(
      tap(({ brand, content }) => {
        this.currentBrandSubject.next(brand);
        this.contentSubject.next(content);
        this.applyTheme(brand);
      }),
      catchError(error => {
        console.error('Failed to load brand with RxJS:', error);
        // Optionally, propagate the error or set subjects to null
        return []; // Return an empty observable to complete the stream
      })
    ).subscribe();
  }

  private applyTheme(brand: Brand) {
    document.documentElement.style.setProperty('--brand-primary', brand.primaryColor);
    document.documentElement.style.setProperty('--brand-secondary', brand.secondaryColor);
  }
}
