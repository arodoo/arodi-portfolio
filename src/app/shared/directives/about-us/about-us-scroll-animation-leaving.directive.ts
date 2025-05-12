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
  private loadHandler: any = null;

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

      // Second refresh after delay - critical for positioning
      this.refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 1000);
    }, 300);
  }

  private setupScrollAnimation(): void {
    const element = this.el.nativeElement;
    const isMobile = this.isMobileDevice();

    gsap.set(element, { clearProps: "all" });

    if (isMobile) {
      const initialProps = { x: 0, opacity: 1, scale: 1 };

      const trigger = ScrollTrigger.create({
        trigger: element,
        start: "top 80%",
        end: "bottom 30%",
        markers: false,
        invalidateOnRefresh: true, // Critical for proper refresh handling
        onLeave: () => {
          switch (this.effectType) {
            case 'right':
              gsap.to(element, { x: '15vw', opacity: 0, duration: 0.4 });
              break;
            case 'left':
              gsap.to(element, { x: '-15vw', opacity: 0, duration: 0.4 });
              break;
            case 'scale':
              gsap.to(element, { scale: 0.8, opacity: 0, duration: 0.4 });
              break;
          }
        },
        onEnterBack: () => {
          gsap.to(element, { ...initialProps, duration: 0.3 });
        }
      });

      this.scrollTriggers.push(trigger);
    } else {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top 35%",
          end: "bottom 5%",
          scrub: 1,
          markers: false,
          invalidateOnRefresh: true,
          toggleActions: "play none reverse none"
        }
      });

      switch (this.effectType) {
        case 'right':
          tl.to(element, { x: '30vw', opacity: 0.2, ease: "power1.inOut" });
          break;
        case 'left':
          tl.to(element, { x: '-30vw', opacity: 0.2, ease: "power1.inOut" });
          break;
        case 'scale':
          tl.to(element, { scale: 0.6, opacity: 0.2, ease: "power1.inOut" });
          break;
      }

      this.scrollTriggers.push(tl.scrollTrigger);
    }

    // Critical refresh for position calculation
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

  private isMobileDevice(): boolean {
    if (!this.isBrowser) return false;
    return window.innerWidth < 768;
  }

  private onResize(): void {
    this.clearScrollTriggers();
    gsap.set(this.el.nativeElement, { clearProps: "all" });

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