import { AfterViewInit, Component, HostListener, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { ScrollService } from '../../../core/services/scrollService/scroll.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        CommonModule,
        MatToolbarModule, 
        MatButtonModule
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements AfterViewInit {
  private scrollService = inject(ScrollService);
  isScrolled = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 550;
  }

  constructor() {}

  ngAfterViewInit() {}

  scrollToSection(sectionId: string): void {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    this.scrollService.scrollToElement(sectionId);
  }
}
