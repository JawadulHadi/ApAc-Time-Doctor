export type FormattedDates = {
  individual: string;
  multiLine: string;
  commaSeparated: string;
  range: string;
  emailFormat: string;
};
export class DateHelper {
  static formatDateBeautifully(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  static formatDatesForEmail(dates: (Date | string)[]): string {
    if (dates.length === 0) return '';
    const dateObjects = dates
      .map(date => (typeof date === 'string' ? new Date(date) : date))
      .sort((a, b) => a.getTime() - b.getTime());
    const formattedDates = dateObjects.map(date =>
      date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    );
    return formattedDates.join(' | ');
  }
  static formatDateRange(dates: (Date | string)[]): string {
    if (dates.length === 0) return '';
    const dateObjects = dates
      .map(date => (typeof date === 'string' ? new Date(date) : date))
      .sort((a, b) => a.getTime() - b.getTime());
    if (dateObjects.length === 1) {
      return this.formatDateBeautifully(dateObjects[0]);
    }
    const firstDate = dateObjects[0];
    const lastDate = dateObjects[dateObjects.length - 1];
    if (
      firstDate.getMonth() === lastDate.getMonth() &&
      firstDate.getFullYear() === lastDate.getFullYear()
    ) {
      return `${firstDate.getDate()} - ${lastDate.getDate()} ${firstDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    } else if (firstDate.getFullYear() === lastDate.getFullYear()) {
      return `${firstDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${lastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return `${firstDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${lastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
  }
  static formatMultipleDatesBeautifully(dates: (Date | string)[]): string[] {
    const dateObjects = dates
      .map(date => (typeof date === 'string' ? new Date(date) : date))
      .sort((a, b) => a.getTime() - b.getTime());
    return dateObjects.map(date => this.formatDateBeautifully(date));
  }
  static Dates(dates: (Date | string)[] | null | undefined): FormattedDates {
    if (!dates || dates.length === 0) {
      return {
        individual: 'N/A',
        multiLine: 'N/A',
        commaSeparated: 'N/A',
        range: 'N/A',
        emailFormat: 'N/A',
      };
    }
    const individualDates = this.formatMultipleDatesBeautifully(dates);
    return {
      individual: individualDates[0],
      multiLine: individualDates.join('\n'),
      commaSeparated: individualDates.join(', '),
      range: this.formatDateRange(dates),
      emailFormat: this.formatDatesForEmail(dates),
    };
  }
}
