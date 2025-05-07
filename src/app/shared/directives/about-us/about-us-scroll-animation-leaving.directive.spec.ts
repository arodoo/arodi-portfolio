import { Directive, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Directive({
  selector: '[appAboutUsScrollAnimationLeaving]',
  standalone: true
})
export class AboutUsScrollAnimationLeavingDirective implements OnInit, OnDestroy {
  @Input('appAboutUsScrollAnimationLeaving') effectType: 'right' | 'left' | 'scale' = 'right';

  private isBrowser: boolean;
  private scrollTriggers: any[] = [];  // Changed type to any[] to avoid TypeScript errors

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Correct way to register ScrollTrigger in newer GSAP versions
    gsap.registerPlugin(ScrollTrigger);

    // Set a small delay to ensure DOM is ready
    setTimeout(() => {
      this.setupScrollAnimation();
    }, 100);
  }

  private setupScrollAnimation(): void {
    const element = this.el.nativeElement;

    // Start with a clean state - make sure we don't have transform properties already
    gsap.set(element, { clearProps: "x,scale,opacity" });

    // Create a timeline for better control
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top 80%",    // Adjusted for better visibility
        end: "bottom 20%",   // Adjusted for better animation completion
        scrub: 1,            // Smoother scrubbing
        markers: false,      // Set to true when debugging
        toggleActions: "play none reverse none"
      }
    });

    // Add the appropriate animation effect
    switch (this.effectType) {
      case 'right':
        tl.to(element, { x: '30vw', opacity: 0.2 });  // Use viewport units for more consistent behavior
        break;
      case 'left':
        tl.to(element, { x: '-30vw', opacity: 0.2 });
        break;
      case 'scale':
        tl.to(element, { scale: 0.6, opacity: 0.2 });
        break;
    }

    // Store the ScrollTrigger for cleanup
    this.scrollTriggers.push(tl.scrollTrigger);
  }

  ngOnDestroy(): void {
    // Proper cleanup of all ScrollTriggers
    this.scrollTriggers.forEach(trigger => {
      if (trigger) {
        trigger.kill();
      }
    });

    // Clear any animations on the element
    if (this.isBrowser && this.el?.nativeElement) {
      gsap.set(this.el.nativeElement, { clearProps: "all" });
    }
  }
}