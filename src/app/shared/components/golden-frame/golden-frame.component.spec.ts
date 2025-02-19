import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldenFrameComponent } from './golden-frame.component';

describe('GoldenFrameComponent', () => {
  let component: GoldenFrameComponent;
  let fixture: ComponentFixture<GoldenFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldenFrameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoldenFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
