import {
    DIAGNOSIS_SEVERITY_LABELS,
    DIAGNOSIS_SEVERITY_COLORS,
    DIAGNOSIS_CLINICAL_STATUS_LABELS,
    DIAGNOSIS_CLINICAL_STATUS_COLORS,
    DIAGNOSIS_STATUS_LABELS,
    DIAGNOSIS_STATUS_COLORS,
} from '@diagnoses/utils/chip-values';
import { Chip } from '@mui/material';

export function DiagnosisSeverityChip({ value }) {
    return (
        <Chip
            label={DIAGNOSIS_SEVERITY_LABELS[value] || value}
            color={DIAGNOSIS_SEVERITY_COLORS[value] || 'default'}
            size='small'
        />
    );
}

export function DiagnosisClinicalStatusChip({ value }) {
    return (
        <Chip
            label={DIAGNOSIS_CLINICAL_STATUS_LABELS[value] || value}
            color={DIAGNOSIS_CLINICAL_STATUS_COLORS[value] || 'default'}
            size='small'
        />
    );
}

export function DiagnosisStatusChip({ value }) {
    return (
        <Chip
            label={DIAGNOSIS_STATUS_LABELS[value] || value}
            color={DIAGNOSIS_STATUS_COLORS[value] || 'default'}
            size='small'
        />
    );
}
