import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useFormContext } from 'react-hook-form';
import { translateDiagnosisState, translateTreatmentState } from '@/utils/translate-field';

const SummaryField = ({ label, value }) => (
  <Box sx={{ mb: 1 }}>
    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {label}
    </Typography>
    <Typography variant="body1" fontWeight="500" color={value ? 'text.primary' : 'text.disabled'}>
      {value || 'No especificado'}
    </Typography>
  </Box>
);

// Add your severity translations here if applicable
const severityTranslations = {
  LOW: 'Leve',
  MEDIUM: 'Moderada',
  HIGH: 'Grave',
  SEVERE: 'Severa'
};

export default function SummaryStep() {
  const { getValues } = useFormContext();
  const { diagnosis, treatments } = getValues();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, py: 2 }}>

      <Typography variant="h5" fontWeight="500" sx={{ mb: -2 }}>
        Resumen
      </Typography>

      {/* 🧠 DIAGNOSIS */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="h6" fontWeight="600" color="primary.main">
            Diagnóstico
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <SummaryField label="Nombre" value={diagnosis?.name} />
          </Grid>
          
          <Grid size={{ xs: 6, md: 3 }}>
            <SummaryField 
              label="Gravedad" 
              value={severityTranslations[diagnosis?.severity] || diagnosis?.severity} 
            />
          </Grid>
          
          <Grid size={{ xs: 6, md: 3 }}>
            <SummaryField 
              label="Estado" 
              value={translateDiagnosisState(diagnosis?.state)} 
            />
          </Grid>

          <Grid size={12}>
            <SummaryField label="Descripción" value={diagnosis?.description} />
          </Grid>

          {diagnosis?.notes && (
            <Grid size={12}>
              <SummaryField label="Notas" value={diagnosis?.notes} />
            </Grid>
          )}
        </Grid>
      </Paper>


      {/* 💊 TREATMENTS */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="h6" fontWeight="600" color="primary.main">
            Tratamientos ({treatments?.length || 0})
          </Typography>
        </Box>

        {treatments?.length > 0 ? (
          treatments.map((treatment, index) => (
            <Accordion 
              key={index} 
              variant="outlined"
              sx={{ 
                mb: 1, 
                borderRadius: 2,
                '&:before': { display: 'none' }, // removes default MUI line
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="500">
                  {treatment.name || `Tratamiento #${index + 1}`}
                </Typography>
              </AccordionSummary>

              <AccordionDetails sx={{ pt: 0 }}>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <SummaryField 
                      label="Estado" 
                      value={translateTreatmentState(treatment?.state)} 
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <SummaryField label="Duración" value={treatment.duration} />
                  </Grid>
                  
                  {treatment.description && (
                    <Grid size={12}>
                      <SummaryField label="Descripción" value={treatment.description} />
                    </Grid>
                  )}
                  
                  {treatment.notes && (
                    <Grid size={12}>
                      <SummaryField label="Notas" value={treatment.notes} />
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed', backgroundColor: 'background.default' }}>
            <Typography color="text.secondary">
              No hay tratamientos planificados para este diagnóstico.
            </Typography>
          </Paper>
        )}
      </Box>

    </Box>
  );
}