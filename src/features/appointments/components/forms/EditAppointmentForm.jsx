import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router';
import { useEffect, useState } from 'react';

import { Grid, Paper, Alert } from '@mui/material';
import { Button, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { BasicTextInput, SelectInput } from '@/components/forms/inputs/index';
import { BasicFormLayout } from '@/components/forms/index';
import { RHFDateTimePicker } from '@/components/forms/pickers/index';

import { ErrorAlert } from '@/components/ui';
import { handleApiError } from '@/utils/handle-errors';

import { useAppointments } from '@appointments/hooks/useAppointments';
import { updateAppointment } from '@appointments/api/appointment.api';

import { useSnackbar } from '@/app/SnackBarContext';
import { invalidateEditAppointmentQueries } from '../../utils/appointment-query.utils';

export default function EditAppointmentForm({ appointment, uuid }) {
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
            reason: appointment?.reason || '',
            notes: appointment?.notes || '',
            startTime: appointment?.startTime ? new Date(appointment.startTime) : null,
            location: appointment?.location || '',
            type: appointment?.type || '',
        },
    });

    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/appointments';
    const [error, setError] = useState(null);

    const queryClient = useQueryClient();
    const onSubmit = async (data) => {
        try {
            await updateAppointment(uuid, data);
            invalidateEditAppointmentQueries(queryClient, appointment); 
            navigate(from);
            showSnackbar({ message: 'Cita editada correctamente' });
        } catch (err) {
            handleApiError(err, setError, setFormError);
        }
    };

    useEffect(() => {
        if (appointment) {
            reset({
                reason: appointment?.reason || '',
                notes: appointment?.notes || '',
                startTime: appointment?.startTime ? new Date(appointment.startTime) : null,
                location: appointment?.location || '',
                type: appointment?.type || '',
            });
        }
    }, [appointment, reset]);

    return (
        <BasicFormLayout drawer={false}>
            <Paper variant='surface-form-outlined' sx={{ width: '720px', p: 4 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={1} sx={{ p: 1 }}>
                        <Grid container size={12} sx={{ justifyContent: 'start', pb: 2 }}>
                            <Typography variant='h2'>Editar datos de cita</Typography>
                        </Grid>

                        <ErrorAlert error={error} onClose={() => setError(null)} />

                        <Grid size={12}>
                            <Typography variant='h4' component='h3' sx={{ pb: 1 }}>
                                Información básica
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <SelectInput
                                control={control}
                                name='type'
                                label='Modalidad'
                                rules={{ required: 'La modalidad es obligatorio' }}
                                items={{
                                    IN_PERSON: 'Presencial',
                                    VIRTUAL: 'Virtual',
                                }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Typography variant='h4' component='h3' sx={{ pb: 1 }}>
                                Programación
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <RHFDateTimePicker
                                name='startTime'
                                control={control}
                                rules={{
                                    required: 'La fecha y hora de inicio es obligatoria',
                                    validate: (value) => {
                                        const date = new Date(value);
                                        return !isNaN(date) || 'Fecha inválida';
                                    },
                                }}
                                label='Fecha y hora de inicio'
                            />
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
                                label='Lugar'
                                name='location'
                                type='text'
                                register={register}
                                rules={{
                                    maxLength: {
                                        value: 100,
                                        message: 'Máximo 100 caracteres',
                                    },
                                }}
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Typography variant='h4' component='h3' sx={{ pb: 1 }}>
                                Detalles
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
                                label='Motivo'
                                name='reason'
                                type='text'
                                register={register}
                                rules={{
                                    required: 'El motivo es obligatorio',
                                    maxLength: {
                                        value: 255,
                                        message: 'Máximo 255 caracteres',
                                    },
                                }}
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
                                label='Notas (opcional)'
                                name='notes'
                                type='text'
                                register={register}
                                rules={{
                                    maxLength: {
                                        value: 2000,
                                        message: 'Máximo 2000 caracteres',
                                    },
                                }}
                                errors={errors}
                                others={{ multiline: true, rows: 4 }}
                            />
                        </Grid>
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
    );
}
