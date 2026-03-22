import { useFieldArray, Controller } from 'react-hook-form';
import { Button, Box, Grid } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { DiagnosisAutocomplete } from '@/components/forms/autocompletes/index';

export function TreatmentDiagnoses({ control }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'diagnoses', // This will be the array in your form data
    });

    const handleAddDiagnosis = () => {
        append({ diagnosis: ""}); // Add empty row
    };

    return (
        <Box>
            {fields.map((field, index) => (
                <Grid container spacing={2} key={field.id} sx={{ mb: 2 }}>
                    <Grid size={10}>
                        <DiagnosisAutocomplete
                            control={control}
                            name={`diagnoses.${index}.diagnosis`}
                            rules={{ required: 'El diagnóstico es obligatorio' }}
                        />
                    </Grid>
                    <Grid
                        size={2}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            pb: 2
                        }}
                    >
                        <IconButton color='error' onClick={() => remove(index)} size='small'>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}

            <Button startIcon={<AddIcon />} onClick={handleAddDiagnosis} variant='outlined' sx={{mb: 2}}>
                Añadir diagnóstico relacionado
            </Button>
        </Box>
    );
}
