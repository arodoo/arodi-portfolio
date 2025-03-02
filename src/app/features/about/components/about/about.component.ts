import { Component, Inject, OnInit, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AboutUsScrollAnimationDirective } from '../../../../shared/directives/about-us-scroll-animation.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, AboutUsScrollAnimationDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  private isBrowser: boolean;
  animationsEnabled = false;
  
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
    
    // Enable animations with a delay to ensure the page is fully rendered
    setTimeout(() => {
      this.animationsEnabled = true;
      this.cdr.detectChanges(); // Force update to ensure binding changes are applied
      console.log('Animations enabled, ready for scrolling');
      
      // Force a scroll event to check visibility
      setTimeout(() => {
        console.log('Dispatching scroll event');
        window.dispatchEvent(new Event('scroll'));
      }, 500);
    }, 1000);
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
