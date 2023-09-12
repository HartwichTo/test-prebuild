import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { HeaderComponent } from './header/header.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { FooterComponent } from './footer/footer.component';
import { CurrentAppointmentComponent } from './current-appointment/current-appointment.component';

@NgModule({
  declarations: [
    AppComponent,
    AppointmentComponent,
    AppointmentListComponent,
    HeaderComponent,
    CalendarComponent,
    FooterComponent,
    CurrentAppointmentComponent,
  ],
  imports: [BrowserModule, HttpClientModule, HighchartsChartModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
