import { AfterViewInit, Component } from '@angular/core';

import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { AboutComponent } from '../../../about/components/about/about.component';
import { ServicesComponent } from '../../../services/components/services/services.component';
import { ContactComponent } from '../../../contact/components/contact/contact.component';

//loading-bar
import { LoadingService } from '../../../../core/services/loading.service';
import { LoadingBarComponent } from '../../../../shared/animations/loading-bar/loading-bar.component';

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
    ContactComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {

  constructor(private loadingService: LoadingService) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadingService.setLoading(false);
    }, 500);
  }

}
