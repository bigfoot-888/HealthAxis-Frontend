import { formatCreatedAt } from '@/utils/date-formatters';
import { PatientStatusChip } from '@patients/components/ui/PatientChips';
import { PATIENT_STATUS_CONFIG } from '@/shared/constants/patient.constants';

export const PATIENT_COLUMNS = {
    nhc: { field: 'nhc', headerName: 'NHC', flex: 2 },
    name: { field: 'name', headerName: 'Nombre', flex: 2 },
    surname: { field: 'surname', headerName: 'Apellidos', flex: 2 },
    dateOfBirth: {
        field: 'dateOfBirth',
        headerName: 'Fecha de Nacimiento',
        flex: 2,
        type: 'date',
        valueGetter: (value) => {
            return new Date(value);
        },
    },
    dni: { field: 'dni', headerName: 'DNI', flex: 2 },
    status: {
        field: 'status',
        headerName: 'Estado',
        flex: 2,
        valueGetter: (value) => {
            return PATIENT_STATUS_CONFIG[value].label;
        },
        renderCell: (params) => {
            return <PatientStatusChip value={params.row.status} />;
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
