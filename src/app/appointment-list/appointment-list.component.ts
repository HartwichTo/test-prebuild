import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { interval, map, Observable, startWith, switchMap } from 'rxjs';
import { Appointment } from '../interfaces/appointment';
import { AppointmentService } from '../appointment.service';
import { google } from 'googleapis';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
//const private_key = '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFXL7N4nbsERg5\nr6RgeQHa22KlPQuRP+fQDgJ3mT+l+d1T/AvYxU5fevwMrHGdIWDNE6iia7h1zwUO\nki+jhtdiyXrQpxpEzfGr3tXykiUITq1MngLCLMTDNToamzJDsLvm1iOo0mdqFiI5\nq6aLB09qFlfxWhGfteUScrlSDbhx7YDfRXP4h/PA2ndRgZ9tcfTramLb+E3WLncU\nKmy+7vrnpq5N2BMJ0TKO2IIF3Z301x/3eo2FE439pU2qZLqzmU0pAdNqQceoSA0t\nihIe1CbkAElIjU50tg9TGIzgRqmiE0emkIx4O7u/7JCLgPk+8yZB7/iQ8xwyLE7R\n8WKO/oCpAgMBAAECggEABEzlC29nz/T/ZiJhnoiEddRZ7efKnLubvXjQrPJ15JPx\nMqdHSs3hy0rOuyf2wcm8ZjuLbR6Twl1katDcoN+LSefB+VHqzJ0AKxKL7uEoVWoB\ndK3suXZoQyihv3qqObdcIMeBt2f+QN2CmWcYFedu34zlFak0wRohh6lgSF1sK29L\njndLtc6SVCbT4+euNhJtPSxMG9698zCVa+oFtRgkJLRSn+6VIMSw1CgeHaX86Yxy\nxaZU2sxvgi31BMMlOOE/2rXCWdaPhY+HSZ0f91yhBsr+UMsBkmKhPsIiaQ3kY1Hf\n+SvqYs0TXR0CmM41+JBfK/J53csWiByNJAUYYAhFUQKBgQD1I5FU6Jlz0S/ocEB6\nYLCZqRa518RxeOha7/uP+QKMrNbv7yT0TlWKsa638scAVzg8DRMx/QVLbSJDabu4\ntICcaVHeogPz/7/er6XdNfNCaWRePyx73aK4/iTVHwni3+QSh0MpyYQ+U+exzfiu\nTnzxcfUtRvlSPzXMDCe7MTMEcwKBgQDOG0grDhah3j+0ZUaAhdQf0AjadyR5xvLR\neZ24XC4uQeYX9cngdlEPsIjBJyXuusb9Wsnd1rQ157vVavBcWEoJrMD5373xCYJK\n+HB48hgJ3v9k+sytxO7VAeGUw1WdqtT7NY1JGPEvlYsEa6PC6ZaFyTsBvUFwdOuH\nsJdjCn87cwKBgQDKZ3O4B9WsKyzDXuveH7exKEv7ZoxspMg1TbEITzIrtQpDUdHR\nZlx7B/qbJ3nobhugeas/uwqEHLgNsV+uQltuygcvK9bXwHNMCvuIiuMwEpUsvDye\niYGx/SWsUtR23yYRpl1uQ1VNoTnNNaP/SA8hzFYD7HYv0sE4mVC03wqgwQKBgEQ1\noS+mjPTq8ZhJAAkewTH6DkQGtAqdPdT3c6wEzb+/TV/WlwXzAia4HLoXs6ULKTnF\npxMEsEU6uN4LcxqMmYwUIRVQ57JynC0lhUtxi2UQ6OLJYZ2MlCHoanhqINZ6J9wv\nP9/WIlPGIOjImryxw3/pNd8AfDy0ZRJV7fP4EF1jAoGBAOMR9lcqzZcPo2mwPe+u\ntxWlQZSKyAn5wzOkuh8yOcOlfyNHzcyCeod5FUCfuyiQAlhM796Zs3nlNiQuiy3j\n8OnmSnV8KkVxv7v8pX4z2UvzQO47kHhyd2xPmX7Fo1N3H4J/agTclJwXJ+lFjs1p\n2GVTU3kEbFwfwh6odtzIACO9\n-----END PRIVATE KEY-----';
//const client_email = 'insfx-room-display@insfx-room-display.iam.gserviceaccount.com';
//const scopes = ['https://www.googleapis.com/auth/calendar']; 

export class AppointmentListComponent implements OnInit {
  appointments$ = new Observable<Appointment[]>();

  constructor(private appointmentService: AppointmentService) {}
  
  ngOnInit(): void {
    
    this.appointments$ = interval(1000).pipe(
      startWith(0),
      switchMap(() => this.appointmentService.getRemainingAppointments()),
      map((appointments) => appointments.slice(0, 5)),
      map((appointments) => {
        const now = new Date();
        const defaultEnd = new Date();
        now.setHours(0, 0, 0, 0);
        defaultEnd.setHours(23, 59);

        const freeAppointment: Appointment = {
          summary: 'FREI',
          start: {
            dateTime: now.toISOString(),
          },
          end: {
            dateTime: defaultEnd.toISOString(),
          },
          free: true,
        };

        if (appointments.length === 0) {
          appointments.push(freeAppointment);
          return appointments;
        }

        const firstAppointment = appointments[0];
        const startDate = new Date(firstAppointment.start.dateTime);
        if (startDate.getTime() > new Date().getTime()) {
          freeAppointment.end = firstAppointment.start;
          // TODO - add time buffer?
          appointments.unshift(freeAppointment);
        }

        return appointments; 
      
      })

    );
  }
    
    /*
    ngOnInit(): void {
      this.appointments$ = this.appointmentService.getRemainingAppointments().pipe(
        // TODO - why only 3 though?
        map((appointments) => appointments.slice(0, 2)),
        map((appointments) => {
          const now = new Date();
          const defaultEnd = new Date();
          now.setHours(0, 0, 0, 0);
          defaultEnd.setHours(23, 59);
  
          const freeAppointment: Appointment = {
            summary: 'FREI',
            start: {
              dateTime: now.toISOString(),
            },
            end: {
              dateTime: defaultEnd.toISOString(),
            },
            free: true,
          };
  
          if (appointments.length === 0) {
            appointments.push(freeAppointment);
            return appointments;
          }
  
          const firstAppointment = appointments[0];
          const startDate = new Date(firstAppointment.start.dateTime);
          if (startDate.getTime() > new Date().getTime()) {
            freeAppointment.end = firstAppointment.start;
            // TODO - add time buffer?
            appointments.unshift(freeAppointment);
          }
  
          return appointments;
        })
      );
      }*/
}
