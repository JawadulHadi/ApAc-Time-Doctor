import { Months } from '../../../../types/constants/leave-bank.constants';
export class BankAnalytics {
  static buildAnalytics(transformedRecords: any[], originalRecords?: any[], month?: string): any {
    if (transformedRecords.length === 0) {
      return this.emptyAnalytics(month);
    }
    const allRecords = originalRecords || transformedRecords;
    const allActiveMonths = this.getAllActiveMonths(allRecords);
    const allActiveDepartments = this.getAllActiveDepartments(allRecords);
    const allActiveYears = this.getAllActiveYears(allRecords);
    const activeYears = allActiveYears.map(year => year.toString());
    const filterYears: { [key: string]: string[] } = {};
    allActiveYears.forEach(year => {
      const yearMonths = this.getMonthsForYear(allRecords, year);
      filterYears[year.toString()] = yearMonths;
    });
    const currentYear = allActiveYears.length > 0 ? allActiveYears[0] : new Date().getFullYear();
    const currentMonth = month?.toLowerCase();
    let filterMonths: string[];
    if (month) {
      filterMonths = [month];
    } else {
      const currentYearMonths = filterYears[currentYear.toString()] || [];
      filterMonths = currentYearMonths.length > 0 ? [currentMonth] : ['january'];
    }
    return {
      activeDepartments: allActiveDepartments,
      activeYears: activeYears,
      filterYears: filterYears,
      filterMonths: filterMonths,
    };
  }
  static getAllActiveDepartments(records: any[]): string[] {
    const departments = new Set<string>();
    records.forEach(record => {
      if (record.department && record.department.trim() !== '') {
        departments.add(record.department);
      }
    });
    return Array.from(departments).sort();
  }
  static getAllActiveMonths(records: any[]): string[] {
    const activeMonths = new Set<string>();
    records.forEach(record => {
      if (record.monthlyData && typeof record.monthlyData === 'object') {
        Object.keys(record.monthlyData).forEach(year => {
          const yearData = record.monthlyData[year];
          if (yearData && yearData.months && typeof yearData.months === 'object') {
            Object.keys(yearData.months).forEach(month => {
              const monthData = yearData.months[month];
              if (monthData && this.hasMonthData(monthData)) {
                activeMonths.add(month.toLowerCase());
              }
            });
          }
        });
      }
      Months.forEach(month => {
        const monthData = record[month];
        if (monthData && this.hasMonthData(monthData)) {
          activeMonths.add(month.toLowerCase());
        }
      });
    });
    const sortedActiveMonths = Months.filter(month => activeMonths.has(month));
    return sortedActiveMonths;
  }
  static getAllActiveYears(records: any[]): number[] {
    const activeYears = new Set<number>();
    records.forEach(record => {
      if (record.monthlyData && typeof record.monthlyData === 'object') {
        Object.keys(record.monthlyData).forEach(year => {
          const yearNum = parseInt(year);
          if (!isNaN(yearNum)) {
            const yearData = record.monthlyData[year];
            if (yearData && yearData.months && typeof yearData.months === 'object') {
              const hasMonthData = Object.values(yearData.months).some(
                monthData => monthData && this.hasMonthData(monthData),
              );
              if (hasMonthData) {
                activeYears.add(yearNum);
              }
            }
          }
        });
      }
      if (record.year && typeof record.year === 'number') {
        activeYears.add(record.year);
      }
    });
    return Array.from(activeYears).sort((a, b) => b - a);
  }
  static getMonthsForYear(records: any[], year: number): string[] {
    const monthsSet = new Set<string>();
    records.forEach(record => {
      if (record.monthlyData && typeof record.monthlyData === 'object') {
        const yearData = record.monthlyData[year.toString()];
        if (yearData && yearData.months && typeof yearData.months === 'object') {
          Object.keys(yearData.months).forEach(month => {
            const monthData = yearData.months[month];
            if (monthData && this.hasMonthData(monthData)) {
              monthsSet.add(month.toLowerCase());
            }
          });
        }
      }
    });
    return Months.filter(month => monthsSet.has(month));
  }
  static getCurrentMonth(): string {
    const months = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];
    const currentMonth = new Date().getMonth();
    return months[currentMonth];
  }
  static capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  static hasMonthData(monthData: any): boolean {
    return !!(
      monthData &&
      (monthData.workingDays > 0 ||
        monthData.casualLeave > 0 ||
        monthData.sickLeave > 0 ||
        monthData.shortHours > 0 ||
        monthData.extraHours > 0 ||
        monthData.absent > 0 ||
        monthData.netHoursWorked > 0)
    );
  }
  static getMonthRange(startMonth: string, endMonth: string): string {
    const startFormatted = startMonth.charAt(0).toUpperCase() + startMonth.slice(1);
    const endFormatted = endMonth.charAt(0).toUpperCase() + endMonth.slice(1);
    if (startMonth === endMonth) {
      return `${startFormatted} only`;
    }
    return `${startFormatted} - ${endFormatted}`;
  }
  static emptyAnalytics(month?: string, year?: string) {
    const currentMonth = month;
    const currentYear = year;
    const base = {
      activeDepartments: [],
      activeYears: [],
      filterYears: { [currentYear]: [currentMonth] },
      filterMonths: currentMonth ? [this.getMonthRange('january', month)] : ['No Data'],
    };
    return base;
  }
}
