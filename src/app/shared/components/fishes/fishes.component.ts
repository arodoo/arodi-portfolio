import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ThreeAnimatedFishesService } from '../../../core/services/three-js/three-animated-fishes.service';

@Component({
    selector: 'app-fishes',
    standalone: true,
    imports: [],
    templateUrl: './fishes.component.html',
    styleUrl: './fishes.component.scss'
})
export class FishesComponent implements AfterViewInit{
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  constructor(private threeAnimatedFishesService: ThreeAnimatedFishesService) {}

  ngAfterViewInit() {
    this.threeAnimatedFishesService.init(this.containerRef);
  }
}
