import { useFieldArray, Controller } from 'react-hook-form';
import { Button, Box, Grid } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { UserAutocomplete } from '@/components/forms/autocompletes/index';
import {SelectInput} from '@/components/forms/inputs/index';

export function ClinicalDocumentUsersField({ control, errors }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'users', // This will be the array in your form data
    });

    const handleAddProfessional = () => {
        append({ user: "", role: "" }); // Add empty row
    };

    return (
        <Box>
            {fields.map((field, index) => (
                <Grid container spacing={2} key={field.id} sx={{ mb: 2 }}>
                    <Grid size={5}>
                        <UserAutocomplete
                            control={control}
                            name={`users.${index}.user`}
                            rules={{ required: 'El profesional es obligatorio' }}
                        />
                    </Grid>
                    <Grid size={5}>
                        <SelectInput
                            control={control}
                            name={`users.${index}.role`}
                            rules={{ required: 'El rol del profesional en el diagnóstico es obligatorio' }}
                            label='Rol en el diagnóstico'
                            items={{
                                AUTHOR: 'Autoría',
                                REVIEWER: 'Revisión',
                                VALIDATOR: 'Validación',
                                CONTRIBUTOR: 'Colaboración',
                                UPLOADER: 'Subida'
                            }}
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

            <Button startIcon={<AddIcon />} onClick={handleAddProfessional} variant='outlined' sx={{mb: 2}}>
                Añadir profesional involucrado
            </Button>
        </Box>
    );
}
