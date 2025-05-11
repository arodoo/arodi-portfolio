import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private isBrowser: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Scrolls to an element with the specified ID
   * @param elementId The ID of the element to scroll to
   * @param offset Optional vertical offset in pixels
   * @param duration Scroll animation duration in milliseconds
   */
  scrollToElement(elementId: string, offset = 0, duration = 800): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      const element = this.document.getElementById(elementId);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 0);
  }
}