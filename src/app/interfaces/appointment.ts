import { calendar_v3 } from '@googleapis/calendar';

// TODO - do start and end need to be objects
// or startDateTime and endDateTime properties enough?
export interface Appointment {
  id?: string;
  summary: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
  free?: boolean;
}

export function convertGoogleEventToAppointment(gEvent: calendar_v3.Schema$Event): Appointment {
  return {
    id: gEvent.id ?? undefined,
    summary: gEvent.summary ?? '',
    start: {
      dateTime: gEvent.start?.dateTime ?? '',
    },
    end: {
      dateTime: gEvent.end?.dateTime ?? '',
    },
    free: false,
  };
}

export function convertGoogleEventsToAppointments(events: calendar_v3.Schema$Events): Appointment[] {
  return events.items?.map(convertGoogleEventToAppointment) ?? [];
}
