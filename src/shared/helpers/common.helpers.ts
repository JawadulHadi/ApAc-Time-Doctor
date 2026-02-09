export class CommonHelpers {
  /**
   * Sort array by updatedAt timestamp in descending order (newest first)
   * Falls back to createdAt if updatedAt is not available
   * @param items Array of items to sort
   * @returns Sorted array (newest first)
   */
  static sortByUpdateTime<T extends { updatedAt?: Date | string; createdAt?: Date | string }>(
    items: T[],
  ): T[] {
    return items.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }
}
