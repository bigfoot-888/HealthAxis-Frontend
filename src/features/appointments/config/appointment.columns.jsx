import { APPOINTMENT_STATUS_CONFIG } from '@/shared/constants/appointment.constants';
import { formatCreatedAt, formatDateTimeUTC } from '@/utils/date-formatters';
import AppointmentChip from '@appointments/components/ui/AppointmentChip';

export const APPOINTMENT_COLUMNS = {
    reason: {
        field: 'reason',
        headerName: 'Motivo',
        flex: 3,
    },
    startTime: {
        field: 'startTime',
        headerName: 'Fecha y hora de inicio',
        type: 'date',
        flex: 3,
        valueGetter: (value) => {
            const date = value instanceof Date ? value : new Date(value);
            return isNaN(date) ? null : date;
        },
        valueFormatter: (value) => formatDateTimeUTC(value),
    },
    patient: {
        field: 'patient',
        headerName: 'Paciente',
        flex: 2,
        valueGetter: (value, row) => row.patient?.fullName || 'N/A',
    },
    user: {
        field: 'user',
        headerName: 'Profesional',
        flex: 2,
        valueGetter: (value, row) => row.user?.fullName || 'N/A',
    },
    location: {
        field: 'location',
        headerName: 'Lugar',
        flex: 2,
    },
    status: {
        field: 'status',
        headerName: 'Estado',
        flex: 2,
        valueGetter: (value) => {
            return APPOINTMENT_STATUS_CONFIG[value].label;
        },
        renderCell: (params) => {
            return <AppointmentChip value={params.row.status} />;
        },
    },
    createdAt: {
        type: 'date',
        field: 'createdAt',
        headerName: 'Fecha de Creación',
        flex: 2,
        hide: true,
        valueGetter: (value) => {
            const date = value instanceof Date ? value : new Date(value);
            return isNaN(date) ? null : date;
        },
        valueFormatter: (value) => formatCreatedAt(value),
    },
    priority: {
        field: 'priority',
        headerName: 'Prioridad',
        hide: true,
    },
};
