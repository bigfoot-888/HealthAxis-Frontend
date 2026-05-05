import { DIAGNOSIS_STATUS_CONFIG, DIAGNOSIS_CLINICAL_STATUS_CONFIG, DIAGNOSIS_SEVERITY_CONFIG } from '@/shared/constants/diagnosis.constants';
import { Chip } from '@mui/material';

export function DiagnosisSeverityChip({ value }) {
    return (
        <Chip
            label={DIAGNOSIS_SEVERITY_CONFIG[value].label || value}
            color={DIAGNOSIS_SEVERITY_CONFIG[value].color || 'default'}
            size='small'
        />
    );
}

export function DiagnosisClinicalStatusChip({ value }) {
    return (
        <Chip
            label={DIAGNOSIS_CLINICAL_STATUS_CONFIG[value].label || value}
            color={DIAGNOSIS_CLINICAL_STATUS_CONFIG[value].color || 'default'}
            size='small'
        />
    );
}

export function DiagnosisStatusChip({ value }) {
    return (
        <Chip
            label={DIAGNOSIS_STATUS_CONFIG[value].label || value}
            color={DIAGNOSIS_STATUS_CONFIG[value].color || 'default'}
            size='small'
        />
    );
}
