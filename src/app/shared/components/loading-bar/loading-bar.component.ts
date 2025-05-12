import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { LoadingService } from '../../../core/services/loading.service';
import { Observable, Subscription } from 'rxjs';
import { Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-loading-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatCardModule
  ],
  templateUrl: './loading-bar.component.html',
  styleUrl: './loading-bar.component.scss'
})
export class LoadingBarComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  progress$: Observable<number>;

  private subscriptions: Subscription[] = [];

  constructor(
    private loadingService: LoadingService,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize properties in the constructor after loadingService is injected
    this.loading$ = this.loadingService.loading$;
    this.progress$ = this.loadingService.progress$;
  }

  ngOnInit(): void {
    
    if (isPlatformBrowser(this.platformId)) {
      this.subscriptions.push(
        this.loading$.subscribe((isLoading: boolean) => {
          if (isLoading) {
        this.disableScroll();
          } else {
        this.enableScroll();
          }
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (isPlatformBrowser(this.platformId)) {
      this.enableScroll();
    }
  }

  private disableScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    }
  }

  private enableScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.setStyle(document.body, 'overflow', 'auto');
    }
  }
}