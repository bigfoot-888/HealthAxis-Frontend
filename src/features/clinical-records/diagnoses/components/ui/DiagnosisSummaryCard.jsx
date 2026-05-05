import React from 'react';
import { Card, CardContent, Typography, Stack, Box, Avatar } from '@mui/material';
import { Link } from 'react-router';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { formatDateTimeUTC } from '@/utils/date-formatters';
import { DiagnosisClinicalStatusChip, DiagnosisSeverityChip } from '@diagnoses/components/ui/DiagnosisChips';

export default function DiagnosisSummaryCard({ diagnosis }) {
    if (!diagnosis) return null;

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
                    <Box display='flex' gap={2} alignItems='flex-start' flex={1}>
                        <Avatar
                            sx={{
                                width: 48,
                                height: 48,
                                bgcolor: 'primary.container',
                                color: 'primary.onContainer',
                            }}
                        >
                            <MedicalInformationIcon sx={{ fontSize: '1.5rem' }} />
                        </Avatar>

                        <Stack spacing={0.5} sx={{ width: '100%' }}>
                            <Typography
                                variant='subtitle1'
                                component={Link}
                                to={`/clinical-records/diagnoses/${diagnosis.uuid}`}
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
                                {diagnosis.name}
                            </Typography>

                            <Stack direction='row' spacing={0.5} alignItems='center'>
                                <CalendarTodayIcon sx={{ fontSize: 16, color: 'onSurfaceVariant' }} />
                                <Typography variant='body2' sx={{ color: 'onSurfaceVariant' }}>
                                    {formatDateTimeUTC(diagnosis.diagnosedAt)}
                                </Typography>
                            </Stack>

                            {diagnosis.description && (
                                // So that it truncates once it goes beyond two lines
                                <Typography
                                    variant='body2'
                                    sx={{
                                        color: 'onSurfaceVariant',
                                        mt: 0.5,

                                        whiteSpace: 'normal',
                                        wordBreak: 'break-word',

                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {diagnosis.description}
                                </Typography>
                            )}
                        </Stack>
                    </Box>

                    <Stack direction='row' spacing={2} alignItems='center' flexWrap='wrap' useFlexGap>
                        {diagnosis.severity && (
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
                        )}

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
                            <DiagnosisClinicalStatusChip value={diagnosis.clinicalStatus} />
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}
