import React from 'react';
import { DetailLayout } from '@/components/entity-detail';
import { 
    Box, Card, CardContent, Typography, Grid, Button, Stack, List, 
    ListItem, ListItemText, Avatar, Chip, Divider 
} from '@mui/material';
import { usePatientContext } from '@patients/hooks/usePatientContext';
import { formatDateTimeUTC } from '@/utils/date-formatters';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { calculateAge, translateSex } from '@patients/utils/patient.utils';
import { TREATMENT_CLINICAL_STATUS_CONFIG } from '@/shared/constants/treatment.constants';

export default function PatientDetail() {
    const { setError, patient, uuid } = usePatientContext();

    if (!patient) return null;

    const patientName = patient.name?.trim() || '';
    const patientSurname = patient.surname?.trim() || '';
    const initials = `${patientName.charAt(0) || ''}${patientSurname.charAt(0) || ''}`.toUpperCase();
    const age = calculateAge(patient.date_of_birth);
    const fullAddress = [patient.address_line1, patient.address_line2].filter(Boolean).join(', ');

    return (
        <DetailLayout>
            <Stack sx={{ p: { xs: 2, md: 3 } }} spacing={3}>
                <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        <Grid container spacing={3} alignItems='flex-start'>
                            <Grid>
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        fontSize: '2rem',
                                        bgcolor: 'grey.300',
                                        color: 'grey.800',
                                    }}
                                >
                                    {initials}
                                </Avatar>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 'grow' }}>
                                <Stack direction='row' spacing={2} alignItems='center' mb={1} flexWrap='wrap'>
                                    <Typography variant='h4' sx={{ fontWeight: 600, color: 'text.primary' }}>
                                        {patientSurname}, {patientName}
                                    </Typography>
                                    <Chip
                                        label={patient.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                                        color={patient.status === 'ACTIVE' ? 'success' : 'default'}
                                        size='small'
                                        variant='outlined'
                                    />
                                </Stack>

                                <Stack direction='row' spacing={3} mb={2}>
                                    <Typography variant='body1'>
                                        <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                            NHC:{' '}
                                        </Box>
                                        {patient.nhc}
                                    </Typography>
                                    <Typography variant='body1'>
                                        <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                            DNI:{' '}
                                        </Box>
                                        {patient.dni}
                                    </Typography>
                                </Stack>

                                <Divider sx={{ my: 1.5 }} />

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Typography variant='body2'>
                                            <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                                Edad:{' '}
                                            </Box>
                                            {age} años
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Typography variant='body2'>
                                            <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                                Sexo:{' '}
                                            </Box>
                                            {translateSex(patient.sex)}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Typography variant='body2'>
                                            <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                                Teléfono:{' '}
                                            </Box>
                                            {patient.phone}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Typography variant='body2'>
                                            <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                                Email:{' '}
                                            </Box>
                                            {patient.email}
                                        </Typography>
                                    </Grid>
                                    <Grid size={12}>
                                        <Typography variant='body2'>
                                            <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                                Dirección:{' '}
                                            </Box>
                                            {patient.addressLine1 +
                                                (patient.addressLine2 ? ', ' + patient.addressLine2 : '')}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid size={{ xs: 12, md: 'auto' }}>
                                <Stack direction={{ xs: 'column', sm: 'row', md: 'column' }} spacing={1.5}>
                                    <Button
                                        variant='contained'
                                        startIcon={<AddIcon />}
                                        disableElevation
                                        size='large'
                                        sx={{ px: 3 }}
                                    >
                                        Nueva Cita
                                    </Button>
                                    <Button variant='text' startIcon={<EditIcon />} color='inherit'>
                                        Editar
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ height: '100%', borderRadius: 2 }} elevation={0} variant='outlined'>
                            <CardContent>
                                <Typography variant='subtitle1' sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                                    Próximas Citas
                                </Typography>
                                <Divider sx={{ mb: 1 }} />

                                {patient.appointments?.length > 0 ? (
                                    <List dense disablePadding>
                                        {patient.appointments.slice(0, 3).map((appt) => (
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
                            <CardContent>
                                <Typography variant='subtitle1' sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                                    Tratamientos
                                </Typography>
                                <Divider sx={{ mb: 1 }} />

                                {patient.treatments?.length > 0 ? (
                                    <List dense disablePadding>
                                        {patient.treatments.slice(0, 3).map((t) => (
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
                            <CardContent>
                                <Typography variant='subtitle1' sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                                    Diagnósticos
                                </Typography>
                                <Divider sx={{ mb: 1 }} />

                                {patient.diagnoses?.length > 0 ? (
                                    <List dense disablePadding>
                                        {patient.diagnoses.slice(0, 3).map((d) => (
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