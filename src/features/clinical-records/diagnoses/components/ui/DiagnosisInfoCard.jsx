import { Grid, Card, CardContent, Typography, Divider, Box, Stack } from '@mui/material';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

import { formatDateTimeUTC } from '@/utils/date-formatters';
import { DiagnosisClinicalStatusChip, DiagnosisSeverityChip } from '@diagnoses/components/ui/DiagnosisChips';
import { DataItem, PrimaryInfoCard } from '@/components/ui';
import { DiagnosisStatusChip } from './DiagnosisChips';

export default function DiagnosisInfoCard({ diagnosis }) {
    if (!diagnosis) return null;

    return (
        <PrimaryInfoCard>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent='space-between'
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={3}
                >
                    <Box display='flex' gap={2} alignItems='flex-start' flex={1}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                flexShrink: 0,
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'primary.container',
                                color: 'primary.onContainer',
                            }}
                        >
                            <MedicalInformationIcon sx={{ fontSize: '1.75rem' }} />
                        </Box>

                        <Box>
                            <Typography variant='h5' sx={{ fontWeight: 600, color: 'onSurface', mb: 0.5 }}>
                                {diagnosis.name}
                            </Typography>

                            {diagnosis.description && (
                                <Typography variant='body2' sx={{ color: 'onSurfaceVariant' }}>
                                    {diagnosis.description}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                        sx={{ flexShrink: 0 }}
                    >
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
                                Gravedad
                            </Typography>
                            <DiagnosisSeverityChip value={diagnosis.severity} />
                        </Stack>

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
                                Estado clínico
                            </Typography>
                            <DiagnosisClinicalStatusChip value={diagnosis.clinicalStatus} />
                        </Stack>

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
                            <DiagnosisStatusChip value={diagnosis.status} />
                        </Stack>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 3, borderColor: 'outlineVariant' }} />

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <DataItem label='Diagnosticado el' value={formatDateTimeUTC(diagnosis.diagnosedAt)} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <DataItem
                            label='Resuelto el'
                            value={diagnosis.resolvedAt ? formatDateTimeUTC(diagnosis.resolvedAt) : null}
                        />
                    </Grid>

                    {diagnosis.notes && (
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
                                <DataItem label='Notas adicionales' value={diagnosis.notes} />
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </CardContent>
        </PrimaryInfoCard>
    );
}
