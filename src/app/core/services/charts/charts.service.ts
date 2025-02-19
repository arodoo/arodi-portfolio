import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BubbleDataSet, BubbleRanges, BubbleColors } from '../../../shared/utils/chart-data';
@Injectable({
  providedIn: 'root'
})
export class ChartsService {

  constructor() { }

  getRandomValue(min: number, max: number): number{
    return Math.floor(Math.random() * (max -min + 1)) + min;
  }

  generateRandomData(): BubbleDataSet[] {
    return BubbleColors.map((color, index) => ({
      label: `Dataset ${index + 1}`,
      data: Array.from({ length: 5  }, () => ({
        x: this.getRandomValue(BubbleRanges.x.min, BubbleRanges.x.max),
        y: this.getRandomValue(BubbleRanges.y.min, BubbleRanges.y.max),
        r: this.getRandomValue(BubbleRanges.r.min, BubbleRanges.r.max)
      })),
      backgroundColor: color.backgroundColor,
      borderColor: color.borderColor,
      borderWidth: 1
    }));
  }

  getChartData(): Observable<BubbleDataSet[]>{
    return of(this.generateRandomData());
  }
}
