import { newAppointmentProps, newGoogleEvent } from '../spec-helper/fixtures';
import { convertGoogleEventToAppointment } from './appointment';

describe('convert google event to appointment', () => {
  it('should convert google appointment', () => {
    const mockGoogleAppointment = newGoogleEvent({
      summary: 'Test Termin',
      start: {
        dateTime: '2022-09-28T14:00:00+02:00',
      },
      end: {
        dateTime: '2022-09-28T15:00:00+02:00',
      },
    });

    const result = convertGoogleEventToAppointment(mockGoogleAppointment);
    expect(result).toEqual({
      id: undefined,
      summary: 'Test Termin',
      start: {
        dateTime: '2022-09-28T14:00:00+02:00',
      },
      end: {
        dateTime: '2022-09-28T15:00:00+02:00',
      },
      free: false,
    });
  });
});
