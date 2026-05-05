import { AGENDA_PERIOD_AGENDA_STATUS_CONFIG } from '@/shared/constants/agenda.constants';
import { formatCreatedAt, formatDate } from '@/utils/date-formatters';
import { AgendaPeriodAgendaStatusChip } from '@agendas/components/ui/AgendaChips';

export const AGENDA_PERIOD_COLUMNS = {
    openingDate: {
        field: 'openingDate',
        headerName: 'Fecha de apertura',
        type: 'date',
        flex: 3,
        valueGetter: (_, row) => new Date(row.openingDate),
        valueFormatter: (value) => formatDate(value),
    },

    closingDate: {
        field: 'closingDate',
        headerName: 'Fecha de cierre',
        type: 'date',
        flex: 3,
        valueGetter: (_, row) => new Date(row.closingDate),
        valueFormatter: (value) => formatDate(value),
    },
    status: {
        field: 'status',
        headerName: 'Estado del periodo',
        flex: 2,
        valueGetter: (value) => {
            return AGENDA_PERIOD_AGENDA_STATUS_CONFIG[value].label;
        },
        renderCell: (params) => {
            return <AgendaPeriodAgendaStatusChip value={params.row.status} />;
        },
    },
    createdAt: {
        type: 'date',
        field: 'createdAt',
        headerName: 'Fecha de creación',
        flex: 2,
        hide: true,
        valueGetter: (value) => {
            const date = value instanceof Date ? value : new Date(value);
            return isNaN(date) ? null : date;
        },
        valueFormatter: (value) => formatCreatedAt(value),
    },
};
