import React from 'react';
import { Card, CardContent, Typography, Grid, Avatar, Chip, Stack, Box } from '@mui/material';
import { Link } from 'react-router';

import { calculateAge, translateSex } from '@patients/utils/patient.utils';

export default function PatientSummaryCard({ patient }) {
    if (!patient) return null;

    const patientName = patient.name?.trim() || '';
    const patientSurname = patient.surname?.trim() || '';

    const initials = `${patientName.charAt(0)}${patientSurname.charAt(0)}`.toUpperCase();
    const age = calculateAge(patient.dateOfBirth);

    return (
        <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems='center'>
                    {/* Avatar */}
                    <Grid>
                        <Avatar
                            sx={{
                                width: 56,
                                height: 56,
                                fontSize: '1.25rem',
                                bgcolor: 'grey.300',
                                color: 'grey.800',
                            }}
                        >
                            {initials}
                        </Avatar>
                    </Grid>

                    {/* Main info */}
                    <Grid size={{ xs: 12, sm: 'grow' }}>
                        <Stack spacing={0.5}>
                            <Stack direction='row' spacing={1} alignItems='center' flexWrap='wrap'>
                                <Typography
                                    variant='subtitle1'
                                    sx={{ fontWeight: 600 }}
                                    component={Link}
                                    to={`/patients/${patient.uuid}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    {patientSurname}, {patientName}
                                </Typography>

                                <Chip
                                    label={patient.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                                    size='small'
                                    color={patient.status === 'ACTIVE' ? 'success' : 'default'}
                                    variant='outlined'
                                />
                            </Stack>

                            <Typography variant='body2' color='text.secondary'>
                                {age} años • {translateSex(patient.sex)}
                            </Typography>

                            <Typography variant='body2' color='text.secondary'>
                                DNI: {patient.dni || '—'} • NHC: {patient.nhc || '—'}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
