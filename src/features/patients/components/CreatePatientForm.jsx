import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import DrawerHeader from '../../../components/layout/DrawerHeader';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { createPatient } from '../api/patient-api';
import { Link, useNavigate } from 'react-router';

import { usePatients } from '../hooks/usePatients';

import { useForm, Controller } from 'react-hook-form';
import RHFDatePicker from '../../../components/forms/RHFDatePicker';

export default function CreatePatientForm() {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({ mode: 'onBlur' });

    const [value, setValue] = React.useState(null);
    const [focused, setFocused] = React.useState(false);
    const navigate = useNavigate();
    const { refetch } = usePatients();

    const onSubmit = async (data) => {
        try {
            await createPatient(data);
            refetch();
            navigate('/patients');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Stack sx={{ flexDirection: 'column', height: '100%', mb: 8 }}>
            <DrawerHeader />
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Paper
                    variant='surface-form-outlined'
                    sx={{ width: '720px', p: 4 }}
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid
                            container
                            rowSpacing={1.5}
                            columnSpacing={3}
                            sx={{ p: 1 }}
                        >
                            <Grid
                                size={12}
                                sx={{ justifyContent: 'start', pb: 2 }}
                            >
                                <Typography variant='h2'>
                                    Añadir Paciente
                                </Typography>
                            </Grid>
                            <Grid size={12}>
                                <Typography variant='h4' component='h3' sx={{pb: 1}}>
                                    Datos personales
                                </Typography>
                            </Grid>
                            <Grid size={6} sx={{ justifyContent: 'center' }}>
                                <TextField
                                    label='Nombre'
                                    name='name'
                                    id='name-textfield'
                                    fullWidth
                                    {...register('name', {
                                        required: 'El nombre es obligatorio',
                                    })}
                                    error={!!errors.name}
                                    helperText={errors.name?.message || ' '}
                                />
                            </Grid>
                            <Grid size={6} sx={{ justifyContent: 'center' }}>
                                <TextField
                                    label='Apellidos'
                                    name='surname'
                                    id='surname-textfield'
                                    fullWidth
                                    {...register('surname', {
                                        required:
                                            'Los apellidos son obligatorios',
                                    })}
                                    error={!!errors.surname}
                                    helperText={errors.surname?.message || ' '}
                                />
                            </Grid>
                            <Grid size={6}>
                                <RHFDatePicker
                                    name='date_of_birth'
                                    control={control}
                                    rules={{required: 'La fecha de nacimiento es obligatoria',}}
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
                                            <FormLabel id='sex-form-label'>
                                                Sexo
                                            </FormLabel>

                                            <RadioGroup
                                                row
                                                aria-labelledby='sex-form-label'
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                            >
                                                <FormControlLabel
                                                    value='FEMALE'
                                                    control={<Radio />}
                                                    label='Mujer'
                                                />
                                                <FormControlLabel
                                                    value='MALE'
                                                    control={<Radio />}
                                                    label='Hombre'
                                                />
                                            </RadioGroup>

                                            <FormHelperText>
                                                {fieldState.error?.message ||
                                                    ' '}
                                            </FormHelperText>
                                        </FormControl>
                                    )}
                                />

                                {/* <FormControl sx={{ p: 0 }} error={!!errors.sex}>
                                    <FormLabel id='sex-form-label'>
                                        Sexo
                                    </FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby='sex-form-label'
                                        name='sex-radio-group'
                                        {...register('sex', {
                                            required: 'El sexo es obligatorio',
                                        })}
                                    >
                                        <FormControlLabel
                                            value='FEMALE'
                                            control={<Radio />}
                                            label='Mujer'
                                        />
                                        <FormControlLabel
                                            value='MALE'
                                            control={<Radio />}
                                            label='Hombre'
                                        />
                                    </RadioGroup>
                                    <FormHelperText>
                                        {errors.sex?.message || ' '}
                                    </FormHelperText>
                                </FormControl> */}
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    id='dni-textfield'
                                    label='DNI'
                                    name='dni'
                                    sx={{ width: '100%' }}
                                    {...register('dni', {
                                        required: 'El DNI es obligatorio',
                                    })}
                                    error={!!errors.dni}
                                    helperText={errors.dni?.message || ' '}
                                />
                            </Grid>
                            <Grid size={12}>
                                <Typography variant='h4' component='h3' sx={{pb: 1}}>
                                    Información de contacto
                                </Typography>
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    id='email-textfield'
                                    label='Correo'
                                    name='email'
                                    sx={{ width: '100%' }}
                                    {...register('email', {
                                        required: 'El correo es obligatorio',
                                    })}
                                    error={!!errors.email}
                                    helperText={errors.email?.message || ' '}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label='Teléfono'
                                    type='tel'
                                    name='phone'
                                    fullWidth
                                    placeholder='+34 999 999 999'
                                    {...register('phone', {
                                        required: 'El teléfono es obligatorio',
                                    })}
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message || ' '}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label='Dirección'
                                    type='text'
                                    name='address_line1'
                                    fullWidth
                                    {...register('address_line1', {
                                        required: 'La dirección es obligatoria',
                                    })}
                                    error={!!errors.address_line1}
                                    helperText={
                                        errors.address_line1?.message || ' '
                                    }
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label='Dirección Complementaria'
                                    type='text'
                                    name='address_line2'
                                    fullWidth
                                    {...register('address_line2', {
                                        required: '(Temporal)',
                                    })}
                                    error={!!errors.address_line2}
                                    helperText={
                                        errors.address_line2?.message || ' '
                                    }
                                />
                            </Grid>
                            <Grid
                                container
                                justifyContent='space-between'
                                size={12}
                                sx={{ marginTop: 2 }}
                            >
                                <Grid>
                                    <Button
                                        variant='contained'
                                        size='large'
                                        type='submit'
                                    >
                                        Aceptar
                                    </Button>
                                </Grid>
                                <Grid>
                                    <Button
                                        variant='outlined'
                                        size='large'
                                        component={Link}
                                        to='/patients'
                                    >
                                        Cancelar
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
        </Stack>
    );
}
