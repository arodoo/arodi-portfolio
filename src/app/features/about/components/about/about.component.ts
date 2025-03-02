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
    
    // Enable animations with a delay to ensure the page is fully rendered
    setTimeout(() => {
      this.animationsEnabled = true;
      this.cdr.detectChanges();
      
      // Force a scroll event to check visibility
      setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
      }, 500);
    }, 1000);
  }
}
