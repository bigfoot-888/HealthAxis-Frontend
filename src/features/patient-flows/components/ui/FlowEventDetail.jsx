import { Box, Typography, Stack, Chip, Divider, Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { formatDateTimeUTC } from '@/utils/date-formatters';
import { translate } from '@/utils/translation.utils';
import { SubtleChip } from '@/components/ui';
import { PATIENT_STATUS_CONFIG } from '@/shared/constants/patient.constants';
import { TREATMENT_CLINICAL_STATUS_CONFIG } from '@/shared/constants/treatment.constants';
import { APPOINTMENT_STATUS_CONFIG } from '@/shared/constants/appointment.constants';
import { DIAGNOSIS_CLINICAL_STATUS_CONFIG, DIAGNOSIS_SEVERITY_CONFIG } from '@/shared/constants/diagnosis.constants';
import { CLINICAL_DOCUMENT_STATUS_CONFIG, CLINICAL_DOCUMENT_TYPE_CONFIG } from '@/shared/constants/clinical-document.constants';

export default function FlowEventDetail({ node, onAddSecondaryNode, onDeleteSecondaryNode }) {
    const navigate = useNavigate();

    if (!node) return null;

    const { type, data } = node;
    const entity = data?.entity;
    const entityId = data?.entityId;

    const handleNavigate = () => {
        if (!entity?.uuid) return;

        const routes = {
            APPOINTMENT: `/appointments/${entity.uuid}`,
            DIAGNOSIS: `/clinical-records/diagnoses/${entity.uuid}`,
            TREATMENT: `/clinical-records/treatments/${entity.uuid}`,
            PATIENT: `/patients/${entity.uuid}`,
            CLINICAL_DOCUMENT: `/clinical-records/clinical-documents/${entity.uuid}`,
        };

        if (routes[type]) navigate(routes[type]);
    };

    return (
        <Box
            sx={(theme) => ({
                width: 320,
                flexShrink: 0,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: theme.palette.background.paper,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            })}
        >
            <Box sx={{ p: 2, pb: 1.5 }}>
                <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
                    <Typography
                        variant='subtitle2'
                        color='text.secondary'
                        textTransform='uppercase'
                        fontWeight='bold'
                        letterSpacing={0.5}
                    >
                        Detalle del evento
                    </Typography>
                    <Chip
                        label={translate(type)}
                        size='small'
                        color='primary'
                        variant='outlined'
                        sx={{ fontWeight: 500 }}
                    />
                </Stack>

                <Typography
                    variant='h6'
                    sx={{
                        lineHeight: 1.2,
                        mb: 1,
                        minHeight: '2.4em',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {data?.title ?? 'Sin título'}
                </Typography>

                {data?.date && (
                    <Typography variant='body2' color='text.secondary'>
                        {formatDateTimeUTC(data.date)}
                    </Typography>
                )}
            </Box>

            <Divider />

            {entity && (
                <Box sx={{ p: 2, flexGrow: 1 }}>
                    <Typography variant='overline' color='text.secondary' display='block' gutterBottom>
                        Información Asociada
                    </Typography>

                    <Box sx={{ pt: 0.5 }}>
                        {type === 'APPOINTMENT' && (
                            <Stack spacing={1.5} alignItems='flex-start'>
                                <Typography variant='body1' fontWeight='medium'>
                                    {entity.reason}
                                </Typography>

                                {entity.startTime && (
                                    <Stack direction='row' spacing={1} alignItems='center'>
                                        <Typography variant='body2' color='text.secondary'>
                                            Inicio:
                                        </Typography>
                                        <Typography variant='body2'>{formatDateTimeUTC(entity.startTime)}</Typography>
                                    </Stack>
                                )}

                                <SubtleChip label={APPOINTMENT_STATUS_CONFIG[entity.status]?.label} />
                            </Stack>
                        )}

                        {type === 'DIAGNOSIS' && (
                            <Stack spacing={1.5} alignItems='flex-start'>
                                <Typography variant='body1' fontWeight='medium'>
                                    {entity.name}
                                </Typography>

                                {entity.diagnosedAt && (
                                    <Stack direction='row' spacing={1} alignItems='center'>
                                        <Typography variant='body2' color='text.secondary'>
                                            Diagnosticado:
                                        </Typography>
                                        <Typography variant='body2'>{formatDateTimeUTC(entity.diagnosedAt)}</Typography>
                                    </Stack>
                                )}

                                <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
                                    <SubtleChip
                                        label={DIAGNOSIS_CLINICAL_STATUS_CONFIG[entity.clinicalStatus]?.label}
                                    />
                                    {entity.severity && (
                                        <SubtleChip
                                            label={`Severidad: ${DIAGNOSIS_SEVERITY_CONFIG[entity.severity].label}`}
                                        />
                                    )}
                                </Stack>
                            </Stack>
                        )}

                        {type === 'TREATMENT' && (
                            <Stack spacing={1.5} alignItems='flex-start'>
                                <Typography variant='body1' fontWeight='medium'>
                                    {entity.name}
                                </Typography>
                                <SubtleChip label={TREATMENT_CLINICAL_STATUS_CONFIG[entity.clinicalStatus]?.label} />
                            </Stack>
                        )}

                        {type === 'PATIENT' && (
                            <Stack spacing={1.5} alignItems='flex-start'>
                                <Typography variant='body1' fontWeight='medium'>
                                    {entity.name} {entity.surname}
                                </Typography>
                                <SubtleChip label={PATIENT_STATUS_CONFIG[entity.status]?.label} />
                            </Stack>
                        )}

                        {type === 'CLINICAL_DOCUMENT' && (
                            <Stack spacing={1.5} alignItems='flex-start'>
                                <Typography variant='body1' fontWeight='medium'>
                                    {CLINICAL_DOCUMENT_TYPE_CONFIG[entity.documentType].label}
                                </Typography>
                                <SubtleChip label={CLINICAL_DOCUMENT_STATUS_CONFIG[entity.status]?.label} />
                            </Stack>
                        )}
                    </Box>
                </Box>
            )}

            {entityId && (
                <Box sx={{ p: 2, pt: 0 }}>
                    {data.role === 'PRIMARY' && (
                        <Button variant='outlined' size='small' fullWidth onClick={onAddSecondaryNode} sx={{ mb: 2 }}>
                            Añadir documento
                        </Button>
                    )}

                    {data.role === 'SECONDARY' && (
                        <Button
                            variant='outlined'
                            size='small'
                            fullWidth
                            onClick={onDeleteSecondaryNode}
                            sx={{ mb: 2 }}
                        >
                            Eliminar nodo
                        </Button>
                    )}
                    <Button
                        variant='outlined'
                        fullWidth
                        size='small'
                        onClick={handleNavigate}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                        Ver detalle completo
                    </Button>
                </Box>
            )}
        </Box>
    );
}
