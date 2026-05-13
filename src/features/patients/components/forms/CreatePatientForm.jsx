import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

import {
    FormControl,
    FormHelperText,
    Grid,
    Paper,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Typography,
} from '@mui/material';

import { useState } from 'react';

import { createPatient } from '@patients/api/patient.api';
import { usePatients } from '@patients/hooks/usePatients';

import { RHFDatePicker } from '@/components/forms/pickers/index';
import { handleApiError } from '@/utils/handle-errors';
import { BasicFormLayout } from '@/components/forms/index';
import { ErrorAlert } from '@/components/ui/index';
import { BasicTextInput } from '@/components/forms/inputs/index';

import { useSnackbar } from '@/app/SnackBarContext';

export default function CreatePatientForm() {
    const {
        register,
        handleSubmit,
        setError: setFormError,
        control,
        formState: { errors },
    } = useForm({ mode: 'onBlur' });

    const [value, setValue] = useState(null);
    const [focused, setFocused] = useState(false);
    const navigate = useNavigate();
    const { refetch } = usePatients();
    const [error, setError] = useState(null);
    const { showSnackbar } = useSnackbar();

    const onSubmit = async (data) => {
        try {
            await createPatient(data);
            refetch();
            navigate('/patients');
            showSnackbar({ message: 'Paciente creado correctamente' });
        } catch (err) {
            handleApiError(err, setError, setFormError);
        }
    };

    return (
        <BasicFormLayout drawer={false}>
            <Paper variant='surface-form-outlined' sx={{ width: '720px', p: 4 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container rowSpacing={1.5} columnSpacing={3} sx={{ p: 1 }}>
                        <Grid size={12} sx={{ justifyContent: 'start', pb: 2 }}>
                            <Typography variant='h2'>Crear Paciente</Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant='h4' component='h3' sx={{ pb: 1 }}>
                                Datos personales
                            </Typography>
                        </Grid>
                        <Grid size={6} sx={{ justifyContent: 'center' }}>
                            <BasicTextInput
                                label='Nombre'
                                name='name'
                                register={register}
                                rules={{
                                    required: 'El nombre es obligatorio',
                                    maxLength: {
                                        value: 50,
                                        message: 'Máximo 50 caracteres',
                                    },
                                }}
                                type='text'
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={6} sx={{ justifyContent: 'center' }}>
                            <BasicTextInput
                                label='Apellidos'
                                name='surname'
                                register={register}
                                rules={{
                                    required: 'Los apellidos son obligatorios',
                                    maxLength: {
                                        value: 60,
                                        message: 'Máximo 60 caracteres',
                                    },
                                }}
                                type='text'
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={6}>
                            <RHFDatePicker
                                name='dateOfBirth'
                                control={control}
                                rules={{
                                    required: 'La fecha de nacimiento es obligatoria',
                                    validate: (value) => {
                                        const today = new Date();
                                        const date = new Date(value);
                                        return date <= today || 'La fecha no puede ser futura';
                                    },
                                }}
                                label='Fecha de nacimiento'
                            />
                        </Grid>
                        <Grid size={6}>
                            <Controller
                                name='sex'
                                control={control}
                                rules={{
                                    required: 'El sexo es obligatorio',
                                }}
                                render={({ field, fieldState }) => (
                                    <FormControl error={!!fieldState.error}>
                                        <FormLabel id='sex-form-label'>Sexo</FormLabel>

                                        <RadioGroup
                                            row
                                            aria-labelledby='sex-form-label'
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                        >
                                            <FormControlLabel value='FEMALE' control={<Radio />} label='Mujer' />
                                            <FormControlLabel value='MALE' control={<Radio />} label='Hombre' />
                                        </RadioGroup>

                                        <FormHelperText>{fieldState.error?.message || ' '}</FormHelperText>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
                                label='DNI'
                                name='dni'
                                register={register}
                                rules={{
                                    required: 'El DNI es obligatorio',
                                    pattern: {
                                        value: /^[0-9]{8}[A-Z]$/,
                                        message: 'Formato inválido. Ejemplo: 12345678A',
                                    },
                                }}
                                type='text'
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Typography variant='h4' component='h3' sx={{ pb: 1 }}>
                                Información de contacto
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
                                label='Correo'
                                name='email'
                                register={register}
                                rules={{
                                    required: 'El correo es obligatorio',
                                    maxLength: {
                                        value: 100,
                                        message: 'Máximo 100 caracteres',
                                    },
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Formato inválido. Ejemplo: test@ejemplo.com',
                                    },
                                }}
                                type='email'
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
                                label='Teléfono'
                                name='phone'
                                register={register}
                                rules={{
                                    required: 'El teléfono es obligatorio',
                                    maxLength: {
                                        value: 20,
                                        message: 'Máximo 20 caracteres',
                                    },
                                    pattern: {
                                        value: /^[0-9+()\s-]+$/,
                                        message: 'Formato inválido. Ejemplo: 612345678 o +34 612 345 678',
                                    },
                                }}
                                placeholder='999999999'
                                type='tel'
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
                                label='Dirección'
                                name='addressLine1'
                                register={register}
                                rules={{
                                    required: 'La dirección es obligatoria',
                                    maxLength: {
                                        value: 150,
                                        message: 'Máximo 150 caracteres',
                                    },
                                }}
                                type='text'
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
                                label='Dirección complementaria'
                                name='addressLine2'
                                register={register}
                                rules={{
                                    maxLength: {
                                        value: 150,
                                        message: 'Máximo 150 caracteres',
                                    },
                                }}
                                type='text'
                                errors={errors}
                            />
                        </Grid>

                        <ErrorAlert error={error} onClose={() => setError(null)} />

                        <Grid container justifyContent='space-between' size={12} sx={{ marginTop: 2 }}>
                            <Grid>
                                <Button variant='contained' size='large' type='submit'>
                                    Aceptar
                                </Button>
                            </Grid>
                            <Grid>
                                <Button variant='outlined' size='large' component={Link} to='/patients'>
                                    Cancelar
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </BasicFormLayout>
    );
}
