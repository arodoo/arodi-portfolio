import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ServicesCardsScrollAnimationDirective } from '../../../../shared/directives/services/services-cards-scroll-animation.directive';

interface ServiceCard {
  id: number;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  standalone: true,
  imports: [CommonModule, ServicesCardsScrollAnimationDirective]
})
export class ServicesComponent implements OnInit {
  private isBrowser: boolean;
  animationsEnabled = false;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  serviceCards: ServiceCard[] = [
    {
      id: 1,
      title: 'Multilingual Content Pipeline',
      description: 'Automated translation system supporting 50+ languages. From English source text to localized audiobooks, fully automated through Google Vertex AI Translation API.',
      icon: 'fa-globe',
      imageUrl: 'assets/images/services/web-fullstack.png'
    },
    {
      id: 2,
      title: 'Neural Text-to-Speech Engine',
      description: 'Studio-quality audiobook generation using Google Cloud Text-to-Speech with WaveNet and Neural2 voices. Supports natural intonation, emotion, and multilingual pronunciation.',
      icon: 'fa-volume-up',
      imageUrl: 'assets/images/services/saas-development.png'
    },
    {
      id: 3,
      title: 'Metadata Enrichment & Formatting',
      description: 'Automated ISBN generation, cover design, and platform-specific formatting for Audible, Google Play Books, and Apple Books. Ready-to-publish packages in minutes.',
      icon: 'fa-book',
      imageUrl: 'assets/images/services/database.png'
    },
    {
      id: 4,
      title: 'Public Domain Content Library',
      description: 'Curated repository of public domain texts (Project Gutenberg, LibriVox) ready for conversion. Legal compliance and rights verification built into the workflow.',
      icon: 'fa-archive',
      imageUrl: 'assets/images/services/testing.png'
    },
    {
      id: 5,
      title: 'Distribution API & Integration',
      description: 'RESTful API for automated submission to audiobook platforms. Direct integration with ACX, Findaway Voices, and major retailers. Track royalties and sales analytics in real-time.',
      icon: 'fa-network-wired',
      imageUrl: 'assets/images/services/api-integration.png'
    },
    {
      id: 6,
      title: 'Google Cloud Infrastructure',
      description: 'Built on Google Cloud Run, Cloud Storage, and Vertex AI. Auto-scaling compute, 99.9% uptime SLA, and enterprise-grade security. Process thousands of books simultaneously.',
      icon: 'fa-server',
      imageUrl: 'assets/images/services/automation.png'
    }
  ];


  ngOnInit() {
    if (!this.isBrowser) return;
    this.animationsEnabled = true;
  }
}