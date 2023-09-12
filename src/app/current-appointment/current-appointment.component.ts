import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { take } from 'rxjs';

import { AppointmentService } from '../appointment.service';
import { Appointment } from '../interfaces/appointment';

@Component({
  selector: 'app-current-appointment',
  templateUrl: './current-appointment.component.html',
  styleUrls: ['./current-appointment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentAppointmentComponent {
  @Input() appointment: Appointment | undefined;

  constructor(private appointmentService: AppointmentService) {}

  bookRoom(appointmentName: string): void {
    if (!this.appointment) {
      return;
    }

    const newAppointment: Appointment = {
      ...this.appointment,
      summary: appointmentName ? appointmentName : 'mystery appointment',
      start: {
        dateTime: new Date().toISOString(),
      },
      free: false,
    };

    this.appointmentService.addAppointment(newAppointment).pipe(take(1)).subscribe();
  }

  releaseRoom(): void {
    if (!this.appointment) {
      return;
    }

    this.appointment.end.dateTime = new Date().toISOString();
    this.appointmentService.updateAppointment(this.appointment).pipe(take(1)).subscribe();
  }
}
