import { Injectable, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, shareReplay } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { Brand, HeroContent } from './brand.interface';

@Injectable({ providedIn: 'root' })
export class BrandService {
  // --- Brand State Management ---
  private brandSubject = new BehaviorSubject<Brand | null>(null);
  brand$: Observable<Brand | null> = this.brandSubject.asObservable();
  brand: Signal<Brand | null> = toSignal(this.brand$, { initialValue: null });

  // --- Content Cache ---
  private heroContentCache = new Map<string, Observable<HeroContent>>();

  constructor(private http: HttpClient) {}

  /**
   * Loads the global brand configuration (theme, logo).
   * This is typically called once by the AppComponent.
   */
  loadBrand(brandId: string): void {
    this.http.get<Brand>(`http://localhost:3001/api/brands/${brandId}`)
      .pipe(
        tap(brand => this.brandSubject.next(brand)),
        catchError(error => {
          console.error('Failed to load brand:', error);
          this.brandSubject.next(null);
          return of(null);
        })
      ).subscribe();
  }

  /**
   * Gets hero content for a specific brand, with caching.
   */
  getHeroContent(brandId: string): Observable<HeroContent> {
    if (this.heroContentCache.has(brandId)) {
      return this.heroContentCache.get(brandId)!;
    }

    const content$ = this.http.get<HeroContent>(`http://localhost:3001/api/content/${brandId}`)
      .pipe(
        shareReplay(1) // Cache the last emitted value
      );

    this.heroContentCache.set(brandId, content$);
    return content$;
  }
}