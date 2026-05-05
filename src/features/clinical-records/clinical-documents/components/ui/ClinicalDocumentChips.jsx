import { CLINICAL_DOCUMENT_STATUS_CONFIG, CLINICAL_DOCUMENT_TYPE_CONFIG } from '@/shared/constants/clinical-document.constants';
import { Chip } from '@mui/material';


export function ClinicalDocumentStatusChip({ value }) {
    return (
        <Chip
            label={CLINICAL_DOCUMENT_STATUS_CONFIG[value].label || value}
            color={CLINICAL_DOCUMENT_STATUS_CONFIG[value].color || 'default'}
            size='small'
        />
    );
}

export function ClinicalDocumentTypeChip({ value }) {
    return (
        <Chip
            label={CLINICAL_DOCUMENT_TYPE_CONFIG[value].label || value}
            color={CLINICAL_DOCUMENT_TYPE_CONFIG[value].color || 'default'}
            size='small'
        />
    );
}