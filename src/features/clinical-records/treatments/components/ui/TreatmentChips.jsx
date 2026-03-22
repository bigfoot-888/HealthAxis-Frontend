import {
    TREATMENT_STATE_LABELS,
    TREATMENT_STATE_COLORS,
    TREATMENT_RECORD_STATE_LABELS,
    TREATMENT_RECORD_STATE_COLORS,
} from '@treatments/utils/chip-values';
import { Chip } from '@mui/material';

export function TreatmentStateChip({ value }) {
    return (
        <Chip
            label={TREATMENT_STATE_LABELS[value] || value}
            color={TREATMENT_STATE_COLORS[value] || 'default'}
            size='small'
        />
    );
}

export function TreatmentRecordStateChip({ value }) {
    return (
        <Chip
            label={TREATMENT_RECORD_STATE_LABELS[value] || value}
            color={TREATMENT_RECORD_STATE_COLORS[value] || 'default'}
            size='small'
        />
    );
}
