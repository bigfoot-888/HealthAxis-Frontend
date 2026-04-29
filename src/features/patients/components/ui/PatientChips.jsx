import { PATIENT_STATUS_CONFIG } from '@/shared/constants/patient.constants';
import { Chip } from '@mui/material';

export function PatientStatusChip({ value }) {
    return (
        <Chip
            label={PATIENT_STATUS_CONFIG[value].label || value}
            color={PATIENT_STATUS_CONFIG[value].color || 'default'}
            size='small'
        />
    );
}