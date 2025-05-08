import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AboutUsScrollAnimationLeavingDirective } from '../../../shared/directives/about-us/about-us-scroll-animation-leaving.directive';
import { AboutUsScrollAnimationDirective } from '../../../shared/directives/about-us/about-us-scroll-animation.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, 
    AboutUsScrollAnimationDirective,
    AboutUsScrollAnimationLeavingDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  private isBrowser: boolean;
  animationsEnabled = false;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object
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
    this.animationsEnabled = true;
  }
}