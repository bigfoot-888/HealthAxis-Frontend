import { formatDateTimeUTC, formatCreatedAt } from '@/utils/date-formatters';
import { TREATMENT_CLINICAL_STATUS_CONFIG, TREATMENT_STATUS_CONFIG } from '@/shared/constants/treatment.constants';
import { TreatmentStatusChip, TreatmentClinicalStatusChip } from '@treatments/components/ui/TreatmentChips';

export const TREATMENT_COLUMNS = {
    name: {
        field: 'name',
        headerName: 'Nombre',
        flex: 3,
    },
    patient: {
        field: 'patient',
        headerName: 'Paciente',
        flex: 2,
        valueGetter: (value, row) => row.patient.fullName || 'N/A',
    },
    users: {
        field: 'users',
        headerName: 'Profesionales',
        flex: 3,
        valueGetter: (value, row) => {
            return row.users ? row.users.map((user) => user.fullName).join(', ') : '';
        },
    },
    duration: {
        field: 'duration',
        headerName: 'Duración',
        flex: 2,
        valueGetter: (value) => {
            return value ? value : "N.A."
        }
    },
    clinicalStatus: {
        field: 'clinicalStatus',
        headerName: 'Estado',
        flex: 2,
        valueGetter: (value) => {
            return TREATMENT_CLINICAL_STATUS_CONFIG[value].label;
        },
        renderCell: (params) => {
            return <TreatmentClinicalStatusChip value={params.row.clinicalStatus} />;
        },
    },
    status: {
        field: 'status',
        headerName: 'Estado del registro',
        flex: 3,
        valueGetter: (value) => {
            return TREATMENT_STATUS_CONFIG[value].label;
        },
        renderCell: (params) => {
            return <TreatmentStatusChip value={params.row.status} />;
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
    diagnosisName: {
        field: 'diagnosisName',
        headerName: 'Diagnóstico',
        valueGetter: (value, row) => row.diagnosis?.name || 'N/A',
        flex: 3,
    },
};
