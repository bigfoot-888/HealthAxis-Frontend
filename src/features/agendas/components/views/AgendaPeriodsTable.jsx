import { useState, useMemo } from 'react';

import { NestedTableLayout } from '@/components/tables';
import { useSearchFilter } from '@/hooks/useSearchFilter';

import { AGENDA_PERIOD_COLUMNS } from '@agendas/config/agenda-period.columns';
import { AGENDA_PERIOD_AGENDA_STATUS_CONFIG } from '@/shared/constants/agenda.constants';
import { formatDate } from '@/utils/date-formatters';

export default function AgendaPeriodsTable({ periods }) {
    const [searchText, setSearchText] = useState('');

    const filteredPeriods = useSearchFilter(periods, searchText, null, [
        p => formatDate(p.openingDate),
        p => formatDate(p.closingDate),
        p => AGENDA_PERIOD_AGENDA_STATUS_CONFIG[p.status].label,
    ]);

    const columns = useMemo(() => {
        return [
            AGENDA_PERIOD_COLUMNS.openingDate,
            AGENDA_PERIOD_COLUMNS.closingDate,
            AGENDA_PERIOD_COLUMNS.status,
            AGENDA_PERIOD_COLUMNS.createdAt,
        ];
    }, []);

    return (
        <NestedTableLayout
            rows={filteredPeriods}
            columns={columns}
            searchValue={searchText}
            searchPlaceholder='Busca por ID, fechas o estado'
            onSearchChange={e => setSearchText(e.target.value)}
            sorting={{
                sortModel: [{ field: 'openingDate', sort: 'desc' }],
            }}
        />
    );
}
