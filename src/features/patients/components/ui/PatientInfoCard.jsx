import React from 'react';
import { Card, CardContent, Stack, Typography, Box, Button, Avatar, Divider, Grid } from '@mui/material';
import { Link } from 'react-router';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { calculateAge, translateSex } from '@patients/utils/patient.utils';
import { DataItem, PrimaryInfoCard } from '@/components/ui';

import { PatientStatusChip } from '@patients/components/ui/PatientChips';

export default function PatientInfoCard({ patient }) {
    if (!patient) return null;

    const patientName = patient.name?.trim() || '';
    const patientSurname = patient.surname?.trim() || '';
    const initials = `${patientName.charAt(0) || ''}${patientSurname.charAt(0) || ''}`.toUpperCase();

    const age = calculateAge(patient.dateOfBirth);

    const addressLine1 = patient.addressLine1;
    const addressLine2 = patient.addressLine2;
    const fullAddress = [addressLine1, addressLine2].filter(Boolean).join(', ');

    return (
        <PrimaryInfoCard>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent='space-between'
                    alignItems={{ xs: 'flex-start', md: 'flex-start' }}
                    spacing={3}
                >
                    <Box display='flex' gap={2} alignItems='flex-start' flex={1}>
                        <Avatar
                            sx={{
                                width: 56,
                                height: 56,
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                flexShrink: 0,
                                bgcolor: 'primary.container',
                                color: 'primary.onContainer',
                            }}
                        >
                            {initials}
                        </Avatar>

                        <Box>
                            <Typography variant='h5' sx={{ fontWeight: 600, color: 'onSurface', mb: 0.5 }}>
                                {patientSurname}, {patientName}
                            </Typography>

                            <Stack direction='row' spacing={1} alignItems='center' flexWrap='wrap' useFlexGap>
                                {patient.nhc && (
                                    <Typography variant='body2' sx={{ color: 'onSurfaceVariant' }}>
                                        NHC: {patient.nhc}
                                    </Typography>
                                )}
                                {patient.nhc && patient.dni && (
                                    <Typography variant='body2' sx={{ color: 'outlineVariant' }}>
                                        •
                                    </Typography>
                                )}
                                {patient.dni && (
                                    <Typography variant='body2' sx={{ color: 'onSurfaceVariant' }}>
                                        DNI: {patient.dni}
                                    </Typography>
                                )}
                            </Stack>
                        </Box>
                    </Box>

                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={3}
                        alignItems={{ xs: 'flex-start', md: 'center' }}
                        sx={{ flexShrink: 0 }}
                    >
                        {/* Estado */}
                        <Stack spacing={0.5} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
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
                            <PatientStatusChip value={patient.status} />
                        </Stack>

                        <Stack direction='row' spacing={1.5} sx={{ mt: { xs: 1, md: 2.5 } }}>
                            <Button
                                variant='contained'
                                color='primary'
                                startIcon={<AddIcon />}
                                sx={{ borderRadius: 2 }}
                            >
                                Nueva Cita
                            </Button>

                            <Button
                                variant='outlined'
                                color='primary'
                                startIcon={<EditIcon />}
                                component={Link}
                                to={`/patients/edit/${patient.uuid}`}
                                state={{ from: `/patients/${patient.uuid}` }}
                                sx={{ borderRadius: 2 }}
                            >
                                Editar
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 3, borderColor: 'outlineVariant' }} />

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <DataItem label='Edad' value={`${age} años`} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <DataItem label='Sexo' value={translateSex(patient.sex)} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <DataItem label='Teléfono' value={patient.phone || '—'} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <DataItem label='Email' value={patient.email || '—'} />
                    </Grid>

                    {fullAddress && (
                        <Grid size={{ xs: 12, md: 6 }}>
                            <DataItem label='Dirección' value={fullAddress} />
                        </Grid>
                    )}
                </Grid>
            </CardContent>
        </PrimaryInfoCard>
    );
}
