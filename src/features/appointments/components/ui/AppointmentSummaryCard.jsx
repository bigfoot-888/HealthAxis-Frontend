import React from 'react';
import { Card, CardContent, Typography, Stack, Box, Avatar } from '@mui/material';
import { Link } from 'react-router';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { formatDateTimeUTC } from '@/utils/date-formatters';
import AppointmentChip from '@appointments/components/ui/AppointmentChip';

export default function AppointmentSummaryCard({ appointment }) {
    if (!appointment) return null;

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 0,
                border: '1px solid',
                borderColor: 'outlineVariant',
                bgcolor: 'surfaceContainerLowest',
            }}
        >
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent='space-between'
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                >
                    <Box display='flex' gap={2} alignItems='flex-start' flex={1}>
                        <Avatar
                            sx={{
                                width: 48,
                                height: 48,
                                bgcolor: 'primary.container',
                                color: 'primary.onContainer',
                            }}
                        >
                            <EventIcon sx={{ fontSize: '1.5rem' }} />
                        </Avatar>

                        <Stack spacing={0.5} sx={{ width: '100%' }}>
                            <Typography
                                variant='subtitle1'
                                component={Link}
                                to={`/appointments/${appointment.uuid}`}
                                sx={{
                                    fontWeight: 600,
                                    color: 'onSurface',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                    '&:hover': {
                                        color: 'primary.main',
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                {appointment.reason || 'Cita programada'}
                            </Typography>

                            <Stack direction='row' spacing={2} flexWrap='wrap' useFlexGap sx={{ mt: 0.5 }}>
                                <Stack direction='row' spacing={0.5} alignItems='center'>
                                    <CalendarTodayIcon sx={{ fontSize: 16, color: 'onSurfaceVariant' }} />
                                    <Typography variant='body2' sx={{ color: 'onSurfaceVariant' }}>
                                        {formatDateTimeUTC(appointment.startTime)}
                                    </Typography>
                                </Stack>

                                {/* Ubicación y Tipo (Virtual/Presencial) */}
                                <Stack direction='row' spacing={0.5} alignItems='center'>
                                    <LocationOnIcon sx={{ fontSize: 16, color: 'onSurfaceVariant' }} />
                                    <Typography variant='body2' sx={{ color: 'onSurfaceVariant' }}>
                                        {appointment.location || '—'} •{' '}
                                        {appointment.type === 'VIRTUAL' ? 'Virtual' : 'Presencial'}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Box>

                    <Stack direction='row' spacing={2} alignItems='center' flexWrap='wrap' useFlexGap>
                        <Stack spacing={0.5} alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
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
                </Stack>
            </CardContent>
        </Card>
    );
}
