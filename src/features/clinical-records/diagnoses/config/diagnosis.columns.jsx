import { formatCreatedAt, formatDateTimeUTC } from '@/utils/date-formatters';
import {
    DiagnosisStatusChip,
    DiagnosisSeverityChip,
    DiagnosisClinicalStatusChip,
} from '@diagnoses/components/ui/DiagnosisChips';
import {
    DIAGNOSIS_STATUS_CONFIG,
    DIAGNOSIS_SEVERITY_CONFIG,
    DIAGNOSIS_CLINICAL_STATUS_CONFIG,
} from '@/shared/constants/diagnosis.constants';

export const DIAGNOSIS_COLUMNS = {
    name: {
        field: 'name',
        headerName: 'Nombre',
        flex: 3,
    },
    severity: {
        field: 'severity',
        headerName: 'Gravedad',
        flex: 2,
        valueGetter: (value) => {
            return DIAGNOSIS_SEVERITY_CONFIG[value].label;
        },
        renderCell: (params) => {
            return <DiagnosisSeverityChip value={params.row.severity} />;
        },
    },
    patient: {
        field: 'patient',
        headerName: 'Paciente',
        flex: 2,
        valueGetter: (value, row) => row.patient?.fullName || 'N/A',
    },
    users: {
        field: 'users',
        headerName: 'Profesionales',
        flex: 3,
        valueGetter: (value, row) => {
            return row.users ? row.users.map((user) => user.fullName).join(', ') : '';
        },
    },
    diagnosedAt: {
        field: 'diagnosedAt',
        headerName: 'Fecha de diagnóstico',
        type: 'dateTime',
        flex: 3,
        valueGetter: (value) => {
            const date = value instanceof Date ? value : new Date(value);
            return isNaN(date) ? null : date;
        },
        valueFormatter: (value) => formatDateTimeUTC(value),
    },
    clinicalStatus: {
        field: 'clinicalStatus',
        headerName: 'Estado',
        flex: 2,
        valueGetter: (value) => {
            return DIAGNOSIS_CLINICAL_STATUS_CONFIG[value].label;
        },
        renderCell: (params) => {
            return <DiagnosisClinicalStatusChip value={params.row.clinicalStatus} />;
        },
    },
    status: {
        field: 'status',
        headerName: 'Estado del registro',
        flex: 2,
        valueGetter: (value) => {
            return DIAGNOSIS_STATUS_CONFIG[value].label;
        },
        renderCell: (params) => {
            return <DiagnosisStatusChip value={params.row.status} />;
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
};
