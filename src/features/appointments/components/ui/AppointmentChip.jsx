import { APPPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS } from "@appointments/utils/appointment-statuses";
import { Chip } from "@mui/material";

export default function AppointmentChip({value}) {
    return (
        <Chip
            label={APPPOINTMENT_STATUS_LABELS[value] || value}
            color={APPOINTMENT_STATUS_COLORS[value] || 'default'}
            size='small'
        />
    );
}
