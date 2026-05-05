import React from 'react';
import { Card, CardContent, Stack, Typography, Divider, Box, Avatar, Grid } from '@mui/material';

import MedicationIcon from '@mui/icons-material/Medication';
import NotesIcon from '@mui/icons-material/Notes';

import { formatDateTimeUTC } from '@/utils/date-formatters';
import { TreatmentClinicalStatusChip } from '@treatments/components/ui/TreatmentChips';
import { DataItem } from '@/components/ui';
import { TreatmentStatusChip } from './TreatmentChips';
import { PrimaryInfoCard } from '@/components/ui';

export default function TreatmentInfoCard({ treatment }) {
    if (!treatment) return null;

    return (
        <PrimaryInfoCard>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent='space-between'
                    alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
                    spacing={3}
                >
                    <Box display='flex' gap={2} alignItems='flex-start' flex={1}>
                        <Avatar
                            sx={{
                                width: 56,
                                height: 56,
                                flexShrink: 0,
                                bgcolor: 'primary.container',
                                color: 'primary.onContainer',
                            }}
                        >
                            <MedicationIcon sx={{ fontSize: '1.75rem' }} />
                        </Avatar>

                        <Box>
                            <Typography variant='h5' sx={{ fontWeight: 600, color: 'onSurface', mb: 0.5 }}>
                                {treatment.name}
                            </Typography>

                            {treatment.description && (
                                <Typography
                                    variant='body2'
                                    sx={{
                                        color: 'onSurfaceVariant',
                                        wordBreak: 'break-word',
                                        whiteSpace: 'normal',
                                    }}
                                >
                                    {treatment.description}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <Stack spacing={0.5} alignItems={{ xs: 'flex-start', sm: 'flex-end' }} sx={{ flexShrink: 0 }}>
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
                        <TreatmentClinicalStatusChip value={treatment.clinicalStatus} />
                    </Stack>

                    <Stack spacing={0.5} alignItems={{ xs: 'flex-start', sm: 'flex-end' }} sx={{ flexShrink: 0 }}>
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
                        <TreatmentStatusChip value={treatment.status} />
                    </Stack>
                </Stack>

                <Divider sx={{ my: 3, borderColor: 'outlineVariant' }} />

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <DataItem label='Duración' value={treatment.duration || '—'} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <DataItem
                            label='Finalizado el'
                            value={treatment.resolvedAt ? formatDateTimeUTC(treatment.resolvedAt) : null}
                        />
                    </Grid>

                    {treatment.notes && (
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
                                <DataItem label='Notas adicionales' value={treatment.notes} icon={NotesIcon} />
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </CardContent>
        </PrimaryInfoCard>
    );
}
