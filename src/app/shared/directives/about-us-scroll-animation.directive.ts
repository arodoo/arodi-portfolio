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
  private elementId: string = '';

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    
    this.elementId = this.getElementId();
    
    if (this.animateFrom) {
      this.setupAnimation();
    }
  }
  
  private getElementId(): string {
    const element = this.el.nativeElement;
    
    if (element.id) {
      return element.id;
    }
    
    if (element.classList && element.classList.length > 0) {
      return Array.from(element.classList).join('-');
    }
    
    return element.tagName?.toLowerCase() || 'element';
  }
  
  ngOnChanges(changes: SimpleChanges): void {
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
    this.setInitialState();
    
    setTimeout(() => {
      this.createIntersectionObserver();
    }, 300);
  }

  private forceStopAnimation(): void {
    if (this.currentAnimation) {
      this.currentAnimation.kill();
      this.currentAnimation = null;
    }
    
    gsap.killTweensOf(this.el.nativeElement);
  }

  private setInitialState(): void {
    if (!this.animateFrom) return;
    
    this.forceStopAnimation();
    
    const isLeft = this.animateFrom === 'left';
    
    gsap.set(this.el.nativeElement, { 
      x: isLeft ? -80 : 80,
      opacity: 0,
      rotation: isLeft ? -20 : 20,
      scale: 0.9
    });
  }

  private createIntersectionObserver(): void {
    if (!this.animateFrom || this.observer) return;
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Element entering viewport
        if (entry.isIntersecting && !this.isInView && this.animationAllowed) {
          this.isInView = true;
          this.animateElement();
        } 
        // Element leaving viewport
        else if (!entry.isIntersecting && this.isInView) {
          this.isInView = false;
          
          this.animationAllowed = false;
          
          setTimeout(() => {
            this.setInitialState();
            this.animationAllowed = true;
          }, 100);
        }
      });
    }, { 
      threshold: [0.1],
      rootMargin: '0px 0px -10% 0px'
    });
    
    this.observer.observe(this.el.nativeElement);
  }

  private animateElement(): void {
    if (!this.animateFrom) return;
    
    this.forceStopAnimation();
    
    const animationConfig = this.getAnimationConfigForElement();
    
    this.currentAnimation = gsap.to(this.el.nativeElement, {
      x: 0,
      rotation: 0,
      opacity: 1,
      scale: 1,
      duration: animationConfig.duration,
      ease: animationConfig.ease,
      onComplete: () => {
        this.currentAnimation = null;
      }
    });
  }

  private getAnimationConfigForElement(): { duration: number, ease: string } {
    let config = {
      duration: 1,
      ease: "back.out(1.7)"
    };
    
    if (this.elementId === 'editorial-team') {
      config.duration = 1.2;
    } else if (this.elementId === 'technical-team') {
      config.duration = 0.9;
      config.ease = "power3.out";
    }
    
    return config;
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.forceStopAnimation();
      
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    }
  }
}
