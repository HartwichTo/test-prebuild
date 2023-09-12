import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AppointmentService } from '../appointment.service';
import { AppointmentListComponent } from './appointment-list.component';

import { addHours } from '../spec-helper/utils';
import { AppointmentComponent } from '../appointment/appointment.component';
import { CurrentAppointmentComponent } from '../current-appointment/current-appointment.component';
import { Appointment } from '../interfaces/appointment';

describe('AppointmentListComponent', () => {
  let component: AppointmentListComponent;
  let fixture: ComponentFixture<AppointmentListComponent>;

  const setupComponentWithMockData = (mockAppointments: Appointment[]) => {
    const mockAppointmentService: Partial<AppointmentService> = {
      getAllAppointments() {
        return of(mockAppointments);
      },

      getRemainingAppointments() {
        return of(mockAppointments);
      },
    };

    TestBed.overrideProvider(AppointmentService, { useValue: mockAppointmentService });
    fixture = TestBed.createComponent(AppointmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentListComponent, AppointmentComponent, CurrentAppointmentComponent],
      providers: [{ provide: AppointmentService }, { provide: AppointmentComponent }],
    }).compileComponents();
  });

  it('should create', () => {
    setupComponentWithMockData([]);
    expect(component).toBeTruthy();
  });

  it('should display one current appointment and only 2 more appointments', () => {
    setupComponentWithMockData([
      {
        summary: '1st relevant appointment',
        start: { dateTime: addHours(1).toISOString() },
        end: { dateTime: addHours(1).toISOString() },
      },
      {
        summary: '2nd relevant appointment',
        start: { dateTime: addHours(1).toISOString() },
        end: { dateTime: addHours(1).toISOString() },
      },
      {
        summary: '3rd relevant appointment',
        start: { dateTime: addHours(1).toISOString() },
        end: { dateTime: addHours(1).toISOString() },
      },
      {
        summary: 'Unrelevant appointment',
        start: { dateTime: addHours(1).toISOString() },
        end: { dateTime: addHours(1).toISOString() },
      },
    ]);

    const elCurrentAppointment = fixture.debugElement.queryAll(By.css('app-current-appointment'));
    expect(elCurrentAppointment.length).toEqual(1);

    const elAppointment = fixture.debugElement.queryAll(By.css('app-appointment'));
    expect(elAppointment.length).toEqual(3);
  });

  it('should only have a free current appointment when there are no appointments', () => {
    setupComponentWithMockData([]);

    const elCurrentAppointment = fixture.debugElement.query(By.css('app-current-appointment')).nativeElement;
    expect(elCurrentAppointment.textContent).toContain('FREI');

    const elAppointment = fixture.debugElement.queryAll(By.css('app-appointment'));
    expect(elAppointment.length).toEqual(1);
  });

  it('should have a free appointment if first appointment is in the future', () => {
    const start = new Date();
    const end = new Date();
    start.setHours(start.getHours() + 2);
    end.setHours(start.getHours() + 1);

    const mockAppointments: Appointment[] = [
      {
        summary: 'foobar',
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
      },
    ];

    setupComponentWithMockData(mockAppointments);

    const elCurrentAppointment = fixture.debugElement.query(By.css('app-current-appointment')).nativeElement;
    expect(elCurrentAppointment.textContent).toContain('FREI');

    const elAppointment = fixture.debugElement.queryAll(By.css('app-appointment'));
    expect(elAppointment.length).toEqual(2);
    expect(elAppointment[1].nativeElement.textContent).toContain('foobar');
  });
});
