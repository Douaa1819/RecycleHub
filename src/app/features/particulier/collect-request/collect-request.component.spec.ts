import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectRequestComponent } from './collect-request.component';

describe('CollectRequestComponent', () => {
  let component: CollectRequestComponent;
  let fixture: ComponentFixture<CollectRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
