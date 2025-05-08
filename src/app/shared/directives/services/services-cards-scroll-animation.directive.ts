import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Directive that creates a scroll-driven animation for service cards.
 * As the user scrolls, cards enter from the right, shift left, and exit to the left.
 * The animation has three phases:
 * 1. Entry: Initial cards appear from right to left
 * 2. Cycling: Additional cards enter as earlier cards exit
 * 3. Exit: All remaining cards leave the viewport
 */
@Directive({
  selector: '[appServicesCardsScrollAnimation]',
  standalone: true
})
export class ServicesCardsScrollAnimationDirective implements OnInit, OnDestroy {
  /** Array of card data to be animated */
  @Input() cards: any[] = [];

  /** Number of cards visible at once (responsive) */
  @Input() visibleCards = 3;

  // Dependencies and private properties
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Animation-related properties
  private cardElements: HTMLElement[] = [];
  private cardWidth = 0;
  private timeline: gsap.core.Timeline | null = null;
  private scrollTrigger: ScrollTrigger | null = null;
  private resizeObserver: ResizeObserver | null = null;

  /**
   * Initialize the animation when the component is ready
   */
  ngOnInit(): void {
    if (!this.isBrowser) return;

    gsap.registerPlugin(ScrollTrigger);

    // Wait for DOM to be ready
    setTimeout(() => {
      this.setupAnimation();
      this.setupResizeObserver();
    }, 100);
  }

  /**
   * Clean up all resources when component is destroyed
   */
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

  /**
   * Set up responsive behavior by updating animation on window resize
   */
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
      this.updateResponsiveCardCount();
      this.setupAnimation();
    });

    this.resizeObserver.observe(this.el.nativeElement);
  }

  /**
   * Update the number of visible cards based on screen width
   */
  private updateResponsiveCardCount(): void {
    const width = window.innerWidth;
    if (width < 576) {
      this.visibleCards = 1;      // Mobile view: 1 card
    } else if (width < 992) {
      this.visibleCards = 2;      // Tablet view: 2 cards
    } else {
      this.visibleCards = 3;      // Desktop view: 3 cards
    }
  }

  /**
   * Main method to set up the scroll-driven animation
   */
  private setupAnimation(): void {
    // Get card elements
    this.cardElements = Array.from(this.el.nativeElement.querySelectorAll('.service-card-wrapper'));
    if (this.cardElements.length === 0) return;

    // Calculate dimensions
    this.calculateCardDimensions();

    // Set up initial card positions
    this.setInitialCardPositions();

    // Create the GSAP timeline
    this.createAnimationTimeline();

    // Set up ScrollTrigger
    this.createScrollTrigger();
  }

  /**
   * Calculate dimensions for card positioning
   */
  private calculateCardDimensions(): void {
    const containerWidth = this.el.nativeElement.offsetWidth;
    this.cardWidth = containerWidth / this.visibleCards;
  }

  /**
   * Set initial positions and visibility for all cards
   */
  private setInitialCardPositions(): void {
    const containerWidth = this.el.nativeElement.offsetWidth;
    gsap.set(this.cardElements, {
      x: containerWidth, // Start off-screen right
      opacity: 0,
      visibility: 'visible'
    });
  }

  /**
   * Create the main animation timeline with entry, cycling and exit phases
   */
  private createAnimationTimeline(): void {
    const containerWidth = this.el.nativeElement.offsetWidth;

    // Create timeline with defaults
    this.timeline = gsap.timeline({
      defaults: { duration: 0.5, ease: "power2.inOut" }
    });

    // ---- PHASE 1: ENTRY ANIMATION ----
    this.createEntryAnimations();

    // ---- PHASE 2: CYCLING ANIMATION ----
    if (this.cardElements.length > this.visibleCards) {
      this.createCyclingAnimations();
    }

    // ---- PHASE 3: EXIT ANIMATION ----
    this.createExitAnimations(containerWidth);

    // Add final pause
    this.timeline.addLabel("end", "+=0.2");
  }

  /**
   * Create animations for initial cards entering the viewport
   */
  private createEntryAnimations(): void {
    const initialCards = Math.min(this.visibleCards, this.cardElements.length);

    for (let i = 0; i < initialCards; i++) {
      // Use ! non-null assertion to assure TypeScript that timeline is not null
      this.timeline!.to(this.cardElements[i], {
        x: i * this.cardWidth,
        opacity: 1
      }, i * 0.1); // Stagger the entrance
    }
  }

  /**
   * Create animations for additional cards cycling through
   */
  private createCyclingAnimations(): void {
    for (let i = this.visibleCards; i < this.cardElements.length; i++) {
      // Create a label for this section
      this.timeline!.addLabel(`card${i}`, ">");

      // Move first visible card out left
      this.timeline!.to(this.cardElements[i - this.visibleCards], {
        x: -this.cardWidth,
        opacity: 0
      }, `card${i}`);

      // Shift other visible cards
      for (let j = i - this.visibleCards + 1; j < i; j++) {
        this.timeline!.to(this.cardElements[j], {
          x: (j - (i - this.visibleCards + 1)) * this.cardWidth
        }, `card${i}`);
      }

      // Bring new card in
      this.timeline!.to(this.cardElements[i], {
        x: (this.visibleCards - 1) * this.cardWidth,
        opacity: 1
      }, `card${i}`);
    }
  }

  /**
   * Create animations for all cards exiting the viewport
   */
  private createExitAnimations(containerWidth: number): void {
    this.timeline!.addLabel("exitSequence", ">");

    // First, handle the last visible cards
    const lastVisibleIndex = Math.min(this.cardElements.length, this.cardElements.length) - 1;
    const firstVisibleIndex = Math.max(0, lastVisibleIndex - this.visibleCards + 1);

    // Remove cards right to left (3,2,1 sequence)
    for (let i = lastVisibleIndex; i >= firstVisibleIndex; i--) {
      this.timeline!.to(this.cardElements[i], {
        x: containerWidth,
        opacity: 0,
        duration: 0.5
      }, `exitSequence+=${(lastVisibleIndex - i) * 0.1}`);
    }
  }

  /**
   * Set up ScrollTrigger to control the animation based on scrolling
   */
  private createScrollTrigger(): void {
    // Use non-null assertion since we know timeline exists at this point
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.el.nativeElement.parentElement,
      start: "center center",
      end: `+=500%`,
      pin: true,
      animation: this.timeline!,  // Use non-null assertion to fix the type error
      scrub: 1.5,
    });
  }
}