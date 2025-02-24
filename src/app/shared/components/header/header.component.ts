import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ThreeSharkServiceService } from '../../../core/services/three-js/three-shark-service.service';
import { FishesComponent } from '../fishes/fishes.component';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [FishesComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  constructor(private threeSharkServiceService: ThreeSharkServiceService
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
    this.threeSharkServiceService.init(this.containerRef);
    }, 1000);
  }
}
