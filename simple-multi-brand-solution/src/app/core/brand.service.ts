import { Injectable, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { Brand, BrandContent } from './brand.interface';

@Injectable({ providedIn: 'root' })
export class BrandService {
  // Internal State (RxJS)
  private brandSubject = new BehaviorSubject<Brand | null>(null);
  private contentSubject = new BehaviorSubject<BrandContent | null>(null);

  // Exposed as Observables
  brand$: Observable<Brand | null> = this.brandSubject.asObservable();
  content$: Observable<BrandContent | null> = this.contentSubject.asObservable();

  // Exposed as Signals
  brand: Signal<Brand | null> = toSignal(this.brand$, { initialValue: null });
  content: Signal<BrandContent | null> = toSignal(this.content$, { initialValue: null });

  constructor(private http: HttpClient) {}

  loadBrand(brandId: string): void {
    forkJoin({
      brand: this.http.get<Brand>(`http://localhost:3001/api/brands/${brandId}`),
      content: this.http.get<BrandContent>(`http://localhost:3001/api/content/${brandId}`)
    }).pipe(
      tap(({ brand, content }) => {
        this.brandSubject.next(brand);
        this.contentSubject.next(content);
      }),
      catchError(error => {
        console.error('Failed to load brand:', error);
        // Reset subjects on error
        this.brandSubject.next(null);
        this.contentSubject.next(null);
        return [];
      })
    ).subscribe();
  }
}
