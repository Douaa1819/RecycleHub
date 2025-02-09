import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectorRequestDetailsComponent } from './collector-request-details.component';

describe('CollectorRequestDetailsComponent', () => {
  let component: CollectorRequestDetailsComponent;
  let fixture: ComponentFixture<CollectorRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectorRequestDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectorRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
