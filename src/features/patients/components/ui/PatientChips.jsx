import {
    PATIENT_STATUS_COLORS,
    PATIENT_STATUS_LABELS
} from '@patients/patient.constants.js';
import { Chip } from '@mui/material';

export function PatientStatusChip({ value }) {
    return (
        <Chip
            label={PATIENT_STATUS_LABELS[value] || value}
            color={PATIENT_STATUS_COLORS[value] || 'default'}
            size='small'
        />
    );
}