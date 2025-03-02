import { Directive, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';

@Directive({
  selector: '[appAboutUsScrollAnimation]',
  standalone: true
})
export class AboutUsScrollAnimationDirective implements OnInit, OnDestroy {
  @Input('appAboutUsScrollAnimation') animateFrom: 'left' | 'right' | null = 'right';
  @Input() exitTo: 'left' | 'right' | null = null;
  
  // Element state tracking
  private elementId: string = '';
  private isVisible = false;
  private hasExited = false;
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
    
    // Very important log to debug if the directive is being attached properly
    console.log(`Animation directive attached to ${this.elementId} with direction: ${this.animateFrom}`);
    
    this.initializeAnimation();
    this.setupEventHandlers();
    
    // Immediately check visibility instead of waiting
    this.handleScrollUpdate();
  }
  
  // ===== INITIALIZATION METHODS =====
  
  private initializeAnimation(): void {
    // Initial setup based on element type
    if (this.isHeaderElement()) {
      // Headers only have exit animations - no setup required
    } else if (this.isTeamElement()) {
      // Team cards need entrance animation setup
      this.setupEntryState();
    }
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
    
    // Initial check after DOM has settled
    setTimeout(() => this.handleScrollUpdate(), 500);
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
    
    // Choose the right handler based on element type
    if (this.isHeaderElement()) {
      this.handleHeaderElementScroll(visibility);
    } else if (this.isTeamElement()) {
      this.handleTeamElementScroll(visibility);
    }
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
      isFullyVisible: visibleRatio >= 0.95,
      isPartiallyVisible: visibleRatio > 0.1,
      isNearlyInvisible: visibleRatio < 0.1,
      isAboveViewport: rect.bottom < windowHeight * 0.2, // Top 20% of viewport
      isBelowViewport: rect.top > windowHeight * 0.8, // Bottom 20% of viewport
      rect
    };
  }
  
  // ===== ELEMENT-SPECIFIC SCROLL HANDLERS =====
  
  private handleHeaderElementScroll(visibility: any): void {
    // CASE: Header is leaving viewport while scrolling down - play exit animation
    if (this.isVisible && visibility.isNearlyInvisible && this.scrollingDown && 
        visibility.isAboveViewport && this.exitTo) {
      this.isVisible = false;
      this.hasExited = true;
      this.playExitAnimation();
    }
    // CASE: Header is entering viewport while scrolling up after exiting - play reverse animation
    else if (!this.isVisible && visibility.isPartiallyVisible && !this.scrollingDown && 
             this.hasExited && this.exitTo) {
      this.isVisible = true;
      this.hasExited = false;
      this.playReverseExitAnimation();
    }
  }
  
  private handleTeamElementScroll(visibility: any): void {
    // CASE: Team element is entering viewport - play entrance animation
    if (!this.isVisible && visibility.isPartiallyVisible && this.animateFrom) {
      this.isVisible = true;
      this.playEntranceAnimation();
    }
    // CASE: Team element is leaving viewport downward while scrolling up - reset for next entrance
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
  
  private playExitAnimation(): void {
    if (!this.exitTo || this.isAnimating) return;
    
    this.isAnimating = true;
    gsap.killTweensOf(this.el.nativeElement);
    
    const isLeft = this.exitTo === 'left';
    gsap.to(this.el.nativeElement, {
      x: isLeft ? -120 : 120,
      opacity: 0,
      rotation: isLeft ? -15 : 15,
      scale: 0.9,
      duration: this.isHeaderElement() ? 0.5 : 0.7,
      ease: "power2.in",
      onComplete: () => {
        this.isAnimating = false;
      }
    });
  }
  
  private playReverseExitAnimation(): void {
    if (!this.exitTo || this.isAnimating) return;
    
    const isLeft = this.exitTo === 'left';
    
    // Set to exited state before animating
    gsap.set(this.el.nativeElement, {
      x: isLeft ? -120 : 120,
      opacity: 0,
      rotation: isLeft ? -15 : 15,
      scale: 0.9
    });
    
    this.isAnimating = true;
    gsap.to(this.el.nativeElement, {
      x: 0,
      rotation: 0,
      opacity: 1,
      scale: 1,
      duration: 0.7,
      ease: "power2.out",
      onComplete: () => {
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
