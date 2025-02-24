import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ThreeEarthService } from '../../../../core/services/three-js/three-earth.service';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements AfterViewInit {
  @ViewChild('earthCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(private threeEarthService: ThreeEarthService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.threeEarthService.init(this.canvasRef);
    }, 100);
  }
}
