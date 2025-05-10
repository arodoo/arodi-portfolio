/* import { EntryLeaveAnimationDirective } from './entry-leave-animation.directive';

describe('EntryLeaveAnimationDirective', () => {
  it('should create an instance', () => {
    const directive = new EntryLeaveAnimationDirective();
    expect(directive).toBeTruthy();
  });
});
 */

import { EntryLeaveAnimationDirective } from './entry-leave-animation.directive';
import { ElementRef, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('SeparatorAnimationDirective', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: { nativeElement: document.createElement('section') } },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    const elementRef = TestBed.inject(ElementRef);
    const platformId = TestBed.inject(PLATFORM_ID);
    const directive = new EntryLeaveAnimationDirective(elementRef, platformId);
    expect(directive).toBeTruthy();
  });
});