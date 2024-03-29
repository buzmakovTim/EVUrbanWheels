import { Time } from "@angular/common";

export function getWeekdaysForNextMonths(numberOfMonths: number): string[] {
  const weekdays: string[] = [];
  const currentDate = new Date();

  for (let i = 0; i < numberOfMonths; i++) {
    const currentMonth = currentDate.getMonth();
    const nextMonth = currentMonth + i;
    const year = currentDate.getFullYear();

    const startDate = new Date(year, nextMonth, 1);
    const endDate = new Date(year, nextMonth + 1, 0);

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
        weekdays.push(formattedDate);
      }
    }
  }
  return weekdays;
}

export function formatTime(hour: number | string, minute: number | string, amPm: 'AM' | 'PM'): string {
  // Adjust the hour for AM/PM format
  if(typeof(hour) === 'string'){
    hour = parseInt(hour);
  }
  if(typeof(minute) === 'string'){
    minute = parseInt(minute);
  }

  if (amPm === 'PM' && hour !== 12) {
    hour += 12;
  } else if (amPm === 'AM' && hour === 12) {
    hour = 0;
  }
  // Pad the hour and minute with leading zeros if needed
  const formattedHour = hour.toString().padStart(2, '0');
  const formattedMinute = minute.toString().padStart(2, '0');
  // Combine the hour and minute to create the formatted time string
  const formattedTime = `${formattedHour}:${formattedMinute}:00`;

  return formattedTime;
}
