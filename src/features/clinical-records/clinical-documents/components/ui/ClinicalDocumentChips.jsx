import {
    CLINICAL_DOCUMENT_STATUS_LABELS,
    CLINICAL_DOCUMENT_STATUS_COLORS,
    CLINICAL_DOCUMENT_TYPE_COLORS,
    CLINICAL_DOCUMENT_TYPE_LABELS
} from '@clinical-documents/utils/chip-values';
import { Chip } from '@mui/material';


export function ClinicalDocumentStatusChip({ value }) {
    return (
        <Chip
            label={CLINICAL_DOCUMENT_STATUS_LABELS[value] || value}
            color={CLINICAL_DOCUMENT_STATUS_COLORS[value] || 'default'}
            size='small'
        />
    );
}

export function ClinicalDocumentTypeChip({ value }) {
    return (
        <Chip
            label={CLINICAL_DOCUMENT_TYPE_LABELS[value] || value}
            color={CLINICAL_DOCUMENT_TYPE_COLORS[value] || 'default'}
            size='small'
        />
    );
}