
import { SubtleChip } from "@/components/ui";
import { APPOINTMENT_STATUS_CONFIG } from "@/shared/constants/appointment.constants";
import { formatCreatedAt } from "@/utils/date-formatters";
import { List, ListItem, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import { Link } from "react-router";

export default function CustomAppointmentsList({data}) {
    return (
        <List dense>
            {!Array.isArray(data) || data.length === 0 ? (
                <Typography color='text.secondary'>Sin datos</Typography>
            ) : (
                data.map((item, index) => (
                    <ListItem key={index} divider>
                        <ListItemButton component={Link} to={`/appointments/${item.uuid}`}>
                            <ListItemText
                                primary={
                                    <Stack direction='row' spacing={1} alignItems='center'>
                                        <Typography variant='body2'>
                                            {item.patient ? `${item.patient.name} ${item.patient.surname}` : 'Paciente'}
                                        </Typography>
                                        <SubtleChip label={APPOINTMENT_STATUS_CONFIG[item.status].label} />
                                    </Stack>
                                }
                                secondary={item.startTime ? formatCreatedAt(item.startTime) : ''}
                            />
                        </ListItemButton>
                    </ListItem>
                ))
            )}
        </List>
    );
}
