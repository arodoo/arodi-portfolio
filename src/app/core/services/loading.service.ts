import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();

  private progressSubject = new BehaviorSubject<number>(0);
  progress$ = this.progressSubject.asObservable();

  private bytesByModel = new Map<number, { loaded: number; total: number }>();
  private completedModels = new Set<number>();
  private expectedModels = 0;
  private safetyTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() { }

  setLoading(isLoading: boolean) {
    this.loadingSubject.next(isLoading);
  }

  setProgress(value: number) {
    this.progressSubject.next(Math.min(100, Math.max(0, value)));
  }

  registerModels(count: number) {
    this.expectedModels = count;
    this.bytesByModel.clear();
    this.completedModels.clear();
    this.progressSubject.next(0);
    this.loadingSubject.next(true);
    this.clearSafetyTimer();
    this.safetyTimer = setTimeout(() => {
      this.completedModels.clear();
      this.bytesByModel.clear();
      this.expectedModels = 0;
      this.progressSubject.next(100);
      this.loadingSubject.next(false);
    }, 15000);
  }

  reportModelProgress(modelId: number, loaded: number, total: number) {
    if (this.completedModels.has(modelId)) return;
    if (total <= 0) return;
    this.bytesByModel.set(modelId, { loaded, total });
    this.recomputeProgress();
  }

  notifyModelComplete(modelId: number) {
    if (this.completedModels.has(modelId)) return;
    this.completedModels.add(modelId);
    const entry = this.bytesByModel.get(modelId);
    if (entry) entry.loaded = entry.total;
    if (this.expectedModels > 0 && this.completedModels.size >= this.expectedModels) {
      this.progressSubject.next(100);
      this.loadingSubject.next(false);
      this.clearSafetyTimer();
    } else {
      this.recomputeProgress();
    }
  }

  private recomputeProgress() {
    if (this.expectedModels <= 0) return;
    let totalPercent = 0;
    let reportingModels = 0;
    this.bytesByModel.forEach(({ loaded, total }) => {
      if (total > 0) {
        totalPercent += (loaded / total) * 100;
        reportingModels++;
      }
    });
    const pendingModels = Math.max(0, this.expectedModels - reportingModels);
    const avgPercent = (totalPercent + pendingModels * 0) / this.expectedModels;
    this.progressSubject.next(Math.min(100, Math.max(0, avgPercent)));
  }

  private clearSafetyTimer() {
    if (this.safetyTimer) {
      clearTimeout(this.safetyTimer);
      this.safetyTimer = null;
    }
  }
}
