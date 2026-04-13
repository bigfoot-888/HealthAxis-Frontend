import React, { useState } from 'react';
import { Grid, Typography, Button, Box, Paper, IconButton } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';

import { BasicTextInput, SelectInput } from '@/components/forms/inputs';

// 1. The individual Accordion Component
function TreatmentAccordion({ index, remove, register, control, errors }) {
    // Start expanded by default so when users click "Add", it opens immediately
    const [expanded, setExpanded] = useState(true);

    // Watch exactly what the user types into the "name" field for THIS specific index
    const watchedName = useWatch({
        control,
        name: `treatments.${index}.name`,
    });

    // Fallback to "Tratamiento #X" if they haven't typed a name yet
    const displayTitle = watchedName ? watchedName : `Tratamiento #${index + 1}`;

    return (
        <Accordion 
            expanded={expanded} 
            onChange={(e, isExpanded) => setExpanded(isExpanded)}
            variant="outlined"
            sx={{
                mb: 2, // Space between accordions
                borderRadius: 2,
                '&:before': { display: 'none' }, // Removes the default MUI top border line on accordions
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.02)'
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${index}-content`}
                id={`panel-${index}-header`}
                sx={{ 
                    // Make the summary slightly darker if it's closed, purely for visual distinction
                    backgroundColor: expanded ? 'transparent' : 'background.default',
                    borderBottom: expanded ? '1px solid' : 'none',
                    borderColor: 'divider',
                }}
            >
                {/* Header: Dynamic Title + Delete Button */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 2 }}>
                    <Typography variant='subtitle1' fontWeight="600" color="primary.main">
                        {displayTitle}
                    </Typography>
                    
                    <Button
                        component="span"
                        color='error'
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation(); // CRITICAL: Stops the accordion from toggling when deleting
                            remove(index);
                        }}
                        sx={{ textTransform: 'none' }}
                    >
                        Eliminar
                    </Button>
                </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ p: { xs: 2, sm: 3 } }}>
                <Grid container spacing={2}>
                    {/* Row 1: Name */}
                    <Grid size={12}>
                        <BasicTextInput
                            label='Nombre del tratamiento'
                            name={`treatments.${index}.name`}
                            register={register}
                            rules={{ required: 'El nombre es obligatorio' }}
                            errors={errors}
                        />
                    </Grid>

                    {/* Row 2: State and Duration */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <SelectInput
                            control={control}
                            errors={errors}
                            name={`treatments.${index}.clinicalStatus`}
                            label='Estado'
                            rules={{ required: 'El estado es obligatorio' }}
                            items={{
                                PLANNED: 'Planificado',
                                ONGOING: 'En curso',
                                GIVEN: 'Dado',
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <BasicTextInput
                            label='Duración'
                            name={`treatments.${index}.duration`}
                            register={register}
                            errors={errors}
                        />
                    </Grid>

                    {/* Row 3: Description */}
                    <Grid size={12}>
                        <BasicTextInput
                            label='Descripción'
                            name={`treatments.${index}.description`}
                            register={register}
                            errors={errors}
                            others={{ multiline: true, rows: 2 }}
                        />
                    </Grid>

                    {/* Row 4: Notes */}
                    <Grid size={12}>
                        <BasicTextInput
                            label='Notas (opcional)'
                            name={`treatments.${index}.notes`}
                            register={register}
                            errors={errors}
                            others={{ multiline: true, rows: 2 }}
                        />
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
}

// 2. Main Form Component
export default function TreatmentStepForm() {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'treatments',
    });

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', py: 2 }}>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant='h5' fontWeight="500">
                    Tratamientos
                </Typography>
            </Box>

            {fields.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 4, mb: 3, textAlign: 'center', borderStyle: 'dashed', backgroundColor: 'background.default' }}>
                    <Typography color="text.secondary">
                        No hay tratamientos añadidos. Haz clic en "Añadir" para empezar.
                    </Typography>
                </Paper>
            ) : (
                <Box>
                    {fields.map((field, index) => (
                        <TreatmentAccordion 
                            key={field.id}
                            index={index}
                            remove={remove}
                            register={register}
                            control={control}
                            errors={errors}
                        />
                    ))}
                </Box>
            )}

            <Button
                variant='outlined'
                sx={{ 
                    borderStyle: 'dashed', 
                    borderWidth: '2px', 
                    py: 1.5, 
                    mt: fields.length > 0 ? 1 : 0, // slight margin if there are items above it
                    '&:hover': { borderWidth: '2px', borderStyle: 'dashed' } 
                }}
                onClick={() =>
                    append({
                        name: '',
                        clinicalStatus: '',
                        description: '',
                        duration: '',
                        notes: '',
                    })
                }
            >
                + Añadir tratamiento
            </Button>
        </Box>
    );
}