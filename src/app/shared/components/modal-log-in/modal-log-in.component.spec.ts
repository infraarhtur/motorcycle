import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLogInComponent } from './modal-log-in.component';

describe('ModalLogInComponent', () => {
  let component: ModalLogInComponent;
  let fixture: ComponentFixture<ModalLogInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalLogInComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLogInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
