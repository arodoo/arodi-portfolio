import { AfterViewInit, Component, HostListener, Inject, PLATFORM_ID, ViewChild, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { ChartsService } from '../../../../core/services/charts/charts.service';
import { BubbleDataSet } from '../../../../shared/utils/chart-data';

import { TextSectionComponent } from '../text-section/text-section.component';


@Component({
    selector: 'app-charts-section',
    imports: [
        CommonModule,
        BaseChartDirective,
        TextSectionComponent
    ],
    templateUrl: './charts-section.component.html',
    styleUrl: './charts-section.component.scss'
})
export class ChartsSectionComponent implements AfterViewInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private chartsService: ChartsService,
    private renderer: Renderer2) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.scrollSubscription = this.scrollSubject.pipe(
      debounceTime(500)
    ).subscribe(() =>{
      this.removeGlowClass();
    });
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  private scrollSubject = new Subject<void>();
  private scrollSubscription !: Subscription;


  intervalId: any;
  subscription !: Subscription;

  isBrowser: boolean;
  
  private srollTimeout: any;

  hoveredPoints: { x: number, y: number }[] = [];
  lastHoveredIndex: number | null = null;

  bubbleChartData: ChartConfiguration['data'] = {
    datasets: []
  }

  bubbleChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: 'transparent',
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const x = tooltipItem.raw.x;
            const y = tooltipItem.raw.y;
            const r = tooltipItem.raw.r;
            return `(${x}, ${y}, ${r})`;
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuad'
    },
    onHover: (event: any, elements: any[]) => {
      if (elements.length) {
        const element = elements[0];
        const datasetIndex = element.datasetIndex;
        const index = element.index;

        // Verificar si el índice actual es diferente del último índice registrado
        if (this.lastHoveredIndex !== index) {
          this.lastHoveredIndex = index;
          const data = this.bubbleChartData.datasets[datasetIndex].data[index];
          if (data) {           
            this.handleHover(data, element);
          }
        }
      }
    }
  };

  bubbleChartType: ChartType = 'bubble';

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.updateChartData();
    }
  }

  updateChartData(): void {
    this.intervalId = setInterval(() => {

      this.subscription = this.chartsService.getChartData().subscribe(
        (data: BubbleDataSet[]) => {
          this.bubbleChartData.datasets = data;
          this.chart?.update();
        },
        error => {
          throw new error('Error getting data', error);
        }
      )
    }, 6000);
  }

  @HostListener('window:scroll', []) onWindowScroll(): void {
    if (this.chart?.chart?.canvas){
      const canvas = this.chart.chart.canvas;
      if(!canvas.classList.contains('bubble-glow')){
        this.renderer.addClass(canvas, 'bubble-glow');
      }
      this.scrollSubject.next();
    }
  }

  removeGlowClass(): void {
    
    if (this.chart?.chart?.canvas){
      const canvas = this.chart.chart.canvas;
      this.renderer.removeClass(canvas, 'bubble-glow');
      this.renderer.addClass(canvas, 'bubble-fade');

      setTimeout(() => {
        this.renderer.removeClass(canvas, 'bubble-fade');
      }, 1000);
    }
  }

  handleHover(data: any, element: any): void {

    const point = {
      x: element.element.x,
      y: element.element.y
    };
    this.hoveredPoints.push(point);
    this.drawLines();
  }

  drawLines(): void {
    if (this.chart?.chart?.canvas) {
      const ctx = this.chart.chart.ctx;

      ctx.clearRect(0, 0, this.chart.chart.width, this.chart.chart.height);
      this.chart.chart.draw();

      // Dibujar las líneas
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;

      for (let i = 0; i < this.hoveredPoints.length - 1; i++) {
        const startPoint = this.hoveredPoints[i];
        const endPoint = this.hoveredPoints[i + 1];
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
      }

      ctx.stroke();
    }
  }

  clearLines(): void {
    this.hoveredPoints = [];
    this.drawLines();
  }
}