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
  private scrollTriggers: any[] = [];
  private resizeHandler: any = null;
  private refreshTimeout: any = null;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Configure ScrollTrigger for proper mobile behavior
    ScrollTrigger.config({
      ignoreMobileResize: false
    });

    // Setup resize handler
    this.resizeHandler = this.onResize.bind(this);
    window.addEventListener('resize', this.resizeHandler);
    window.addEventListener('orientationchange', this.resizeHandler);

    // Wait for COMPLETE page load, not just DOM ready
    // This is critical for refresh scenarios
    if (document.readyState === 'complete') {
      this.initScrollAnimation();
    } else {
      window.addEventListener('load', () => this.initScrollAnimation());
    }
  }

  private initScrollAnimation(): void {
    // Clear any existing setup first
    this.clearScrollTriggers();
    
    // Short initial delay to ensure all images and styles are applied
    setTimeout(() => {
      this.setupScrollAnimation();
      
      // Add a second refresh after a longer delay for persistent issues
      this.refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 1000);
    }, 300);
  }

  private setupScrollAnimation(): void {
    const element = this.el.nativeElement;
    const isMobile = this.isMobileDevice();

    // Clean up existing animations
    gsap.set(element, { clearProps: "all" });

    // Fix for mobile: use simple positional values
    if (isMobile) {
      // MOBILE SPECIFIC IMPLEMENTATION
      // Important: Use invalidateOnRefresh to handle refresh issues
      
      // Step 1: Get initial position for later restoration
      const initialProps = {
        x: 0,
        opacity: 1,
        scale: 1
      };

      // Step 2: Create a simpler ScrollTrigger without GSAP timeline
      const trigger = ScrollTrigger.create({
        trigger: element,
        // Use viewport-relative positioning that's more resilient to reloads
        start: () => `top+=${window.scrollY} bottom`, 
        end: () => `bottom+=${window.scrollY} top+=100`,
        markers: true,
        invalidateOnRefresh: true, // Critical for handling refresh
        onEnter: () => {
          // Do nothing on enter - stay in normal state
        },
        onLeave: () => {
          // Animate out when element leaves viewport
          switch (this.effectType) {
            case 'right':
              gsap.to(element, { x: '5vw', opacity: 0.5, duration: 0.3 });
              break;
            case 'left':
              gsap.to(element, { x: '-5vw', opacity: 0.5, duration: 0.3 });
              break;
            case 'scale':
              gsap.to(element, { scale: 0.95, opacity: 0.5, duration: 0.3 });
              break;
          }
        },
        onEnterBack: () => {
          // Animate back to normal when scrolling back up
          gsap.to(element, { ...initialProps, duration: 0.3 });
        },
        onLeaveBack: () => {
          // Do nothing when element leaves viewport while scrolling up
        }
      });

      // Store for cleanup
      this.scrollTriggers.push(trigger);

    } else {
      // DESKTOP IMPLEMENTATION
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top 60%",
          end: "bottom 20%",
          scrub: 1,
          markers: true,
          invalidateOnRefresh: true, // Critical for handling refresh
          toggleActions: "play none reverse none"
        }
      });

      // Desktop animation
      switch (this.effectType) {
        case 'right':
          tl.to(element, {
            x: '30vw',
            opacity: 0.2,
            ease: "power1.inOut"
          });
          break;
        case 'left':
          tl.to(element, {
            x: '-30vw',
            opacity: 0.2,
            ease: "power1.inOut"
          });
          break;
        case 'scale':
          tl.to(element, {
            scale: 0.6,
            opacity: 0.2,
            ease: "power1.inOut"
          });
          break;
      }

      // Store for cleanup
      this.scrollTriggers.push(tl.scrollTrigger);
    }

    // Force ScrollTrigger to recalculate all positions
    ScrollTrigger.refresh(true);
  }

  private clearScrollTriggers(): void {
    // Kill existing scroll triggers
    this.scrollTriggers.forEach(trigger => {
      if (trigger) trigger.kill();
    });
    this.scrollTriggers = [];
    
    // Clear any pending refresh
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  private isMobileDevice(): boolean {
    if (!this.isBrowser) return false;
    return window.innerWidth < 768;
  }

  private onResize(): void {
    this.clearScrollTriggers();
    
    // Reset element to normal state
    gsap.set(this.el.nativeElement, { clearProps: "all" });
    
    // Re-initialize with delay
    setTimeout(() => {
      this.setupScrollAnimation();
    }, 300);
  }

  ngOnDestroy(): void {
    // Clean up
    if (this.isBrowser) {
      window.removeEventListener('resize', this.resizeHandler);
      window.removeEventListener('orientationchange', this.resizeHandler);
      window.removeEventListener('load', this.initScrollAnimation);
    }

    this.clearScrollTriggers();

    if (this.isBrowser && this.el?.nativeElement) {
      gsap.set(this.el.nativeElement, { clearProps: "all" });
    }
  }
}