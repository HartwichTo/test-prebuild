export function addHours(numOfHours: number, date = new Date()): Date {
  date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
  return date;
}
