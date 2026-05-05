import {
    CLINICAL_DOCUMENT_STATUS_CONFIG,
    CLINICAL_DOCUMENT_TYPE_CONFIG,
} from '@/shared/constants/clinical-document.constants';
import { formatCreatedAt } from '@/utils/date-formatters';
import {
    ClinicalDocumentTypeChip,
    ClinicalDocumentStatusChip,
} from '@clinical-documents/components/ui/ClinicalDocumentChips';

export const CLINICAL_DOCUMENT_COLUMNS = {
    title: {
        field: 'title',
        headerName: 'Nombre',
        flex: 3,
    },
    documentType: {
        field: 'documentType',
        headerName: 'Tipo de documento',
        flex: 2,
        valueGetter: (value) => {
            return CLINICAL_DOCUMENT_TYPE_CONFIG[value].label;
        },
        renderCell: (params) => {
            return <ClinicalDocumentTypeChip value={params.row.documentType} />;
        },
    },
    users: {
        field: 'users',
        headerName: 'Usuarios involucrados',
        flex: 3,
        valueGetter: (value, row) => {
            return row.users ? row.users.map((user) => user.fullName).join(', ') : '';
        },
    },
    status: {
        field: 'status',
        headerName: 'Estado',
        flex: 2,
        valueGetter: (value) => {
            return CLINICAL_DOCUMENT_STATUS_CONFIG[value].label;
        },
        renderCell: (params) => {
            return <ClinicalDocumentStatusChip value={params.row.status} />;
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
