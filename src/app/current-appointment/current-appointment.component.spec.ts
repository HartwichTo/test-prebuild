import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentComponent } from '../appointment/appointment.component';
import { newAppointmentProps } from '../spec-helper/fixtures';

import { CurrentAppointmentComponent } from './current-appointment.component';

describe('CurrentAppointmentComponent', () => {
  let component: CurrentAppointmentComponent;
  let fixture: ComponentFixture<CurrentAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [CurrentAppointmentComponent, AppointmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentAppointmentComponent);
    component = fixture.componentInstance;
    component.appointment = newAppointmentProps();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
