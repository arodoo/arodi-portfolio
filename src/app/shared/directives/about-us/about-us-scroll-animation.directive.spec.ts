import { AboutUsScrollAnimationDirective } from './about-us-scroll-animation.directive';
import { ElementRef, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('AboutUsScrollAnimationDirective', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    
    const elementRef = TestBed.inject(ElementRef);
    const platformId = TestBed.inject(PLATFORM_ID);
    const directive = new AboutUsScrollAnimationDirective(elementRef, platformId);
    expect(directive).toBeTruthy();
  });
});
