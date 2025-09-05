import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandRxjsDisplayComponent } from './brand-rxjs-display.component';
import { BrandService } from '../core/brand.service';
import { of, Subject } from 'rxjs';
import { Brand, HeroContent } from '../core/brand.interface';

describe('BrandRxjsDisplayComponent', () => {
  let component: BrandRxjsDisplayComponent;
  let fixture: ComponentFixture<BrandRxjsDisplayComponent>;
  let mockBrandService: any;
  let brandSubject: Subject<Brand | null>;

  const testBrand: Brand = {
    id: 'test-brand',
    name: 'Test Brand Name',
    primaryColor: '#123456',
    secondaryColor: '#654321',
    logo: 'test-logo.png',
  };

  const testContent: HeroContent = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    heroImage: 'test-hero.png',
    ctaText: 'Test CTA',
  };

  beforeEach(async () => {
    brandSubject = new Subject<Brand | null>();
    mockBrandService = {
      brand$: brandSubject.asObservable(),
      getHeroContent: jest.fn().mockReturnValue(of(testContent)),
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
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not call getHeroContent if brand is null', () => {
    fixture.detectChanges(); // ngOnInit()
    component.content$.subscribe(); // Subscribe to trigger the pipe
    brandSubject.next(null);
    expect(mockBrandService.getHeroContent).not.toHaveBeenCalled();
  });

  it('should call getHeroContent when brand is emitted', () => {
    fixture.detectChanges(); // ngOnInit()
    component.content$.subscribe(); // Subscribe to trigger the pipe
    brandSubject.next(testBrand);
    expect(mockBrandService.getHeroContent).toHaveBeenCalledWith(testBrand.id);
  });

  it('should populate content$ with data from getHeroContent', (done) => {
    fixture.detectChanges(); // ngOnInit()

    component.content$.subscribe(content => {
      expect(content).toEqual(testContent);
      done();
    });

    brandSubject.next(testBrand);
  });
});