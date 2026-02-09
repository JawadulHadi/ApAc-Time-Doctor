import { PaginatedResponse } from '../../types/interfaces/pagination.interface';
export class PaginationHelper {
  /**
   * Creates a PaginatedResponse object from the given data, total, page, and limit.
   * @param data The array of data to be paginated.
   * @param total The total number of items in the dataset.
   * @param page The current page number.
   * @param limit The number of items per page.
   * @returns A PaginatedResponse object containing the paginated data, total, page, limit, and totalPages.
   */
  static createPaginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
  /**
   * Calculates the skip value based on the given page and limit.
   * This value can be used to skip the first 'n' number of items in a dataset.
   * @example
   * const skip = PaginationHelper.calculateSkip(2, 10);
   * // skip = 10
   * @param page The page number.
   * @param limit The number of items per page.
   * @returns The calculated skip value.
   */
  static calculateSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }
  /**
   * Normalizes pagination parameters.
   * If page is not provided, defaults to 1.
   * If limit is not provided, defaults to 10.
   * If limit is greater than 100, sets limit to 100.
   * If limit is less than 0, sets limit to 0.
   * @param page The page number.
   * @param limit The number of items per page.
   * @returns An object containing the normalized page, limit, and skip values.
   */
  static normalizePagination(page?: number, limit?: number) {
    const normalizedPage = page && page > 0 ? page : 1;
    const normalizedLimit = limit && limit > 0 && limit <= 100 ? limit : 10;
    return {
      page: normalizedPage,
      limit: normalizedLimit,
      skip: this.calculateSkip(normalizedPage, normalizedLimit),
    };
  }
  /**
   * Checks if the given data is a PaginatedResponse object.
   * A PaginatedResponse object is defined as an object with the following properties:
   * - data: The array of data to be paginated.
   * - total: The total number of items in the dataset.
   * @param data The object to be checked.
   * @returns true if the object is a PaginatedResponse, false otherwise.
   */
  static isPaginatedResponse(data: any): data is PaginatedResponse<any> {
    return data && typeof data === 'object' && 'data' in data && 'total' in data;
  }
}
