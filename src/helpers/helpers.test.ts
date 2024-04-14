import { formatDate } from './helpers';

describe('formatDate function', () => {
  it('should format date to mm/dd/yyyy format', () => {
    // Test with a date string
    expect(formatDate('2024-04-09')).toBe('04/09/2024');

    expect(formatDate('05/20/2024')).toBe('05/20/2024');
    expect(formatDate(new Date('05/20/2024'))).toBe('05/20/2024');
    // Test with a Date object
    expect(formatDate(new Date(2024, 3, 9))).toBe('04/09/2024');
  });

  // it('should handle invalid input', () => {
  //   // Test with an invalid date string
  //   expect(formatDate('invalid')).toBe('Invalid Date');
  // });
});
