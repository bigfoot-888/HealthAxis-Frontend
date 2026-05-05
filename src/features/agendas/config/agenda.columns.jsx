import { AGENDA_PERIOD_STATUS_CONFIG, AGENDA_STATUS_CONFIG } from '@/shared/constants/agenda.constants';
import { formatCreatedAt, formatDate } from '@/utils/date-formatters';
import { AgendaPeriodStatusChip, AgendaStatusChip } from '@agendas/components/ui/AgendaChips';

export const AGENDA_COLUMNS = {
    id: { field: 'id', headerName: 'ID', flex: 1 },
    status: {
        field: 'status',
        headerName: 'Estado agenda',
        flex: 2,
        valueGetter: (value) => {
            return AGENDA_STATUS_CONFIG[value].label;
        },
        renderCell: (params) => {
            return <AgendaStatusChip value={params.row.status} />;
        },
    },
    name: { field: 'name', headerName: 'Nombre', flex: 2 },
    openingDate: {
        field: 'openingDate',
        headerName: 'Apertura',
        type: 'date',
        flex: 2,
        valueGetter: (value, row) => new Date(row.activePeriod?.openingDate),
    },
    closingDate: {
        field: 'closingDate',
        headerName: 'Cierre',
        type: 'date',
        flex: 2,
        valueGetter: (value, row) => new Date(row.activePeriod?.closingDate),
    },
    activePeriodStatus: {
        field: 'activePeriodStatus',
        headerName: 'Estado del periodo',
        flex: 2,
        valueGetter: (value, row) => {
            return AGENDA_PERIOD_STATUS_CONFIG[row.activePeriod.agendaStatus].label;
        },
        renderCell: (params) => {
            return <AgendaPeriodStatusChip value={params.row.activePeriod.agendaStatus} />;
        },
    },
    createdAt: {
        type: 'date',
        field: 'createdAt',
        headerName: 'Fecha de Creación',
        flex: 2,
        valueGetter: (value) => {
            const date = value instanceof Date ? value : new Date(value);
            return isNaN(date) ? null : date;
        },
        valueFormatter: (value) => formatCreatedAt(value),
    },
};
