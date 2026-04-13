
import {
    TREATMENT_CLINICAL_STATUS_CONFIG,
    TREATMENT_STATUS_CONFIG,
} from '@/shared/constants/treatment.constants'; 
import { Chip } from '@mui/material';

export function TreatmentClinicalStatusChip({ value }) {
    return (
        <Chip
            label={TREATMENT_CLINICAL_STATUS_CONFIG[value].label || value}
            color={TREATMENT_CLINICAL_STATUS_CONFIG[value].color || 'default'}
            size='small'
        />
    );
}

export function TreatmentStatusChip({ value }) {
    return (
        <Chip
            label={TREATMENT_STATUS_CONFIG[value].label || value}
            color={TREATMENT_STATUS_CONFIG[value].color || 'default'}
            size='small'
        />
    );
}
