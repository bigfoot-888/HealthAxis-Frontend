import {
    DIAGNOSIS_SEVERITY_LABELS,
    DIAGNOSIS_SEVERITY_COLORS,
    DIAGNOSIS_STATE_LABELS,
    DIAGNOSIS_STATE_COLORS,
    DIAGNOSIS_RECORD_STATE_LABELS,
    DIAGNOSIS_RECORD_STATE_COLORS,
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

export function DiagnosisStateChip({ value }) {
    return (
        <Chip
            label={DIAGNOSIS_STATE_LABELS[value] || value}
            color={DIAGNOSIS_STATE_COLORS[value] || 'default'}
            size='small'
        />
    );
}

export function DiagnosisRecordStateChip({ value }) {
    return (
        <Chip
            label={DIAGNOSIS_RECORD_STATE_LABELS[value] || value}
            color={DIAGNOSIS_RECORD_STATE_COLORS[value] || 'default'}
            size='small'
        />
    );
}
