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
  private scrollTrigger: ScrollTrigger | null = null;

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

    // Setup the appropriate animation based on effect type
    this.setupScrollAnimation();
  }

  private setupScrollAnimation(): void {
    const element = this.el.nativeElement;
    const elementId = element.id || 'element';

    switch (this.effectType) {
      case 'right':
        this.createRightExitAnimation(element);
        break;
      case 'left':
        this.createLeftExitAnimation(element);
        break;
      case 'scale':
        this.createScaleAnimation(element);
        break;
    }
  }

  private createRightExitAnimation(element: HTMLElement): void {
    // Animation: Move to the right when scrolling down/away
    gsap.to(element, {
      x: '100%',
      opacity: 0,
      scrollTrigger: {
        trigger: element,
        start: 'top 20%', // Start when top of element is 20% from top of viewport
        end: 'top -30%',  // End when top of element is 30% above viewport
        scrub: 1,         // Smooth animation that follows scroll position with 1s lag
        toggleActions: 'play none reverse none' // Play on scroll down, reverse on scroll up
      }
    });
  }

  private createLeftExitAnimation(element: HTMLElement): void {
    // Animation: Move to the left when scrolling down/away
    gsap.to(element, {
      x: '-100%',
      opacity: 0,
      scrollTrigger: {
        trigger: element,
        start: 'top 20%',
        end: 'top -30%',
        scrub: 1,
        toggleActions: 'play none reverse none'
      }
    });
  }

  private createScaleAnimation(element: HTMLElement): void {
    // Animation: Scale down when scrolling down/away
    gsap.to(element, {
      scale: 0.1,
      opacity: 0,
      scrollTrigger: {
        trigger: element,
        start: 'top 20%',
        end: 'top -30%',
        scrub: 1,
        toggleActions: 'play none reverse none'
      }
    });
  }

  ngOnDestroy(): void {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }
  }
}