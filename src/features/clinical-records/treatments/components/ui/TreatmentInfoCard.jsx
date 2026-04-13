import { Card, CardContent, Grid, Stack, Typography, Chip, Divider, Box, Button } from '@mui/material';

import MedicationIcon from '@mui/icons-material/Medication';
import EditIcon from '@mui/icons-material/Edit';

import { Link } from 'react-router';
import { formatDateTimeUTC } from '@/utils/date-formatters';

import { TreatmentClinicalStatusChip } from '@treatments/components/ui/TreatmentChips';

export default function TreatmentInfoCard({ treatment }) {
    if (!treatment) return null;
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
                            <MedicationIcon sx={{ fontSize: '2rem' }} />
                        </Box>
                    </Grid>

                    {/* Main info */}
                    <Grid size={{ xs: 12, sm: 'grow' }}>
                        <Stack direction='row' spacing={2} alignItems='center' mb={1} flexWrap='wrap'>
                            {/* Title */}
                            <Typography variant='h4' sx={{ fontWeight: 600 }}>
                                {treatment.name}
                            </Typography>

                            {/* Clinical status */}
                            <TreatmentClinicalStatusChip value={treatment.clinicalStatus}/>
                        </Stack>

                        {/* Description */}
                        {treatment.description && (
                            <Typography variant='body1' color='text.secondary' mb={2}>
                                {treatment.description}
                            </Typography>
                        )}

                        <Divider sx={{ my: 1.5 }} />

                        <Grid container spacing={2}>
                            {/* Duration */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='body2'>
                                    <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        Duración:{' '}
                                    </Box>
                                    {treatment.duration || '—'}
                                </Typography>
                            </Grid>

                            {/* Devised at */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='body2'>
                                    <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        Prescrito el:{' '}
                                    </Box>
                                    {formatDateTimeUTC(treatment.devisedAt)}
                                </Typography>
                            </Grid>

                            {/* Resolved at */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='body2'>
                                    <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        Finalizado el:{' '}
                                    </Box>
                                    {treatment.resolvedAt ? formatDateTimeUTC(treatment.resolvedAt) : '—'}
                                </Typography>
                            </Grid>

                            {/* Notes */}
                            {treatment.notes && (
                                <Grid size={12}>
                                    <Typography variant='body2'>
                                        <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                            Notas:{' '}
                                        </Box>
                                        {treatment.notes}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
