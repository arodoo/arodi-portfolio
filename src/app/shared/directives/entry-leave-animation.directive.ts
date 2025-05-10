import { Directive, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Directive({
  selector: '[appSeparatorAnimation]',
  standalone: true
})
export class EntryLeaveAnimationDirective implements OnInit, OnDestroy {
  private isBrowser: boolean;
  private scrollTriggers: any[] = [];
  private resizeHandler: any = null;
  private loadHandler: any = null;
  private refreshTimeout: any = null;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: false });

    this.resizeHandler = this.onResize.bind(this);
    window.addEventListener('resize', this.resizeHandler);
    window.addEventListener('orientationchange', this.resizeHandler);

    if (document.readyState === 'complete') {
      this.initScrollAnimation();
    } else {
      this.loadHandler = () => this.initScrollAnimation();
      window.addEventListener('load', this.loadHandler);
    }
  }

  private initScrollAnimation(): void {
    this.clearScrollTriggers();

    setTimeout(() => {
      this.setupScrollAnimation();

      this.refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 1000);
    }, 300);
  }

  private setupScrollAnimation(): void {
    const element = this.el.nativeElement;
    const contentContainer = element.querySelector('.content-container');

    // Target the content container for animation
    if (!contentContainer) return;

    // Set initial state
    gsap.set(contentContainer, {
      scale: 0,
      opacity: 0,
      transformOrigin: 'center center'
    });

    // Create a timeline that will be controlled by scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "center center", // Pin when the center of element reaches center of viewport
        endTrigger: element,
        end: "+=100%", // End after scrolling 100% of viewport height
        pin: true,
        pinSpacing: true,
        scrub: 1,
        markers: false,
        anticipatePin: 1,
        pinReparent: true // This helps with proper centering
      }
    });

    // Add animation to timeline
    tl.to(contentContainer, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    })
      .to({}, { duration: 0.5 }) // Hold state for a moment
      .to(contentContainer, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in"
      });

    // Store the ScrollTrigger instance
    this.scrollTriggers.push(tl.scrollTrigger);
    ScrollTrigger.refresh(true);
  }

  private clearScrollTriggers(): void {
    this.scrollTriggers.forEach(trigger => {
      if (trigger) trigger.kill();
    });
    this.scrollTriggers = [];

    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  private onResize(): void {
    this.clearScrollTriggers();
    gsap.set(this.el.nativeElement.querySelector('.content-container'), { clearProps: "all" });

    setTimeout(() => {
      this.setupScrollAnimation();
    }, 300);
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      window.removeEventListener('resize', this.resizeHandler);
      window.removeEventListener('orientationchange', this.resizeHandler);
      if (this.loadHandler) {
        window.removeEventListener('load', this.loadHandler);
      }
    }

    this.clearScrollTriggers();

    if (this.isBrowser && this.el?.nativeElement) {
      gsap.set(this.el.nativeElement, { clearProps: "all" });
    }
  }
}