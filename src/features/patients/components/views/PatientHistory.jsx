import { Stack, Box, Typography } from '@mui/material';
import { translate } from '@/utils/translation.utils';
import { formatDateTimeUTC } from '@/utils/date-formatters';
import { ContentLayout } from '@/components/layout';
import { DIAGNOSIS_CLINICAL_STATUS_CONFIG, DIAGNOSIS_STATUS_CONFIG } from '@/shared/constants/diagnosis.constants';
import { TREATMENT_CLINICAL_STATUS_CONFIG, TREATMENT_STATUS_CONFIG } from '@/shared/constants/treatment.constants';
import { APPOINTMENT_STATUS_CONFIG } from '@/shared/constants/appointment.constants';
function groupLogsByDate(logs) {
    const groups = {};

    logs.forEach((log) => {
        const date = new Date(log.createdAt);
        const key = date.toDateString();

        if (!groups[key]) {
            groups[key] = [];
        }

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

    // --- CLINICAL STATUS ---
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

    // --- RECORD STATUS ---
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

    // --- UPDATED ---
    if (action === 'UPDATED' && meta?.changes) {
        const fields = Object.keys(meta.changes);

        if (fields.length === 0) return 'Datos actualizados';

        return `Actualizado: ${fields.join(', ')}`;
    }

    // --- CREATED ---
    if (action === 'CREATED') {
        return `${translate(entityType)} creado`;
    }

    // --- DELETED ---
    if (action === 'DELETED') {
        return `${translate(entityType)} eliminado`;
    }

    // --- FALLBACK ---
    return `${translate(entityType)} · ${translate(action)}`;
}

export default function PatientHistory({ logs }) {
    const grouped = groupLogsByDate(logs);

    return (
        <ContentLayout drawer={false}>
            <Stack
                spacing={2}
                sx={(theme) => ({
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 2,
                })}
            >
                {Object.entries(grouped).map(([dateKey, dayLogs]) => (
                    <Box key={dateKey}>
                        {/* Header día */}
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

                        {/* Logs */}
                        <Stack spacing={1}>
                            {dayLogs.map((log, index) => (
                                <Box
                                    key={log.id}
                                    sx={{
                                        display: 'flex',
                                        gap: 1.5,
                                        alignItems: 'flex-start',
                                        py: 1,
                                    }}
                                >
                                    {/* Punto timeline */}
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

                                    {/* Contenido */}
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Stack direction='row' justifyContent='space-between' alignItems='center'>
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
            </Stack>
        </ContentLayout>
    );
}
