import React from 'react';
import { Card, CardContent, Typography, Avatar, Stack, Box } from '@mui/material';
import { Link } from 'react-router';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';

import { calculateAge, translateSex } from '@patients/utils/patient.utils';
import { SubtleChip } from '@/components/ui';

export default function PatientSummaryCard({ patient }) {
    if (!patient) return null;

    const patientName = patient.name?.trim() || '';
    const patientSurname = patient.surname?.trim() || '';

    const initials = `${patientName.charAt(0)}${patientSurname.charAt(0)}`.toUpperCase();
    const age = calculateAge(patient.dateOfBirth);

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
                    <Box display='flex' gap={2} alignItems='center' flex={1}>
                        <Avatar
                            sx={{
                                width: 56,
                                height: 56,
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                bgcolor: 'primary.container',
                                color: 'primary.onContainer',
                            }}
                        >
                            {initials}
                        </Avatar>

                        <Stack spacing={0.5}>
                            <Typography
                                variant='subtitle1'
                                component={Link}
                                to={`/patients/${patient.uuid}`}
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
                                {patientSurname}, {patientName}
                            </Typography>

                            <Stack direction='row' spacing={2} flexWrap='wrap' useFlexGap>
                                <Stack direction='row' spacing={0.5} alignItems='center'>
                                    <PersonIcon sx={{ fontSize: 16, color: 'onSurfaceVariant' }} />
                                    <Typography variant='body2' sx={{ color: 'onSurfaceVariant' }}>
                                        {age} años • {translateSex(patient.sex)}
                                    </Typography>
                                </Stack>

                                <Stack direction='row' spacing={0.5} alignItems='center'>
                                    <BadgeIcon sx={{ fontSize: 16, color: 'onSurfaceVariant' }} />
                                    <Typography variant='body2' sx={{ color: 'onSurfaceVariant' }}>
                                        DNI: {patient.dni || '—'} • NHC: {patient.nhc || '—'}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Box>

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
                        <SubtleChip
                            label={patient.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                            color={patient.status === 'ACTIVE' ? 'success' : 'default'}
                        />
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}
