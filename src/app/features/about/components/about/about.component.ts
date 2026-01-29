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
      name: 'AI-Powered Translation',
      description: 'Leverage Google Vertex AI to translate content into 50+ languages with human-level accuracy.',
      icon: 'fa-language'
    },
    {
      name: 'Automated Audio Production',
      description: 'Convert text to studio-quality audiobooks instantly using advanced neural text-to-speech technology.',
      icon: 'fa-microphone-alt'
    },
    {
      name: 'Scalable Infrastructure',
      description: 'Enterprise-grade Google Cloud platform ensures reliable, high-throughput content processing at scale.',
      icon: 'fa-cloud-upload-alt'
    }
  ];

  ngOnInit() {
    if (!this.isBrowser) return;
    this.animationsEnabled = true;
  }
}