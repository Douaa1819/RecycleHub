import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticulierDashboardComponent } from './particulier-dashboard.component';

describe('ParticulierDashboardComponent', () => {
  let component: ParticulierDashboardComponent;
  let fixture: ComponentFixture<ParticulierDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticulierDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticulierDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
