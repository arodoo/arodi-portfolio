import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();

  // Progress can be used to show a progress bar
  private progressSubject = new BehaviorSubject<number>(0);
  progress$ = this.progressSubject.asObservable();

  constructor() { }

  /**
   * Set the loading state
   */
  setLoading(isLoading: boolean) {
    this.loadingSubject.next(isLoading);
  }

  /**
   * Set the current progress (0-100)
   */
  setProgress(value: number) {
    this.progressSubject.next(Math.min(100, Math.max(0, value)));
  }

  /**
   * Start a simulated loading progress
   * @param durationMs Total duration in milliseconds
   * @param steps How many update steps to use
   */
  simulateLoading(durationMs: number = 5000, steps: number = 10) {
    this.setLoading(true);
    this.setProgress(0);

    const interval = durationMs / steps;
    const increment = 100 / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(100, currentStep * increment);
      this.setProgress(progress);

      if (currentStep >= steps) {
        clearInterval(timer);
        this.setLoading(false);
      }
    }, interval);

    // Safety fallback in case something goes wrong
    setTimeout(() => {
      this.setLoading(false);
      this.setProgress(100);
    }, durationMs + 500);
  }
}