import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Directive({
  selector: '[appServicesCardsScrollAnimation]',
  standalone: true
})
export class ServicesCardsScrollAnimationDirective implements OnInit, OnDestroy {
  @Input() cards: any[] = [];
  @Input() visibleCards = 3; // Default number of visible cards at once

  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private cardElements: HTMLElement[] = [];
  private cardWidth = 0;
  private timeline: gsap.core.Timeline | null = null;
  private scrollTrigger: ScrollTrigger | null = null;
  private resizeObserver: ResizeObserver | null = null;

  ngOnInit(): void {
    if (!this.isBrowser) return;

    gsap.registerPlugin(ScrollTrigger);

    // Wait for DOM to be ready
    setTimeout(() => {
      this.setupAnimation();
      this.setupResizeObserver();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }
    if (this.timeline) {
      this.timeline.kill();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private setupResizeObserver(): void {
    if (!this.isBrowser) return;

    this.resizeObserver = new ResizeObserver(() => {
      // Kill existing animations on resize
      if (this.scrollTrigger) {
        this.scrollTrigger.kill();
      }
      if (this.timeline) {
        this.timeline.kill();
      }

      // Update visible cards based on screen width
      const width = window.innerWidth;
      if (width < 576) {
        this.visibleCards = 1;
      } else if (width < 992) {
        this.visibleCards = 2;
      } else {
        this.visibleCards = 3;
      }

      this.setupAnimation();
    });

    this.resizeObserver.observe(this.el.nativeElement);
  }

  private setupAnimation(): void {
    this.cardElements = Array.from(this.el.nativeElement.querySelectorAll('.service-card-wrapper'));
    if (this.cardElements.length === 0) return;

    // Calculate container dimensions
    const containerWidth = this.el.nativeElement.offsetWidth;
    this.cardWidth = containerWidth / this.visibleCards;

    // Set initial positions and visibility
    gsap.set(this.cardElements, {
      x: containerWidth, // Start off-screen right
      opacity: 0,
      visibility: 'visible'
    });

    // Create timeline
    this.timeline = gsap.timeline({
      defaults: { duration: 0.5, ease: "power2.inOut" }
    });

    // Initial state - first set of cards appear
    const initialCards = Math.min(this.visibleCards, this.cardElements.length);
    for (let i = 0; i < initialCards; i++) {
      this.timeline.to(this.cardElements[i], {
        x: i * this.cardWidth,
        opacity: 1
      }, i * 0.1);
    }

    // Cycle through remaining cards
    if (this.cardElements.length > this.visibleCards) {
      for (let i = this.visibleCards; i < this.cardElements.length; i++) {
        // Create a label for this section
        this.timeline.addLabel(`card${i}`, ">");

        // Move first visible card out left
        this.timeline.to(this.cardElements[i - this.visibleCards], {
          x: -this.cardWidth,
          opacity: 0
        }, `card${i}`);

        // Shift other visible cards
        for (let j = i - this.visibleCards + 1; j < i; j++) {
          this.timeline.to(this.cardElements[j], {
            x: (j - (i - this.visibleCards + 1)) * this.cardWidth
          }, `card${i}`);
        }

        // Bring new card in
        this.timeline.to(this.cardElements[i], {
          x: (this.visibleCards - 1) * this.cardWidth,
          opacity: 1
        }, `card${i}`);
      }
    }

    // Add final pause
    this.timeline.addLabel("end", "+=0.5");

    // Set up ScrollTrigger with pinning
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.el.nativeElement.parentElement, // Target parent section
      start: "top center",
      end: `+=300%`, // Extend scroll area to give enough room for animation
      pin: true, // Pin the section in place during animation
      animation: this.timeline,
      scrub: true, // Smooth scrubbing
      anticipatePin: 1, // Helps with smoother pin initialization
      pinSpacing: true // Create space for the pinned element
    });
  }
}