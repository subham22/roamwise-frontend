import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayMapComponent } from './day-map.component';

describe('DayMapComponent', () => {
  let component: DayMapComponent;
  let fixture: ComponentFixture<DayMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayMapComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
