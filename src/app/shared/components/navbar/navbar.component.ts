import { AfterViewInit, Component } from '@angular/core';

@Component({
    selector: 'app-navbar',
    imports: [],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements AfterViewInit {

  constructor() {
    
  }

  ngAfterViewInit() {
    setTimeout(() => {
    }, 3000);
  }

  private typeTitle() {
  }


  private typeText(content: string, onComplete?: () => void) {
  }
}
