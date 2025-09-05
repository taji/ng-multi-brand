import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroRxjsComponent } from './hero-rxjs.component';
import { BrandService } from '../core/brand.service';
import { of, Subject } from 'rxjs';
import { Brand, HeroContent } from '../core/brand.interface';
import { first } from 'rxjs/operators';

describe('HeroRxjsComponent', () => {
  let component: HeroRxjsComponent;
  let fixture: ComponentFixture<HeroRxjsComponent>;
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
      imports: [HeroRxjsComponent],
      providers: [
        {
          provide: BrandService,
          useValue: mockBrandService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroRxjsComponent);
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