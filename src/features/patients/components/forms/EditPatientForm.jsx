import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation} from 'react-router';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import { Button, Paper, Grid, Typography } from '@mui/material';

import { updatePatient } from '@patients/api/patient.api';
import { usePatients } from '@patients/hooks/usePatients';
import { handleApiError } from '@/utils/handle-errors';

import { BasicFormLayout } from '@/components/forms/index';
import { ErrorAlert } from '@/components/ui/index';
import { BasicTextInput } from '@/components/forms/inputs/index';
import { useSnackbar } from '@/app/SnackBarContext';

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
    const { showSnackbar } = useSnackbar();

    const location = useLocation(); 
    const from = location.state?.from || '/patients';

    const navigate = useNavigate();
    const { refetch } = usePatients();
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        try {
            await updatePatient(uuid, data);
            refetch();
            queryClient.invalidateQueries(['patient', uuid]);
            navigate(from);
            showSnackbar({ message: 'Paciente editado correctamente' });
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
        <BasicFormLayout drawer={false}>
            <Paper variant='surface-form-outlined' sx={{ width: '720px', p: 4 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container rowSpacing={1.5} columnSpacing={3} sx={{ p: 1 }}>
                        <Grid size={12} sx={{ justifyContent: 'start', pb: 2 }}>
                            <Typography variant='h2'>Añadir Paciente</Typography>
                        </Grid>

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

                        <ErrorAlert
                            error={error}
                            onErrorClose={() => {
                                setError(null);
                            }}
                        />

                        <Grid container justifyContent='space-between' size={12} sx={{ marginTop: 2 }}>
                            <Grid>
                                <Button variant='contained' size='large' type='submit'>
                                    Aceptar
                                </Button>
                            </Grid>
                            <Grid>
                                <Button variant='outlined' size='large' component={Link} to={from}>
                                    Cancelar
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </BasicFormLayout>
    )
}
