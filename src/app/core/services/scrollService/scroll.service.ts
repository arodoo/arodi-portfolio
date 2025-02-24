import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private document = inject(DOCUMENT);
  private readonly SCROLL_OFFSET = 80; // Adjust this value as needed
  private readonly SCROLL_DURATION = 1000; // Duration in milliseconds

  scrollToElement(elementId: string): void {
    if (elementId === 'home') {
      this.smoothScroll(0);
      return;
    }

    const element = this.document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY - this.SCROLL_OFFSET;
      this.smoothScroll(elementPosition);
    }
  }

  private smoothScroll(targetPosition: number): void {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    const animation = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / this.SCROLL_DURATION, 1);
      
      // Easing function for smoother animation
      const easeInOutCubic = progress <= 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startPosition + (distance * easeInOutCubic));

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }
}
