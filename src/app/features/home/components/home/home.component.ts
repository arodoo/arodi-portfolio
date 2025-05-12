import { AfterViewInit, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';

import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { AboutComponent } from '../../../about/components/about/about.component';
import { ServicesComponent } from '../../../services/components/services/services.component';
import { ContactComponent } from '../../../contact/components/contact/contact.component';

//loading-bar
import { LoadingService } from '../../../../core/services/loading.service';
import { LoadingBarComponent } from '../../../../shared/components/loading-bar/loading-bar.component';

import { SeparatorComponent } from '../../../../shared/components/separator/separator.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LoadingBarComponent,
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
    AboutComponent,
    ServicesComponent,
    ContactComponent,
    SeparatorComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {

  constructor(
    private loadingService: LoadingService,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Run outside Angular zone to avoid triggering change detection
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          // Run back inside Angular when we want to update the UI
          this.ngZone.run(() => {
            this.loadingService.simulateLoading(5000);
          });
        }, 0);
      });
    } else {
      // For SSR, don't show loading screen
      this.loadingService.setLoading(false);
    }
  }
}