import React from 'react';
import { Card, CardContent, Typography, Grid, Chip, Stack } from '@mui/material';
import { Link } from 'react-router';

import { formatDateTimeUTC } from '@/utils/date-formatters';
import AppointmentChip from '@appointments/components/ui/AppointmentChip';

export default function AppointmentSummaryCard({ appointment }) {
    if (!appointment) return null;

    const patientName = `${appointment.patient?.surname ?? ''}, ${appointment.patient?.name ?? ''}`.trim();
    const userName = `${appointment.user?.surname ?? ''}, ${appointment.user?.name ?? ''}`.trim();

    return (
        <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems='center'>
                    {/* Main info */}
                    <Grid size={{ xs: 12 }}>
                        <Stack spacing={0.5}>
                            {/* Línea principal */}
                            <Stack direction='row' spacing={1} alignItems='center' flexWrap='wrap'>
                                <Typography
                                    variant='subtitle1'
                                    sx={{ fontWeight: 600 }}
                                    component={Link}
                                    to={`/appointments/${appointment.uuid}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    Cita asociada: {appointment.reason}
                                </Typography>

                                <AppointmentChip value={appointment.status} />
                            </Stack>

                            {/* Fecha */}
                            <Typography variant='body2' color='text.secondary'>
                                {formatDateTimeUTC(appointment.startTime)}
                            </Typography>

                            {/* Extra info */}
                            <Typography variant='body2' color='text.secondary'>
                                {appointment.location || '—'} •{' '}
                                {appointment.type === 'VIRTUAL' ? 'Virtual' : 'Presencial'}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
