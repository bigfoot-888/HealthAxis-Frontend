import { useMemo } from 'react';
import { getNestedValue } from '@/utils/get-nested-values';
export function useSearchFilter(items, searchText, fields = null, accessors = null) {
    return useMemo(() => {
        if (!searchText) return items;

        const lowerSearch = searchText.toLowerCase();

        if (fields) {
            return items.filter((item) =>
                fields.some((fieldPath) => {
                    const value = getNestedValue(item, fieldPath)?.toString().toLowerCase() || '';
                    return value.includes(lowerSearch);
                }),
            );
        } else {
            return items.filter((item) =>
                accessors.some((accessor) => {
                    const value = accessor(item)?.toString().toLowerCase() || '';
                    return value.includes(lowerSearch);
                }),
            );
        }
    }, [items, searchText, fields, accessors]);
}
