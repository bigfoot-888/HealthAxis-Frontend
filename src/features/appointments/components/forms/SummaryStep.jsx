import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useFormContext } from 'react-hook-form';
import { translateDiagnosisState, translateTreatmentState } from '@/utils/translate-field';

const SummaryField = ({ label, value }) => (
    <Box>
        <Typography
            variant='caption'
            sx={{
                textTransform: 'uppercase',
                letterSpacing: 0.4,
                color: 'text.secondary',
            }}
        >
            {label}
        </Typography>
        <Typography
            variant='body1'
            fontWeight='400'
            color={value ? 'text.primary' : 'text.disabled'}
        >
            {value || 'No especificado'}
        </Typography>
    </Box>
);

const severityTranslations = {
    LOW: 'Leve',
    MEDIUM: 'Moderada',
    HIGH: 'Grave',
    SEVERE: 'Severa',
};

export default function SummaryStep() {
    const { getValues } = useFormContext();
    const { diagnosis, treatments } = getValues();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                py: 2,
            }}
        >
            {/* Page Title */}
            <Typography variant='h4' fontWeight='600'>
                Resumen
            </Typography>

            {/* ================= DIAGNOSIS ================= */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant='h6' fontWeight='600'>
                    Diagnóstico
                </Typography>

                <Paper
                    variant='outlined'
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2.5,
                    }}
                >
                    <Typography variant='subtitle1' fontWeight='500'>
                        {diagnosis?.name || 'Sin nombre'}
                    </Typography>

                    <Divider />

                    <Grid container spacing={3}>
                        <Grid size={6}>
                            <SummaryField
                                label='Gravedad'
                                value={
                                    severityTranslations[diagnosis?.severity] ||
                                    diagnosis?.severity
                                }
                            />
                        </Grid>

                        <Grid size={6}>
                            <SummaryField
                                label='Estado'
                                value={translateDiagnosisState(diagnosis?.status)}
                            />
                        </Grid>

                        <Grid size={12}>
                            <SummaryField
                                label='Descripción'
                                value={diagnosis?.description}
                            />
                        </Grid>

                        {diagnosis?.notes && (
                            <Grid size={12}>
                                <SummaryField
                                    label='Notas'
                                    value={diagnosis?.notes}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            </Box>

            {/* ================= TREATMENTS ================= */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant='h6' fontWeight='600'>
                    Tratamientos ({treatments?.length || 0})
                </Typography>

                {treatments?.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {treatments.map((treatment, index) => (
                            <Accordion
                                key={index}
                                variant='outlined'
                                sx={{
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    '&:before': { display: 'none' },
                                }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant='subtitle1' fontWeight='500'>
                                        {treatment.name || `Tratamiento #${index + 1}`}
                                    </Typography>
                                </AccordionSummary>

                                <AccordionDetails sx={{ pt: 0 }}>
                                    <Divider sx={{ mb: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <SummaryField
                                                label='Estado'
                                                value={translateTreatmentState(
                                                    treatment?.status
                                                )}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <SummaryField
                                                label='Duración'
                                                value={treatment.duration}
                                            />
                                        </Grid>

                                        {treatment.description && (
                                            <Grid size={12}>
                                                <SummaryField
                                                    label='Descripción'
                                                    value={treatment.description}
                                                />
                                            </Grid>
                                        )}

                                        {treatment.notes && (
                                            <Grid size={12}>
                                                <SummaryField
                                                    label='Notas'
                                                    value={treatment.notes}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                ) : (
                    <Paper
                        variant='outlined'
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            borderStyle: 'dashed',
                            backgroundColor: 'background.default',
                            borderRadius: 2,
                        }}
                    >
                        <Typography color='text.secondary'>
                            No hay tratamientos planificados para este diagnóstico.
                        </Typography>
                    </Paper>
                )}
            </Box>
        </Box>
    );
}