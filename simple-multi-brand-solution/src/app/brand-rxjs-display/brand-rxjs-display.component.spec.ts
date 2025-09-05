import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandRxjsDisplayComponent } from './brand-rxjs-display.component';
import { BrandService } from '../core/brand.service';
import { of, Subject } from 'rxjs';
import { Brand, BrandContent } from '../core/brand.interface';

describe('BrandRxjsDisplayComponent', () => {
  let component: BrandRxjsDisplayComponent;
  let fixture: ComponentFixture<BrandRxjsDisplayComponent>;
  let mockBrandService: any;

  const testBrand: Brand = {
    id: 'test-brand',
    name: 'Test Brand Name',
    primaryColor: '#123456',
    secondaryColor: '#654321',
    logo: 'test-logo.png',
  };

  const testContent: BrandContent = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    heroImage: 'test-hero.png',
    ctaText: 'Test CTA',
  };

  beforeEach(async () => {
    mockBrandService = {
      brand$: of(testBrand),
      content$: of(testContent),
    };

    await TestBed.configureTestingModule({
      imports: [BrandRxjsDisplayComponent],
      providers: [
        {
          provide: BrandService,
          useValue: mockBrandService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandRxjsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
      testContent.title
    );
    expect(compiled.querySelector('mat-card-content p')?.textContent).toContain(
      testContent.subtitle
    );
  });

  it('should display content hero image and CTA text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-card img')?.getAttribute('src')).toBe(
      testContent.heroImage
    );
    expect(compiled.querySelector('mat-card-content button')?.textContent).toContain(
      testContent.ctaText
    );
  });
});

describe('BrandRxjsDisplayComponent - Loading State', () => {
  let fixture: ComponentFixture<BrandRxjsDisplayComponent>;
  let mockBrandService: any;

  beforeEach(async () => {
    mockBrandService = {
      brand$: new Subject<Brand | null>(),
      content$: new Subject<BrandContent | null>(),
    };

    await TestBed.configureTestingModule({
      imports: [BrandRxjsDisplayComponent],
      providers: [
        {
          provide: BrandService,
          useValue: mockBrandService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandRxjsDisplayComponent);
    fixture.detectChanges();
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