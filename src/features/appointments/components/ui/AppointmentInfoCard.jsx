import {
    Card,
    CardContent,
    Grid,
    Stack,
    Typography,
    Chip,
    Divider,
    Box,
    Button,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import AppointmentChip from '@appointments/components/ui/AppointmentChip';

import { Link } from 'react-router';
import { formatDateTimeUTC } from '@/utils/date-formatters';

function translateType(type) {
    return type === 'VIRTUAL' ? 'Virtual' : 'Presencial';
}

function isCompleted(appointment) {
    return appointment.status === 'COMPLETED';
}

function isCheckedIn(appointment) {
    return appointment.status === 'CHECKED_IN';
}

function isScheduled(row) {
    return row.status === 'SCHEDULED';
}

function isCancelled(row) {
    return row.status === 'NO_SHOW' || row.status !== 'CANCELLED';
}

export default function AppointmentInfoCard({
    appointment,
    onCheckIn,
    onComplete,
    onCancel,
}) {
    if (!appointment) return null;

    return (
        <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Grid container spacing={3} alignItems='flex-start'>
                    
                    {/* Icon */}
                    <Grid>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'grey.300',
                                color: 'grey.800',
                            }}
                        >
                            <EventIcon sx={{ fontSize: '2rem' }} />
                        </Box>
                    </Grid>

                    {/* Main info */}
                    <Grid size={{ xs: 12, sm: 'grow' }}>
                        <Stack direction='row' spacing={2} alignItems='center' mb={1} flexWrap='wrap'>
                            <Typography variant='h4' sx={{ fontWeight: 600 }}>
                                {appointment.reason}
                            </Typography>

                            <AppointmentChip/>
                        </Stack>

                        <Stack direction='row' spacing={3} mb={2} flexWrap='wrap'>
                            <Typography variant='body1'>
                                <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                    Tipo:{' '}
                                </Box>
                                {translateType(appointment.type)}
                            </Typography>

                            {appointment.location && (
                                <Typography variant='body1'>
                                    <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        Ubicación:{' '}
                                    </Box>
                                    {appointment.location}
                                </Typography>
                            )}
                        </Stack>

                        <Divider sx={{ my: 1.5 }} />

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='body2'>
                                    <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        Inicio:{' '}
                                    </Box>
                                    {formatDateTimeUTC(appointment.startTime)}
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='body2'>
                                    <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        Fin:{' '}
                                    </Box>
                                    {appointment.endTime
                                        ? formatDateTimeUTC(appointment.endTime)
                                        : '—'}
                                </Typography>
                            </Grid>

                            {appointment.notes && (
                                <Grid size={12}>
                                    <Typography variant='body2'>
                                        <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                            Notas:{' '}
                                        </Box>
                                        {appointment.notes}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>

                    {/* Actions */}
                    <Grid size={{ xs: 12, md: 'auto' }}>
                        <Stack direction={{ xs: 'column', sm: 'row', md: 'column' }} spacing={1.5}>
                            {isScheduled(appointment) && (
                                <Button
                                    variant='contained'
                                    color='secondary'
                                    startIcon={<HowToRegIcon />}
                                    onClick={() => onCheckIn?.(appointment)}
                                >
                                    Check-in
                                </Button>
                            )}
                            {!isCompleted(appointment) && isCheckedIn(appointment) && (
                                <Button
                                    variant='contained'
                                    startIcon={<TaskAltIcon />}
                                    onClick={() => onComplete?.(appointment)}
                                >
                                    Completar
                                </Button>
                            )}
                            {!isCancelled(appointment) && (
                                <Button
                                    variant='outlined'
                                    color='error'
                                    startIcon={<HighlightOffIcon />}
                                    onClick={() => onCancel?.(appointment)}
                                >
                                    Cancelar
                                </Button>
                            )}
                            <Button
                                variant='text'
                                startIcon={<EditIcon />}
                                component={Link}
                                to={`/appointments/edit/${appointment.uuid}`}
                                state={{ from: `/appointments/${appointment.uuid}` }}
                            >
                                Editar
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}