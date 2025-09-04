import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandRxjsDisplayComponent } from './brand-rxjs-display.component';
import { BrandRxjsService } from '../core/brand-rxjs.service';
import { of, Subject } from 'rxjs';
import { Brand, BrandContent } from '../core/brand.interface';
import { ActivatedRoute } from '@angular/router';

describe('BrandRxjsDisplayComponent', () => {
  let component: BrandRxjsDisplayComponent;
  let fixture: ComponentFixture<BrandRxjsDisplayComponent>;
  let mockBrandRxjsService: any;

  const testBrand: Brand = {
    id: 'test-brand',
    name: 'Test Brand Name',
    primaryColor: '#123456',
    secondaryColor: '#654321',
    logo: 'test-logo.png',
  };

  beforeEach(async () => {
    mockBrandRxjsService = {
      loadBrand: jest.fn(),
      currentBrand$: of(testBrand),
      content$: of({
        title: 'Test Title',
        subtitle: 'Test Subtitle',
        heroImage: 'test-hero.png',
        ctaText: 'Test CTA',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [BrandRxjsDisplayComponent],
      providers: [
        {
          provide: BrandRxjsService,
          useValue: mockBrandRxjsService,
        },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ brand: 'test-brand' }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandRxjsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display brand name and logo', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-toolbar span')?.textContent).toContain(
      testBrand.name
    );
    expect(compiled.querySelector('mat-toolbar img')?.getAttribute('src')).toBe(
      testBrand.logo
    );
  });

  it('should display content title and subtitle', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-card-content h1')?.textContent).toContain(
      'Test Title'
    );
    expect(compiled.querySelector('mat-card-content p')?.textContent).toContain(
      'Test Subtitle'
    );
  });

  it('should display content hero image and CTA text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-card img')?.getAttribute('src')).toBe(
      'test-hero.png'
    );
    expect(compiled.querySelector('mat-card-content button')?.textContent).toContain(
      'Test CTA'
    );
  });
});

describe('BrandRxjsDisplayComponent - Default Brand', () => {
  let component: BrandRxjsDisplayComponent;
  let fixture: ComponentFixture<BrandRxjsDisplayComponent>;
  let mockBrandRxjsService: any;

  beforeEach(async () => {
    mockBrandRxjsService = {
      loadBrand: jest.fn(),
      currentBrand$: of({} as Brand), // Provide a minimal mock brand
      content$: of({} as BrandContent), // Provide minimal mock content
    };

    await TestBed.configureTestingModule({
      imports: [BrandRxjsDisplayComponent],
      providers: [
        {
          provide: BrandRxjsService,
          useValue: mockBrandRxjsService,
        },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({}) }, // No 'brand' query param
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandRxjsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should load default brand if no query param is provided', () => {
    expect(mockBrandRxjsService.loadBrand).toHaveBeenCalledWith('acme');
  });
});

describe('BrandRxjsDisplayComponent - Loading State', () => {
  let component: BrandRxjsDisplayComponent;
  let fixture: ComponentFixture<BrandRxjsDisplayComponent>;
  let mockBrandRxjsService: any;
  let currentBrandSubject: Subject<Brand | null>;
  let contentSubject: Subject<BrandContent | null>;

  beforeEach(async () => {
    currentBrandSubject = new Subject<Brand | null>();
    contentSubject = new Subject<BrandContent | null>();

    mockBrandRxjsService = {
      loadBrand: jest.fn(),
      currentBrand$: currentBrandSubject.asObservable(),
      content$: contentSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [BrandRxjsDisplayComponent],
      providers: [
        {
          provide: BrandRxjsService,
          useValue: mockBrandRxjsService,
        },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ brand: 'test-brand' }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandRxjsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should display loading message when brand is not yet loaded', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.loading')?.textContent).toContain(
      'Loading brand (RxJS)...'
    );
    expect(compiled.querySelector('mat-toolbar')).toBeNull();
    expect(compiled.querySelector('mat-card')).toBeNull();
  });
});
