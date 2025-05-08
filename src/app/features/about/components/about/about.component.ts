import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AboutUsScrollAnimationLeavingDirective } from '../../../../shared/directives/about-us/about-us-scroll-animation-leaving.directive';
import { AboutUsScrollAnimationDirective } from '../../../../shared/directives/about-us/about-us-scroll-animation.directive';

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
      name: 'Build Slowly',
      description: 'Time makes things honest.',
      icon: 'fa-hourglass-half'
    },
    {
      name: 'Listen Closely',
      description: 'Every project tells you what it needs.',
      icon: 'fa-ear-listen'
    },
    {
      name: 'Stay Clear',
      description: 'Simplicity is a form of respect.',
      icon: 'fa-water'
    }
  ];

  ngOnInit() {
    if (!this.isBrowser) return;
    this.animationsEnabled = true;
  }
}