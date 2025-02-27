import { Directive, ElementRef, Inject, Input, OnChanges, OnDestroy, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';

@Directive({
  selector: '[appAboutUsScrollAnimation]',
  standalone: true
})
export class AboutUsScrollAnimationDirective implements OnInit, OnChanges, OnDestroy {
  @Input('appAboutUsScrollAnimation') animateFrom: 'left' | 'right' | null = 'right';
  
  private observer: IntersectionObserver | null = null;
  private isBrowser: boolean;
  private isInView = false;
  private isSetup = false;
  private currentAnimation: gsap.core.Tween | null = null;
  private animationAllowed = true;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    
    // Set initial state immediately
    if (this.animateFrom) {
      this.setupAnimation();
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // React when animation direction is changed (from null to actual direction)
    if (changes['animateFrom'] && 
        this.isBrowser && 
        this.animateFrom && 
        !this.isSetup) {
      this.setupAnimation();
    }
  }
  
  private setupAnimation(): void {
    if (this.isSetup) return;
    
    this.isSetup = true;
    
    // Set initial hidden state
    this.setInitialState();
    
    // Create observer after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.createIntersectionObserver();
    }, 300);
  }

  private forceStopAnimation(): void {
    // Kill any existing animations on this element
    if (this.currentAnimation) {
      this.currentAnimation.kill();
      this.currentAnimation = null;
    }
    
    // Kill any animations that might be on this element
    gsap.killTweensOf(this.el.nativeElement);
  }

  private setInitialState(): void {
    if (!this.animateFrom) return;
    
    // First stop any running animations
    this.forceStopAnimation();
    
    const isLeft = this.animateFrom === 'left';
    
    // Set initial state explicitly with direct values
    gsap.set(this.el.nativeElement, { 
      x: isLeft ? -80 : 80,
      opacity: 0,
      rotation: isLeft ? -20 : 20,
      scale: 0.9
    });
    
    console.log(`Initial state set for ${this.animateFrom} animation`);
  }

  private createIntersectionObserver(): void {
    if (!this.animateFrom || this.observer) return;
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Element entering viewport
        if (entry.isIntersecting && !this.isInView && this.animationAllowed) {
          this.isInView = true;
          console.log(`Element entered view - playing animation ${this.animateFrom}`);
          this.animateElement();
        } 
        // Element leaving viewport
        else if (!entry.isIntersecting && this.isInView) {
          this.isInView = false;
          console.log(`Element left view - will reset ${this.animateFrom}`);
          
          // Allow a short delay before resetting
          this.animationAllowed = false;
          
          // Reset state with a slight delay to ensure complete exit
          setTimeout(() => {
            this.setInitialState();
            this.animationAllowed = true;
            console.log(`Reset completed for ${this.animateFrom}, ready for next animation`);
          }, 100);
        }
      });
    }, { 
      threshold: [0.1],
      rootMargin: '0px 0px -10% 0px'
    });
    
    // Start observing
    this.observer.observe(this.el.nativeElement);
  }

  private animateElement(): void {
    if (!this.animateFrom) return;
    
    // First ensure no animations are running
    this.forceStopAnimation();
    
    // Create and store the animation
    this.currentAnimation = gsap.to(this.el.nativeElement, {
      x: 0,
      rotation: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "back.out(1.7)",
      onComplete: () => {
        console.log(`Animation completed for ${this.animateFrom}`);
        // Clean up reference after animation is done
        this.currentAnimation = null;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      // Kill any active animations
      this.forceStopAnimation();
      
      // Disconnect observer
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    }
  }
}
