import { useState, useMemo } from 'react';

import { NestedTableLayout } from '@/components/tables';
import { useSearchFilter } from '@/hooks/useSearchFilter';

import { formatCreatedAt } from '@/utils/date-formatters';

import { AgendaPeriodAgendaStatusChip } from '@agendas/components/ui/AgendaChips';

export default function AgendaPeriodsTable({ periods }) {
    const [searchText, setSearchText] = useState('');

    const filteredPeriods = useSearchFilter(periods, searchText, [
        'id',
        'openingDate',
        'closingDate',
        'agendaStatus',
        'status',
    ]);

    const columns = useMemo(() => {
        return [
            {
                field: 'openingDate',
                headerName: 'Fecha de apertura',
                flex: 3,
            },
            {
                field: 'closingDate',
                headerName: 'Fecha de cierre',
                flex: 3,
            },
            {
                field: 'status',
                headerName: 'Estado del periodo',
                flex: 2,
                renderCell: (params) => {
                    const value = params.value;
                    return <AgendaPeriodAgendaStatusChip value={value} />;
                },
            },
            {
                type: 'date',
                field: 'createdAt',
                headerName: 'Fecha de creación',
                flex: 2,
                hide: true,
                valueFormatter: (value) => formatCreatedAt(value),
            },
        ];
    }, []);

    return (
        <NestedTableLayout
            rows={filteredPeriods}
            columns={columns}
            searchValue={searchText}
            searchPlaceholder='Busca por ID, fechas o estado'
            onSearchChange={(e) => setSearchText(e.target.value)}
            sorting={{
                sortModel: [{ field: 'openingDate', sort: 'desc' }],
            }}
        />
    );
}
