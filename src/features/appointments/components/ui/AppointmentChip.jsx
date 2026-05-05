import { APPOINTMENT_STATUS_CONFIG } from "@/shared/constants/appointment.constants";
import { Chip } from "@mui/material";

export default function AppointmentChip({value}) {
    return (
        <Chip
            label={APPOINTMENT_STATUS_CONFIG[value].label || value}
            color={APPOINTMENT_STATUS_CONFIG[value].color || 'default'}
            size='small'
        />
    );
}
