import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Appointment } from '../interfaces/appointment';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentComponent {
  @Input() appointment: Appointment | undefined;
  @Input() enlarged = false;
}
