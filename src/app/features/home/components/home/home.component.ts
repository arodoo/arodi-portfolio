import { AfterViewInit, Component, OnInit } from '@angular/core';

import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FishesComponent } from '../../../../shared/components/fishes/fishes.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';



//loading-bar
import { LoadingService } from '../../../../core/services/loading.service';
import { LoadingBarComponent } from '../../../../shared/animations/loading-bar/loading-bar.component';

@Component({
    selector: 'app-home',
    imports: [LoadingBarComponent,
        HeaderComponent, FooterComponent, NavbarComponent, FishesComponent,],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {

  constructor(private loadingService: LoadingService) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadingService.setLoading(false);
    }, 3000);
  }

}
