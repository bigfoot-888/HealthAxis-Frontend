import { APPPOINTMENT_STATE_LABELS, APPOINTMENT_STATE_COLORS } from "@appointments/utils/appointment-states";
import { Chip } from "@mui/material";

export default function AppointmentChip({value}) {
    return (
        <Chip
            label={APPPOINTMENT_STATE_LABELS[value] || value}
            color={APPOINTMENT_STATE_COLORS[value] || 'default'}
            size='small'
        />
    );
}
