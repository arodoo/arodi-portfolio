import {
  Component,
  AfterViewInit,
  inject,
  signal,
  DestroyRef,
  Inject,
  PLATFORM_ID,
  OnInit
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, AfterViewInit {
  private destroyRef = inject(DestroyRef);
  private isBrowser: boolean;

  // Use signals for reactive state management
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  activeSection = signal('home');

  // Define all sections for easier management
  readonly sections = ['home', 'about', 'services', 'contact'];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    // Always start with home as the active section
    this.activeSection.set('home');

    // Only subscribe to scroll events in the browser
    if (this.isBrowser) {
      fromEvent(window, 'scroll')
        .pipe(
          throttleTime(100), // More responsive updates
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
          this.checkScrollPosition();
          this.detectActiveSection();
        });
    }
  }

  ngAfterViewInit() {
    // Initial check for active section - only in browser
    if (this.isBrowser) {
      setTimeout(() => {
        this.checkScrollPosition();
        // Initial detection after small delay
        //this.detectActiveSection();
      }, 500);
    }
  }

  /**
   * Updates scroll position state
   */
  checkScrollPosition(): void {
    if (this.isBrowser) {
      this.isScrolled.set(window.scrollY > 50);
    }
  }

  /**
   * Detects which section is currently visible in the viewport
   */
  detectActiveSection(): void {
    if (!this.isBrowser) return;

    // Special case: If we're near the bottom of the page, activate the contact section
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (documentHeight - scrollPosition < 100) {
      // If we're within 100px of the bottom, set contact as active
      this.activeSection.set('contact');
      return;
    }

    // Normal section detection logic
    const viewportHeight = window.innerHeight;
    let maxVisibleSection = '';
    let maxVisibleArea = 0;

    this.sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        const rect = element.getBoundingClientRect();

        // Calculate how much of the element is visible
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        let visibleArea = (visibleHeight > 0) ? visibleHeight * rect.width : 0;

        // Prioritize sections near the top of the viewport
        if (rect.top >= 0 && rect.top < viewportHeight * 0.5) {
          visibleArea *= 1.5;  // Boost top-positioned sections
        }

        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          maxVisibleSection = sectionId;
        }
      }
    });

    if (maxVisibleSection && maxVisibleSection !== this.activeSection()) {
      this.activeSection.set(maxVisibleSection);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(value => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  // Helper method to check if a section is active
  isActive(sectionId: string): boolean {
    return this.activeSection() === sectionId;
  }
}