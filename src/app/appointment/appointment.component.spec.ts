import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Appointment } from '../interfaces/appointment';

import { AppointmentComponent } from './appointment.component';
import { newAppointmentProps } from '../spec-helper/fixtures';

describe('AppointmentComponent', () => {
  let component: AppointmentComponent;
  let fixture: ComponentFixture<AppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentComponent],
    }).compileComponents();
  });

  const setupComponentWithMockData = (mockAppointment: Appointment) => {
    fixture = TestBed.createComponent(AppointmentComponent);
    component = fixture.componentInstance;
    component.appointment = mockAppointment;
    fixture.detectChanges();
  };

  it('should create', () => {
    setupComponentWithMockData(newAppointmentProps());
    expect(component).toBeTruthy();
  });

  it('should display appointment title', () => {
    setupComponentWithMockData(
      newAppointmentProps({
        summary: 'mockSummary',
      })
    );
    const el = fixture.debugElement.query(By.css('.appointment-title')).nativeElement;
    expect(el).toBeTruthy();
    expect(el.textContent.trim()).toContain('mockSummary');
  });

  it('should display appointment title and start and end time', () => {
    setupComponentWithMockData(
      newAppointmentProps({
        start: {
          dateTime: new Date(2022, 9, 1, 9, 0, 0).toISOString(),
        },
        end: {
          dateTime: new Date(2022, 9, 1, 10, 30, 0).toISOString(),
        },
      })
    );
    const el = fixture.debugElement.queryAll(By.css('.appointment-times'));
    const elText = el.map((item) => item.nativeElement.textContent.trim()).join();
    expect(elText).toBeTruthy();
    expect(elText).toContain('09:00');
    expect(elText).toContain('10:30');
  });
});
