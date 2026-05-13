import React from 'react';
import { DetailLayout } from '@/components/entity-detail';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Stack,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Chip,
    Divider,
} from '@mui/material';
import { usePatientContext } from '@patients/hooks/usePatientContext';
import { formatDateTimeUTC } from '@/utils/date-formatters';
import { TREATMENT_CLINICAL_STATUS_CONFIG } from '@/shared/constants/treatment.constants';
import PatientInfoCard from '@patients/components/ui/PatientInfoCard';
export default function PatientDetail() {
    const { patient } = usePatientContext();

    if (!patient) return null;

    return (
        <DetailLayout>
            <Stack sx={{ p: { xs: 2, md: 3 }, width: '100%' }} spacing={3}>
                <PatientInfoCard patient={patient} />

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ height: '100%', borderRadius: 2 }} elevation={0} variant='outlined'>
                            <CardContent sx={{ bgcolor: 'surfaceContainerLowest' }}>
                                <Typography variant='subtitle1' sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                                    Próximas Citas
                                </Typography>
                                <Divider sx={{ mb: 1 }} />

                                {patient.appointments?.length > 0 ? (
                                    <List dense disablePadding>
                                        {patient.appointments.slice(0, 3).map(appt => (
                                            <ListItem
                                                key={appt.id}
                                                disableGutters
                                                sx={{ alignItems: 'flex-start', py: 1 }}
                                            >
                                                <ListItemText
                                                    disableTypography
                                                    primary={
                                                        <Typography
                                                            variant='body2'
                                                            sx={{ fontWeight: 500, color: 'text.primary' }}
                                                        >
                                                            {appt.reason || 'Consulta General'}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography
                                                            variant='caption'
                                                            sx={{ color: 'text.secondary', display: 'block' }}
                                                        >
                                                            {appt.startTime
                                                                ? formatDateTimeUTC(appt.startTime)
                                                                : 'Sin fecha'}
                                                        </Typography>
                                                    }
                                                    sx={{ m: 0 }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant='body2' color='text.secondary' sx={{ py: 1 }}>
                                        Ninguna registrada.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ height: '100%', borderRadius: 2 }} elevation={0} variant='outlined'>
                            <CardContent sx={{ bgcolor: 'surfaceContainerLowest' }}>
                                <Typography variant='subtitle1' sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                                    Tratamientos
                                </Typography>
                                <Divider sx={{ mb: 1 }} />

                                {patient.treatments?.length > 0 ? (
                                    <List dense disablePadding>
                                        {patient.treatments.slice(0, 3).map(t => (
                                            <ListItem key={t.id} disableGutters sx={{ py: 1 }}>
                                                <ListItemText
                                                    disableTypography
                                                    primary={
                                                        <Typography
                                                            variant='body2'
                                                            sx={{ fontWeight: 500, color: 'text.primary' }}
                                                        >
                                                            {t.name}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography
                                                            variant='caption'
                                                            sx={{ color: 'text.secondary', display: 'block' }}
                                                        >
                                                            {TREATMENT_CLINICAL_STATUS_CONFIG[t.clinicalStatus].label}
                                                        </Typography>
                                                    }
                                                    sx={{ m: 0 }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant='body2' color='text.secondary' sx={{ py: 1 }}>
                                        Sin tratamientos activos.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ height: '100%', borderRadius: 2 }} elevation={0} variant='outlined'>
                            <CardContent sx={{ bgcolor: 'surfaceContainerLowest' }}>
                                <Typography variant='subtitle1' sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                                    Diagnósticos
                                </Typography>
                                <Divider sx={{ mb: 1 }} />

                                {patient.diagnoses?.length > 0 ? (
                                    <List dense disablePadding>
                                        {patient.diagnoses.slice(0, 3).map(d => (
                                            <ListItem
                                                key={d.id}
                                                disableGutters
                                                sx={{ alignItems: 'flex-start', py: 1 }}
                                            >
                                                <ListItemText
                                                    disableTypography
                                                    primary={
                                                        <Typography
                                                            variant='body2'
                                                            sx={{ fontWeight: 500, color: 'text.primary' }}
                                                        >
                                                            {d.name}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography
                                                            variant='caption'
                                                            sx={{ color: 'text.secondary', display: 'block' }}
                                                        >
                                                            {d.resolvedAt
                                                                ? `Resuelto: ${formatDateTimeUTC(d.resolvedAt)}`
                                                                : 'Activo'}
                                                        </Typography>
                                                    }
                                                    sx={{ m: 0 }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant='body2' color='text.secondary' sx={{ py: 1 }}>
                                        Ninguno registrado.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </DetailLayout>
    );
}
