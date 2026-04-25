import { useFieldArray, useController } from 'react-hook-form';
import { Button, Box, Grid, Typography } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';

import { UserAutocomplete } from '@/components/forms/autocompletes';
import { SelectInput } from '@/components/forms/inputs';

export function DiagnosisProfessionalsField({ control, errors, rules }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'users',
    });

    const { fieldState: usersState } = useController({
        name: 'users',
        control,
        rules,
    });

    const handleAddProfessional = () => {
        append({ user: null, role: '' });
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
                            rules={{ required: 'El rol es obligatorio' }}
                            label='Rol en el diagnóstico'
                            items={{
                                AUTHOR: 'Autoría',
                                REVIEWER: 'Revisión',
                                VALIDATOR: 'Validación',
                                CONTRIBUTOR: 'Colaboración',
                            }}
                        />
                    </Grid>

                    <Grid
                        size={2}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            pb: 2,
                        }}
                    >
                        <IconButton
                            color='error'
                            onClick={() => remove(index)}
                            size='small'
                            disabled={fields.length === 1}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}

            <Button startIcon={<AddIcon />} onClick={handleAddProfessional} variant='outlined' sx={{ mb: 1 }}>
                Añadir profesional involucrado
            </Button>

            {usersState.error && (
                <Typography variant='caption' color='error'>
                    {usersState.error.message}
                </Typography>
            )}
        </Box>
    );
}
