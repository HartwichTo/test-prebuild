import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import * as Highcharts from 'highcharts/highcharts-gantt';
import { interval, map, Observable, startWith, switchMap } from 'rxjs';

import { AppointmentService } from '../appointment.service';
import { SeriesData } from '../interfaces/series-data';
import { Appointment } from '../interfaces/appointment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions$ = new Observable<Highcharts.Options>();

  constructor(private appointmentService: AppointmentService) {}
  ngOnInit(): void {
    this.chartOptions$ = interval(1000).pipe(
      startWith(0),
      switchMap(() => this.appointmentService.getAllAppointments().pipe(
        map((appointments) => this.getChartOptions(appointments))
        )));
      }

  // TODO - what's this doing and do we need it?
  // getCalendarStartAndEndTime(compareDateStart: Date, compareDateEnd: Date, appointments?: Appointment[]): [Date, Date] {
  //   let startDateTmp: Date;
  //   let endDateTmp: Date;
  //   if (appointments && appointments.length > 0) {
  //     const firstAppointmentStart = new Date(appointments[0].start.dateTime);
  //     const lastAppointmentEnd = new Date(appointments[appointments.length - 1].end.dateTime);
  //     startDateTmp =
  //       firstAppointmentStart.getTime() < compareDateStart.getTime() ? firstAppointmentStart : compareDateStart;
  //     endDateTmp = lastAppointmentEnd.getTime() > compareDateEnd.getTime() ? lastAppointmentEnd : compareDateEnd;
  //   } else {
  //     startDateTmp = compareDateStart;
  //     endDateTmp = compareDateEnd;
  //   }

  //   startDateTmp.setMinutes(Math.round((startDateTmp.getMinutes() - 15) / 15) * 15);
  //   endDateTmp.setMinutes(Math.round((endDateTmp.getMinutes() + 15) / 15) * 15);

  //   return [startDateTmp, endDateTmp];
  // }

  convertAppointmentToSeriesData(appointment: Appointment): SeriesData {
    return {
      name: appointment.summary,
      start: new Date(appointment.start.dateTime).getTime(),
      end: new Date(appointment.end.dateTime).getTime(),
      y: 0,
    };
  }

  getChartOptions(appointments: Appointment[]) {
    const seriesData = appointments.map(this.convertAppointmentToSeriesData);
    // const compareEnd = new Date();
    // compareEnd.setHours(17);
    // compareEnd.setMinutes(0);
    // const [startDate, endDate] = this.getCalendarStartAndEndTime(new Date(), compareEnd, appointments);

    const start = new Date();
    start.setMinutes(start.getMinutes() - 30);

    const end = new Date();
    end.setHours(18, 15);

    const options: Highcharts.Options = {
      title: {
        text: undefined,
      },
      time: {
        useUTC: false,
      },
      chart: {
        inverted: true,
        plotBorderWidth: 1,
        scrollablePlotArea: {
          minHeight: 1000,
        },
      },
      xAxis: [
        {
          currentDateIndicator: {
            label: {
              format: '%H:%M',
            },
          },
          visible: true,
          opposite: false,
          type: 'datetime',
          tickInterval: 15 * 60 * 1000, // 15 minutes
          gridLineWidth: 0.5,
          min: start.getTime(),
          max: end.getTime(),
        },
      ],
      yAxis: {
        visible: false,
        type: 'category',
        categories: [formatDate(new Date(), 'YYYY-MM-dd', 'en-Us')],
      },
      tooltip: {
        enabled: true,
        xDateFormat: '%H:%M',
      },
      series: [
        {
          name: formatDate(new Date(), 'dd.MM.YYYY', 'en-GB'),
          type: 'gantt',
          color: '#F9B000',
          colorByPoint: false,
          data: seriesData,
        },
      ],
    };
    return options;
  }
}
