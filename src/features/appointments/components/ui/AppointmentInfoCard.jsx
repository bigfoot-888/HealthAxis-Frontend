import React from 'react';
import { Card, CardContent, Stack, Typography, Divider, Box, Button, Avatar, Grid } from '@mui/material';
import { Link } from 'react-router';

import EventIcon from '@mui/icons-material/Event';
import EditIcon from '@mui/icons-material/Edit';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import NotesIcon from '@mui/icons-material/Notes';

import AppointmentChip from '@appointments/components/ui/AppointmentChip';
import { DataItem, PrimaryInfoCard } from '@/components/ui';

import { formatDateTimeUTC } from '@/utils/date-formatters';
import { translate } from '@/utils/translation.utils';

function isCompleted(appointment) {
    return appointment.status === 'COMPLETED';
}
function isCheckedIn(appointment) {
    return appointment.status === 'CHECKED_IN';
}
function isScheduled(appointment) {
    return appointment.status === 'SCHEDULED';
}
function isCancelled(appointment) {
    return appointment.status === 'NO_SHOW' || appointment.status === 'CANCELLED';
}

export default function AppointmentInfoCard({ appointment, onCheckIn, onComplete, onCancel }) {
    if (!appointment) return null;

    return (
        <PrimaryInfoCard>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent='space-between'
                    alignItems='flex-start'
                    spacing={3}
                >
                    <Box display='flex' gap={2} alignItems='flex-start' flex={1}>
                        <Avatar
                            sx={{
                                width: 56,
                                height: 56,
                                flexShrink: 0,
                                bgcolor: 'primary.container',
                                color: 'primary.onContainer',
                            }}
                        >
                            <EventIcon sx={{ fontSize: '1.75rem' }} />
                        </Avatar>

                        <Box>
                            <Typography variant='h5' sx={{ fontWeight: 600, color: 'onSurface', mb: 0.5 }}>
                                {appointment.reason}
                            </Typography>

                            <Stack direction='row' spacing={2} flexWrap='wrap' useFlexGap sx={{ mt: 1 }}>
                                <Stack direction='row' spacing={0.5} alignItems='center'>
                                    <CategoryIcon sx={{ fontSize: 16, color: 'onSurfaceVariant' }} />
                                    <Typography variant='body2' sx={{ color: 'onSurfaceVariant' }}>
                                        {translate(appointment.type)}
                                    </Typography>
                                </Stack>

                                {appointment.location && (
                                    <Stack direction='row' spacing={0.5} alignItems='center'>
                                        <LocationOnIcon sx={{ fontSize: 16, color: 'onSurfaceVariant' }} />
                                        <Typography variant='body2' sx={{ color: 'onSurfaceVariant' }}>
                                            {appointment.location}
                                        </Typography>
                                    </Stack>
                                )}
                            </Stack>

                            {!isCompleted(appointment) && (
                                <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap sx={{ mt: 2 }}>
                                    {isScheduled(appointment) && (
                                        <Button
                                            variant='contained'
                                            color='secondary'
                                            size='small'
                                            startIcon={<HowToRegIcon />}
                                            onClick={() => onCheckIn?.(appointment)}
                                        >
                                            Check-in
                                        </Button>
                                    )}

                                    {!isCompleted(appointment) && isCheckedIn(appointment) && (
                                        <Button
                                            variant='contained'
                                            size='small'
                                            startIcon={<TaskAltIcon />}
                                            onClick={() => onComplete?.(appointment)}
                                        >
                                            Completar
                                        </Button>
                                    )}

                                    {!isCompleted(appointment) && !isCancelled(appointment) && (
                                        <Button
                                            variant='outlined'
                                            color='error'
                                            size='small'
                                            startIcon={<HighlightOffIcon />}
                                            onClick={() => onCancel?.(appointment)}
                                        >
                                            Cancelar
                                        </Button>
                                    )}

                                    {!isCompleted(appointment) && !isCancelled(appointment) && (
                                        <Button
                                            variant='outlined'
                                            size='small'
                                            startIcon={<EditIcon />}
                                            component={Link}
                                            to={`/appointments/edit/${appointment.uuid}`}
                                            state={{ from: `/appointments/${appointment.uuid}` }}
                                        >
                                            Editar
                                        </Button>
                                    )}
                                </Stack>
                            )}
                        </Box>
                    </Box>

                    <Stack spacing={0.5} alignItems={{ xs: 'flex-start', sm: 'flex-end' }} sx={{ flexShrink: 0 }}>
                        <Typography
                            variant='caption'
                            sx={{
                                color: 'onSurfaceVariant',
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                                fontWeight: 600,
                            }}
                        >
                            Estado
                        </Typography>
                        <AppointmentChip value={appointment.status} />
                    </Stack>
                </Stack>

                <Divider sx={{ my: 3, borderColor: 'outlineVariant' }} />

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <DataItem label='Inicio programado' value={formatDateTimeUTC(appointment.startTime)} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <DataItem label='Fin' value={formatDateTimeUTC(appointment.endTime)} />
                    </Grid>

                    {appointment.notes && (
                        <Grid size={12}>
                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: 'surfaceContainerLowest',
                                    border: '1px solid',
                                    borderColor: 'outlineVariant',
                                    borderRadius: 1,
                                }}
                            >
                                <DataItem label='Notas adicionales' value={appointment.notes} icon={NotesIcon} />
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </CardContent>
        </PrimaryInfoCard>
    );
}
