import { Appointment } from './interfaces/appointment';

function addHours(numOfHours: number, date = new Date()): Date {
  date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
  return date;
}

export const APPOINTMENTS: Appointment[] = [
  {
    summary: '1st appointment',
    start: {
      dateTime: addHours(-0.5).toISOString(),
    },
    end: {
      dateTime: addHours(0.5).toISOString(),
    },
  },
  {
    summary: '2nd appointment',
    start: {
      dateTime: addHours(2).toISOString(),
    },
    end: {
      dateTime: addHours(2.5).toISOString(),
    },
  },
  {
    summary: '3rd appointment',
    start: {
      dateTime: addHours(4).toISOString(),
    },
    end: {
      dateTime: addHours(5).toISOString(),
    },
  },
];
