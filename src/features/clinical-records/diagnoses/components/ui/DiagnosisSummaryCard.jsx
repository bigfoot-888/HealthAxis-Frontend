import React from 'react';
import { Card, CardContent, Typography, Grid, Stack } from '@mui/material';
import { Link } from 'react-router';

import { formatDateTimeUTC } from '@/utils/date-formatters';

import { DiagnosisClinicalStatusChip, DiagnosisSeverityChip } from '@diagnoses/components/ui/DiagnosisChips';

export default function DiagnosisSummaryCard({ diagnosis }) {
    if (!diagnosis) return null;

    return (
        <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems='center'>
                    <Grid size={{ xs: 12 }}>
                        <Stack spacing={0.5}>
                            <Stack direction='row' spacing={1} alignItems='center' flexWrap='wrap'>
                                <Typography
                                    variant='subtitle1'
                                    sx={{ fontWeight: 600 }}
                                    component={Link}
                                    to={`/clinical-records/diagnoses/${diagnosis.uuid}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    Diagnóstico: {diagnosis.name}
                                </Typography>
                                <DiagnosisClinicalStatusChip value={diagnosis.clinicalStatus} />
                            </Stack>

                            <Typography variant='body2' color='text.secondary'>
                                {formatDateTimeUTC(diagnosis.diagnosedAt)}
                            </Typography>

                            {diagnosis.description && (
                                <Typography variant='body2' color='text.secondary'>
                                    {diagnosis.description}
                                </Typography>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
