import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { LoadingService } from '../../../core/services/loading.service';
import { Subscription } from 'rxjs';

import { Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-loading-bar',
    imports: [CommonModule,
        MatProgressBarModule,
        MatCardModule
    ],
    templateUrl: './loading-bar.component.html',
    styleUrl: './loading-bar.component.scss'
})
export class LoadingBarComponent implements OnInit, OnDestroy {

  loading$;
  private subscription!: Subscription;

  constructor(private loadingService: LoadingService,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit(): void {
    this.subscription = this.loading$.subscribe(isLoading =>{
      if (isPlatformBrowser(this.platformId)) {
        if(isLoading){
         this.disableScroll();
        }else{
          this.enableScroll();
        }
      }
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeClass(document.body, 'loading-active');
    }
  }

  private disableScroll(){
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    }
  }

  private enableScroll(){
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.setStyle(document.body, 'overflow', 'auto');
    }
  }

}
