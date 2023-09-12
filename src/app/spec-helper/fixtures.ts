import { calendar_v3 } from 'googleapis';
import { Appointment } from '../interfaces/appointment';

const factory =
  <T extends {}>(defaults: (arg: Partial<T>) => T) =>
  (overrides = {}) => {
    return Object.assign({}, defaults(overrides), overrides);
  };

export const newAppointmentProps = factory<Appointment>(() => ({
  summary: 'first appointment',
  start: {
    dateTime: '2022-09-01T09:00:00+00:00',
  },
  end: {
    dateTime: '2022-09-01T10:30:00+00:00',
  },
}));

export const newGoogleEvent = factory<calendar_v3.Schema$Event>(
  () => newAppointmentProps() as calendar_v3.Schema$Event
);

export const newGoogleEvents = factory<calendar_v3.Schema$Events>(
  () =>
    ({
      items: [newGoogleEvent()],
    } as calendar_v3.Schema$Events)
);
