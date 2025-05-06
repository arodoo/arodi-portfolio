import { DOCUMENT } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  scrollToElement(elementId: string): void {
    // Only execute scroll in browser environment
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const element = this.document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    }
  }
}
