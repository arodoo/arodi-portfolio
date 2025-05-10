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
      title: 'Full-Stack Web Development',
      description: 'Modern, scalable web applications using Angular, NestJS, TypeScript, and Docker. Tailored for SaaS platforms, internal tools, or custom business solutions.',
      icon: 'fa-laptop-code',
      imageUrl: 'assets/images/services/web-fullstack.png'
    },
    {
      id: 2,
      title: 'SaaS Platform Engineering',
      description: 'Design and development of complete SaaS systems: secure authentication, admin dashboards, automated testing, and continuous deployment pipelines.',
      icon: 'fa-cloud',
      imageUrl: 'assets/images/services/saas-development.png'
    },
    {
      id: 3,
      title: 'Database Design & Management',
      description: 'Efficient SQL database modeling, data normalization, and optimized querying. Perfect for data-driven applications and business-critical systems.',
      icon: 'fa-database',
      imageUrl: 'assets/images/services/database.png'
    },
    {
      id: 4,
      title: 'Automated Testing & Code Quality',
      description: 'End-to-end and unit testing using tools like Jest and Supertest to ensure robust, error-free software. Ideal for high-reliability applications.',
      icon: 'fa-shield-alt',
      imageUrl: 'assets/images/services/testing.png'
    },
    {
      id: 5,
      title: 'API Development & Integration',
      description: 'RESTful API design, secure JWT-based authentication, and seamless third-party integrations. Fast, secure, and scalable communication across systems.',
      icon: 'fa-plug',
      imageUrl: 'assets/images/services/api-integration.png'
    },
    {
      id: 6,
      title: 'Business Process Automation',
      description: 'Automation of recurring operations like scheduling, invoicing, and inventory management. Drive efficiency through smart, reliable backend systems.',
      icon: 'fa-cogs',
      imageUrl: 'assets/images/services/automation.png'
    }
  ];


  ngOnInit() {
    if (!this.isBrowser) return;
    this.animationsEnabled = true;
  }
}