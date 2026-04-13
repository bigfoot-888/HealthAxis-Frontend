import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import { Button, Stack, Paper, Grid, Box, TextField, Typography } from '@mui/material';

import { updatePatient } from '@patients/api/patient.api';
import { usePatients } from '@patients/hooks/usePatients';
import { handleApiError } from '@/utils/handle-errors';

import { BasicFormLayout } from '@/components/forms/index';
import { ErrorAlert } from '@/components/ui/index';
import { BasicTextInput } from '@/components/forms/inputs/index';

export default function CreatePatientForm({ patient, uuid }) {
    const {
        register,
        handleSubmit,
        control,
        setError: setFormError,
        reset,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            name: '',
            surname: '',
            email: '',
            phone: '',
            address_line1: '',
            address_line2: '',
        },
    });

    const queryClient = useQueryClient();
    const [value, setValue] = useState(null);
    const [focused, setFocused] = useState(false);
    const navigate = useNavigate();
    const { refetch } = usePatients();
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        try {
            await updatePatient(uuid, data);
            refetch();
            queryClient.invalidateQueries(['patient', uuid]);
            navigate('/patients');
        } catch (err) {
            handleApiError(err, setError, setFormError);
        }
    };

    useEffect(() => {
        if (patient) {
            reset({
                ...patient,
            });
        }
    }, [patient, reset]);

    return (
        <BasicFormLayout>
            <Paper variant='surface-form-outlined' sx={{ width: '720px', p: 4 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container rowSpacing={1.5} columnSpacing={3} sx={{ p: 1 }}>
                        <Grid size={12} sx={{ justifyContent: 'start', pb: 2 }}>
                            <Typography variant='h2'>Añadir Paciente</Typography>
                        </Grid>

                        <ErrorAlert
                            error={error}
                            onErrorClose={() => {
                                setError(null);
                            }}
                        />

                        <Grid size={12}>
                            <Typography variant='h4' component='h3'>
                                Datos personales
                            </Typography>
                        </Grid>
                        <Grid size={6} sx={{ justifyContent: 'center' }}>
                            <BasicTextInput
                                label='Nombre'
                                name='name'
                                register={register}
                                rules={{ required: 'El nombre es obligatorio' }}
                                type='text'
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={6} sx={{ justifyContent: 'center' }}>
                            <BasicTextInput
                                label='Apellidos'
                                name='surname'
                                register={register}
                                rules={{ required: 'Los apellidos son obligatorios' }}
                                type='text'
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Typography variant='h4' component='h3'>
                                Información de contacto
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
                                label='Correo'
                                name='email'
                                register={register}
                                rules={{ required: 'El correo es obligatorio' }}
                                type='email'
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
                                label='Teléfono'
                                name='phone'
                                register={register}
                                rules={{ required: 'El teléfono es obligatorio' }}
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
                                rules={{ required: 'La dirección es obligatoria' }}
                                type='text'
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
                                label='Dirección complementaria'
                                name='addressLine2'
                                register={register}
                                rules={{}}
                                type='text'
                                errors={errors}
                            />
                        </Grid>
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
