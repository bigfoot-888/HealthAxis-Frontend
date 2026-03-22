import { useMemo } from 'react';
import { getNestedValue } from '@/utils/get-nested-values';

/**
 * Hook for filtering items based on a search text
 * @param {Array} items - The array to filter
 * @param {string} searchText - The search query
 * @param {Array<string>} fields - Array of field paths to search in (e.g., ['id', 'user.fullName'])
 */
export function useSearchFilter(items, searchText, fields) {
  return useMemo(() => {
    if (!searchText) return items;

    const lowerSearch = searchText.toLowerCase();

    return items.filter((item) =>
      fields.some((fieldPath) => {
        const value = getNestedValue(item, fieldPath)?.toString().toLowerCase() || '';
        return value.includes(lowerSearch);
      })
    );
  }, [items, searchText, fields]);
}