import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChechoutComponent } from './chechout.component';

describe('ChechoutComponent', () => {
  let component: ChechoutComponent;
  let fixture: ComponentFixture<ChechoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChechoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChechoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
