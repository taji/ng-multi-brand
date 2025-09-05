import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { signal } from '@angular/core';
import { AppComponent } from './app';
import { BrandService } from './core/brand.service';
import { ThemeService } from './core/theme.service';
import { Brand, BrandContent } from './core/brand.interface';

// A more complete mock for BrandService
class MockBrandService {
  // Mock properties for child components
  brand$ = of(null as Brand | null);
  content$ = of(null as BrandContent | null);
  brand = signal<Brand | null>(null);
  content = signal<BrandContent | null>(null);

  // Mock method for AppComponent logic
  loadBrand = jest.fn();
}

class MockThemeService {}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let brandService: MockBrandService;
  let queryParamsSubject: Subject<any>;

  beforeEach(async () => {
    queryParamsSubject = new Subject<any>();

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: BrandService,
          useClass: MockBrandService,
        },
        {
          provide: ThemeService,
          useClass: MockThemeService,
        },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: queryParamsSubject.asObservable() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    brandService = TestBed.inject(BrandService) as unknown as MockBrandService;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should load brand from query parameter on init', () => {
    fixture.detectChanges(); // ngOnInit()
    queryParamsSubject.next({ brand: 'globex' });
    expect(brandService.loadBrand).toHaveBeenCalledWith('globex');
  });

  it('should load default brand if no query parameter is provided', () => {
    fixture.detectChanges(); // ngOnInit()
    queryParamsSubject.next({});
    expect(brandService.loadBrand).toHaveBeenCalledWith('acme');
  });
});
