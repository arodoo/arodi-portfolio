import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

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
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(
    private loadingService: LoadingService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void{
    if (isPlatformBrowser(this.platformId)) {
      this.loadingService.setLoading(false);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.loadingService.simulateLoading(15000);
      }, 100);
    }
  }
}