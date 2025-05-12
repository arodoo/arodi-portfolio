import { Directive, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Directive({
  selector: '[appAboutUsScrollAnimation]',
  standalone: true
})
export class AboutUsScrollAnimationDirective implements OnInit, OnDestroy {
  @Input('appAboutUsScrollAnimation') animateFrom: 'left' | 'right' | null = 'right';

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
  private scrollTrigger: any = null;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.elementId = this.el.nativeElement.id || 'element';

    // Use ScrollTrigger for mobile, original logic for desktop
    if (window.innerWidth < 768) {
      gsap.registerPlugin(ScrollTrigger);
      this.setupMobileAnimation();
    } else {
      this.setupEntryState();
      this.setupEventHandlers();
    }
  }

  private setupMobileAnimation(): void {
    const element = this.el.nativeElement;
    const isHeaderElement = this.isHeaderElement();
    const isLeft = this.animateFrom === 'left';

    // Set initial state
    gsap.set(element, {
      x: isLeft ? -100 : 100,
      opacity: 0,
      rotation: isLeft ? -20 : 20,
      scale: 0.9
    });

    // Create scroll trigger with more conservative values for mobile
    this.scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start: "top 90%", 
      markers: false, 
      once: true,
      onEnter: () => {
        gsap.delayedCall(0.1, () => {
          gsap.to(element, {
            x: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            duration: isHeaderElement ? 0.6 : 0.8,
            ease: "back.out(1.5)"
          });
        });
      }
    });
  }

  // Keep all original desktop methods unchanged
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

  private isHeaderElement(): boolean {
    return this.elementId === 'about-heading' || this.elementId === 'intro-text';
  }

  private handleScrollUpdate(): void {
    if (this.isAnimating) return;
    const visibility = this.calculateVisibility();
    this.handleElementScroll(visibility);
  }

  private calculateVisibility() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const visibleRatio = visibleHeight > 0 ? visibleHeight / rect.height : 0;

    return {
      visibleRatio,
      isPartiallyVisible: visibleRatio > 0.1,
      isNearlyInvisible: visibleRatio < 0.1,
      isBelowViewport: rect.top > windowHeight * 0.8,
    };
  }

  private handleElementScroll(visibility: any): void {
    if (!this.isVisible && visibility.isPartiallyVisible && this.animateFrom) {
      this.isVisible = true;
      this.playEntranceAnimation();
    }
    else if (this.isVisible && visibility.isNearlyInvisible &&
      !this.scrollingDown && visibility.isBelowViewport) {
      this.isVisible = false;
      this.setupEntryState();
    }
  }

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

  private playEntranceAnimation(): void {
    if (!this.animateFrom || this.isAnimating) return;

    this.isAnimating = true;
    gsap.killTweensOf(this.el.nativeElement);

    gsap.to(this.el.nativeElement, {
      x: 0,
      rotation: 0,
      opacity: 1,
      scale: 1,
      duration: this.isHeaderElement() ? 0.6 : 0.8,
      ease: "back.out(1.5)",
      onComplete: () => {
        this.isAnimating = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      if (this.scrollHandler) window.removeEventListener('scroll', this.scrollHandler);
      if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
      if (this.scrollTrigger) this.scrollTrigger.kill();
      gsap.killTweensOf(this.el.nativeElement);
    }
  }
}