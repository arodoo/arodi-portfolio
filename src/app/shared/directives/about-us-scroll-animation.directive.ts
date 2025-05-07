import { Directive, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';

@Directive({
  selector: '[appAboutUsScrollAnimation]',
  standalone: true
})
export class AboutUsScrollAnimationDirective implements OnInit, OnDestroy {
  @Input('appAboutUsScrollAnimation') animateFrom: 'left' | 'right' | null = 'right';
  // Removed exitTo input

  // Element state tracking
  private elementId: string = '';
  private isVisible = false;
  private isAnimating = false;

  // Browser and event handlers
  private isBrowser: boolean;
  private scrollHandler: any = null;
  private resizeHandler: any = null;
  private lastScrollY = 0;
  private scrollingDown = true;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.elementId = this.el.nativeElement.id || 'element';

    this.initializeAnimation();
    this.setupEventHandlers();
  }

  // ===== INITIALIZATION METHODS =====

  private initializeAnimation(): void {
    // All elements get entrance animation setup
    this.setupEntryState();
  }

  private setupEventHandlers(): void {
    if (!this.isBrowser) return;

    this.scrollHandler = () => {
      const currentScrollY = window.scrollY;
      this.scrollingDown = currentScrollY > this.lastScrollY;
      this.lastScrollY = currentScrollY;
      this.handleScrollUpdate();
    };

    this.resizeHandler = () => this.handleScrollUpdate();

    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    window.addEventListener('resize', this.resizeHandler, { passive: true });
  }

  // ===== ELEMENT TYPE DETECTION =====

  private isHeaderElement(): boolean {
    return this.elementId === 'about-heading' || this.elementId === 'intro-text';
  }

  private isTeamElement(): boolean {
    return this.elementId === 'editorial-team' || this.elementId === 'technical-team';
  }

  // ===== POSITION DETECTION =====

  private handleScrollUpdate(): void {
    if (this.isAnimating) return;

    // Get element visibility measurements
    const visibility = this.calculateVisibility();

    // Simplified handling - only check for entrance
    this.handleElementScroll(visibility);
  }

  private calculateVisibility() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate how much of the element is visible
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const visibleRatio = visibleHeight > 0 ? visibleHeight / rect.height : 0;

    // Determine the element's position relative to the viewport
    return {
      visibleRatio,
      isPartiallyVisible: visibleRatio > 0.1,
      isNearlyInvisible: visibleRatio < 0.1,
      isBelowViewport: rect.top > windowHeight * 0.8, // Bottom 20% of viewport
    };
  }

  // ===== SIMPLIFIED SCROLL HANDLER =====

  private handleElementScroll(visibility: any): void {
    // Only handle entrance animations
    if (!this.isVisible && visibility.isPartiallyVisible && this.animateFrom) {
      this.isVisible = true;
      this.playEntranceAnimation();
    }
    // Reset when scrolling up and element is below viewport
    else if (this.isVisible && visibility.isNearlyInvisible &&
      !this.scrollingDown && visibility.isBelowViewport) {
      this.isVisible = false;
      this.setupEntryState();
    }
  }

  // ===== ANIMATION STATE SETUP =====

  private setupEntryState(): void {
    if (!this.animateFrom) return;

    const isLeft = this.animateFrom === 'left';
    gsap.killTweensOf(this.el.nativeElement);

    gsap.set(this.el.nativeElement, {
      x: isLeft ? -100 : 100,
      opacity: 0,
      rotation: isLeft ? -20 : 20,
      scale: 0.9
    });
  }

  // ===== ANIMATION PLAYBACK =====

  private playEntranceAnimation(): void {
    if (!this.animateFrom || this.isAnimating) return;

    console.log(`Playing entrance animation for ${this.elementId} from ${this.animateFrom}`);

    this.isAnimating = true;
    gsap.killTweensOf(this.el.nativeElement);

    gsap.to(this.el.nativeElement, {
      x: 0,
      rotation: 0,
      opacity: 1,
      scale: 1,
      duration: this.isHeaderElement() ? 0.6 : 0.8,
      ease: "back.out(1.5)",
      onStart: () => console.log(`Animation started for ${this.elementId}`),
      onComplete: () => {
        console.log(`Animation completed for ${this.elementId}`);
        this.isAnimating = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      // Clean up event handlers
      if (this.scrollHandler) window.removeEventListener('scroll', this.scrollHandler);
      if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);

      // Kill any active animations
      gsap.killTweensOf(this.el.nativeElement);
    }
  }
}