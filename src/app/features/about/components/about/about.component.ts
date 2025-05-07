import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AboutUsScrollAnimationDirective } from '../../../../shared/directives/about-us-scroll-animation.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, AboutUsScrollAnimationDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit, OnDestroy {
  private isBrowser: boolean;
  animationsEnabled = false;
  private scrollListener: any = null;
  
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  
  team = [
    {
      name: 'Editorial Team',
      description: 'Curating and reviewing poetry submissions',
      icon: 'fa-edit'
    },
    {
      name: 'Community Team',
      description: 'Building and nurturing our poetry community',
      icon: 'fa-users'
    },
    {
      name: 'Technical Team',
      description: 'Maintaining and improving the platform',
      icon: 'fa-cog'
    }
  ];
  
  ngOnInit() {
    if (!this.isBrowser) return;
    
    console.log('About component initialized, setting up animations');
    
    this.setupDebugPanel();
    
    this.animationsEnabled = true;
    
    setTimeout(() => {
      this.updateDebugState('Animations active - ready for scrolling');
    }, 500);
  }
  
  private setupDebugPanel(): void {
    this.scrollListener = () => {
      this.updateScrollDebugPanel();
    };
    
    window.addEventListener('scroll', this.scrollListener, { passive: true });
    window.addEventListener('resize', this.scrollListener, { passive: true });
    
    // Initial update
    this.updateScrollDebugPanel();
  }
  
  private updateScrollDebugPanel(): void {
    const scrollY = window.scrollY;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const scrollPositionEl = document.getElementById('debug-scroll-position');
    const viewportSizeEl = document.getElementById('debug-viewport-size');
    
    if (scrollPositionEl) {
      scrollPositionEl.textContent = `Scroll: ${scrollY}px`;
    }
    
    if (viewportSizeEl) {
      viewportSizeEl.textContent = `Viewport: ${viewportWidth}px x ${viewportHeight}px`;
    }
  }
  
  private updateDebugState(state: string): void {
    const stateEl = document.getElementById('debug-animation-state');
    if (stateEl) {
      stateEl.textContent = `State: ${state}`;
    }
  }
  
  ngOnDestroy(): void {
    // Clean up event listeners
    if (this.isBrowser && this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
      window.removeEventListener('resize', this.scrollListener);
    }
  }
  
  // Add a helper method to debug
  isElementInViewport(el: HTMLElement): boolean {
    if (!this.isBrowser) return false;
    
    const rect = el.getBoundingClientRect();
    const isVisible = (
      rect.top <= window.innerHeight &&
      rect.bottom >= 0
    );
    console.log('Visibility check:', el.tagName, isVisible);
    return isVisible;
  }
}
