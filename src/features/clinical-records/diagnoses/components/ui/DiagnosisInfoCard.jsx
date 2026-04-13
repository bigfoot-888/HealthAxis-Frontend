import { Card, CardContent, Grid, Typography, Divider, Box, Stack } from '@mui/material';

import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

import { formatDateTimeUTC } from '@/utils/date-formatters';

import { DiagnosisClinicalStatusChip, DiagnosisSeverityChip } from '@diagnoses/components/ui/DiagnosisChips';

export default function DiagnosisInfoCard({ diagnosis }) {
    if (!diagnosis) return null;

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
                            <MedicalInformationIcon sx={{ fontSize: '2rem' }} />
                        </Box>
                    </Grid>

                    {/* Main info */}
                    <Grid size={{ xs: 12, sm: 'grow' }}>
                        {/* Title */}
                        <Typography variant='h4' sx={{ fontWeight: 600 }} mb={1}>
                            {diagnosis.name}
                        </Typography>

                        {/* Description */}
                        {diagnosis.description && (
                            <Typography variant='body1' color='text.secondary' mb={2}>
                                {diagnosis.description}
                            </Typography>
                        )}

                        <Divider sx={{ my: 1.5 }} />

                        <Grid container spacing={2}>
                            {/* Severity */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Stack direction='row' spacing={1} alignItems='center'>
                                    <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        Gravedad:
                                    </Typography>
                                    <DiagnosisSeverityChip value={diagnosis.severity} />
                                </Stack>
                            </Grid>

                            {/* Clinical status */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Stack direction='row' spacing={1} alignItems='center'>
                                    <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        Estado clínico:
                                    </Typography>
                                    <DiagnosisClinicalStatusChip value={diagnosis.clinicalStatus} />
                                </Stack>
                            </Grid>

                            {/* Diagnosed at */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='body2'>
                                    <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        Diagnosticado el:{' '}
                                    </Box>
                                    {formatDateTimeUTC(diagnosis.diagnosedAt)}
                                </Typography>
                            </Grid>

                            {/* Resolved at */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='body2'>
                                    <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                        Resuelto el:{' '}
                                    </Box>
                                    {diagnosis.resolvedAt ? formatDateTimeUTC(diagnosis.resolvedAt) : '—'}
                                </Typography>
                            </Grid>

                            {/* Notes */}
                            {diagnosis.notes && (
                                <Grid size={12}>
                                    <Typography variant='body2'>
                                        <Box component='span' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                            Notas:{' '}
                                        </Box>
                                        {diagnosis.notes}
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
