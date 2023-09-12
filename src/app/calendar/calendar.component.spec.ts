import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Appointment } from '../interfaces/appointment';
import { newAppointmentProps } from '../spec-helper/fixtures';

import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let mockAppointments: Appointment[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [CalendarComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO - reenable if we do need this function
  // describe('return correct start and end time from appointments or parameters', () => {
  //   it('should return parameter start and end time when undefined appointments', () => {
  //     const [startDate, endDate] = component.getCalendarStartAndEndTime(
  //       new Date(2022, 9, 1, 10, 0),
  //       new Date(2022, 9, 1, 10, 30)
  //     );
  //     expect(startDate).toEqual(new Date(2022, 9, 1, 9, 45));
  //     expect(endDate).toEqual(new Date(2022, 9, 1, 10, 45));
  //   });

  //   it('should return parameter start and end time when empty appointments', () => {
  //     const [startDate, endDate] = component.getCalendarStartAndEndTime(
  //       new Date(2022, 9, 1, 10, 0),
  //       new Date(2022, 9, 1, 10, 30),
  //       []
  //     );
  //     expect(startDate).toEqual(new Date(2022, 9, 1, 9, 45));
  //     expect(endDate).toEqual(new Date(2022, 9, 1, 10, 45));
  //   });

  //   it('should return appointments start and end time', () => {
  //     const [startDate, endDate] = component.getCalendarStartAndEndTime(
  //       new Date(2022, 9, 1, 10, 30),
  //       new Date(2022, 9, 1, 10, 30),
  //       [
  //         newAppointmentProps({
  //           start: {
  //             dateTime: new Date(2022, 9, 1, 10, 15).toISOString(),
  //           },
  //         }),
  //         newAppointmentProps({
  //           end: {
  //             dateTime: new Date(2022, 9, 1, 10, 45).toISOString(),
  //           },
  //         }),
  //       ]
  //     );
  //     expect(startDate).toEqual(new Date(2022, 9, 1, 10, 0));
  //     expect(endDate).toEqual(new Date(2022, 9, 1, 11, 0));
  //   });
  // });

  describe('convert appointment to series data object', () => {
    it('should convert object', () => {
      const result = component.convertAppointmentToSeriesData(
        newAppointmentProps({
          summary: "Nora's first day",
          start: {
            dateTime: new Date('2022-09-01T09:00:00+02:00'),
          },
          end: {
            dateTime: new Date('2022-09-01T17:00:00+02:00'),
          },
        })
      );

      expect(result).toEqual({
        name: "Nora's first day",
        start: 1662015600 * 1000,
        end: 1662044400 * 1000,
        y: 0,
      });
    });
  });
});
