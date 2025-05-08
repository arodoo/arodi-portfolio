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
      title: 'Web Development',
      description: 'Custom websites and web applications tailored to your specific business needs.',
      icon: 'fa-code',
      imageUrl: 'assets/images/services/web-development.jpg'
    },
    {
      id: 2,
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile applications for iOS and Android platforms.',
      icon: 'fa-mobile-alt',
      imageUrl: 'assets/images/services/mobile-apps.jpg'
    },
    {
      id: 3,
      title: 'UI/UX Design',
      description: 'User-centered design with intuitive interfaces and exceptional user experiences.',
      icon: 'fa-paint-brush',
      imageUrl: 'assets/images/services/ui-ux-design.jpg'
    },
    {
      id: 4,
      title: 'E-commerce',
      description: 'Full-featured online stores with secure payment processing and inventory management.',
      icon: 'fa-shopping-cart',
      imageUrl: 'assets/images/services/e-commerce.jpg'
    },
    {
      id: 5,
      title: 'Digital Marketing',
      description: 'Strategic digital marketing solutions to grow your online presence and reach.',
      icon: 'fa-bullhorn',
      imageUrl: 'assets/images/services/digital-marketing.jpg'
    },
    {
      id: 6,
      title: 'Content Management',
      description: 'Custom CMS solutions that make content updates simple and efficient.',
      icon: 'fa-file-alt',
      imageUrl: 'assets/images/services/content-management.jpg'
    }
  ];

  ngOnInit() {
    if (!this.isBrowser) return;
    this.animationsEnabled = true;
  }
}