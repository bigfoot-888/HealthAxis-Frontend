import { Stack, Box, Typography, Button } from '@mui/material';
import { translate } from '@/utils/translation.utils';
import { formatDateTimeUTC } from '@/utils/date-formatters';
import { ContentLayout } from '@/components/layout';
import { DIAGNOSIS_CLINICAL_STATUS_CONFIG, DIAGNOSIS_STATUS_CONFIG } from '@/shared/constants/diagnosis.constants';
import { TREATMENT_CLINICAL_STATUS_CONFIG, TREATMENT_STATUS_CONFIG } from '@/shared/constants/treatment.constants';
import { APPOINTMENT_STATUS_CONFIG } from '@/shared/constants/appointment.constants';
import { useMemo } from 'react';

function groupLogsByDate(logs) {
    const groups = {};
    logs.forEach(log => {
        const date = new Date(log.createdAt);
        const key = date.toDateString();
        if (!groups[key]) groups[key] = [];
        groups[key].push(log);
    });

    return groups;
}

function getDateLabel(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Hoy';
    if (date.toDateString() === yesterday.toDateString()) return 'Ayer';

    return date.toLocaleDateString();
}

function getLogDescription(log) {
    const { action, entityType, meta } = log;

    if (action === 'CLINICAL_STATUS_CHANGED') {
        if (entityType === 'DIAGNOSIS') {
            return `Estado clínico de diagnóstico cambiado de ${
                DIAGNOSIS_CLINICAL_STATUS_CONFIG[meta.previousClinicalStatus]?.label ??
                translate(meta.previousClinicalStatus)
            } a ${
                DIAGNOSIS_CLINICAL_STATUS_CONFIG[meta.newClinicalStatus]?.label ?? translate(meta.newClinicalStatus)
            }`;
        }

        if (entityType === 'TREATMENT') {
            return `Estado clínico de tratamiento cambiado de ${
                TREATMENT_CLINICAL_STATUS_CONFIG[meta.previousClinicalStatus]?.label ??
                translate(meta.previousClinicalStatus)
            } a ${
                TREATMENT_CLINICAL_STATUS_CONFIG[meta.newClinicalStatus]?.label ?? translate(meta.newClinicalStatus)
            }`;
        }
    }

    if (action === 'STATUS_CHANGED') {
        if (entityType === 'DIAGNOSIS') {
            return `Estado de diagnóstico cambiado de ${
                DIAGNOSIS_STATUS_CONFIG[meta.previousStatus]?.label ?? translate(meta.previousStatus)
            } a ${DIAGNOSIS_STATUS_CONFIG[meta.newStatus]?.label ?? translate(meta.newStatus)}`;
        }

        if (entityType === 'TREATMENT') {
            return `Estado de tratamiento cambiado de ${
                TREATMENT_STATUS_CONFIG[meta.previousStatus]?.label ?? translate(meta.previousStatus)
            } a ${TREATMENT_STATUS_CONFIG[meta.newStatus]?.label ?? translate(meta.newStatus)}`;
        }

        if (entityType === 'APPOINTMENT') {
            return `Estado de cita cambiado de ${
                APPOINTMENT_STATUS_CONFIG[meta.previousStatus]?.label ?? translate(meta.previousStatus)
            } a ${APPOINTMENT_STATUS_CONFIG[meta.newStatus]?.label ?? translate(meta.newStatus)}`;
        }

        return `Estado cambiado de ${translate(meta.previousStatus)} a ${translate(meta.newStatus)}`;
    }

    if (action === 'UPDATED' && meta?.changes) {
        const fields = Object.keys(meta.changes);

        if (fields.length === 0) return 'Datos actualizados';

        return `Actualizado: ${fields.join(', ')}`;
    }

    if (action === 'CREATED') {
        return `${translate(entityType)} creado`;
    }

    if (action === 'DELETED') {
        return `${translate(entityType)} eliminado`;
    }

    return `${translate(entityType)} · ${translate(action)}`;
}
export default function PatientHistory({ logs, onLoadMore, hasMore, isFetching }) {
    const grouped = useMemo(() => groupLogsByDate(logs), [logs]);

    return (
        <ContentLayout drawer={false}>
            <Stack
                spacing={2}
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 2,
                }}
            >
                {Object.entries(grouped).map(([dateKey, dayLogs]) => (
                    <Box key={dateKey}>
                        <Typography
                            variant='caption'
                            sx={{
                                fontWeight: 600,
                                color: 'text.secondary',
                                mb: 1,
                            }}
                        >
                            {getDateLabel(dateKey)}
                        </Typography>

                        <Stack spacing={1}>
                            {dayLogs.map(log => (
                                <Box
                                    key={log.id}
                                    sx={{
                                        display: 'flex',
                                        gap: 1.5,
                                        alignItems: 'flex-start',
                                        py: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            bgcolor: 'primary.main',
                                            mt: '6px',
                                            flexShrink: 0,
                                        }}
                                    />

                                    <Box sx={{ flexGrow: 1 }}>
                                        <Stack direction='row' justifyContent='space-between'>
                                            <Typography variant='body2'>{getLogDescription(log)}</Typography>

                                            <Typography variant='caption' color='text.secondary'>
                                                {formatDateTimeUTC(log.createdAt)}
                                            </Typography>
                                        </Stack>

                                        <Typography variant='caption' color='text.secondary'>
                                            {log.user ? `${log.user.name} ${log.user.surname}` : 'Sistema'}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                ))}

                {hasMore && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button onClick={onLoadMore} disabled={isFetching} variant='outlined'>
                            {isFetching ? 'Cargando...' : 'Cargar más'}
                        </Button>
                    </Box>
                )}
            </Stack>
        </ContentLayout>
    );
}
