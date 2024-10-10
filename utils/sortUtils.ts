// utils/sortUtils.ts

export type SortConfig<T> = {
    key: keyof T;
    direction: 'asc' | 'desc';
  };
  
  export function sortData<T>(data: T[], sortConfig: SortConfig<T>): T[] {
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }