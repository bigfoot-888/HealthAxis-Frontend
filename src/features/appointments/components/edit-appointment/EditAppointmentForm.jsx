import { Grid, Paper, Stack, Box, Alert } from '@mui/material';
import { Button, Typography } from '@mui/material';

import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { useEffect } from 'react';
import DrawerHeader from '../../../../components/layout/DrawerHeader';
import BasicFormInput from '../../../../components/forms/BasicFormInput';
import { PatientAutocomplete } from '../../../../components/forms/autocompletes/PatientAutocomplete';
import { UserAutocomplete } from '../../../../components/forms/autocompletes/UserAutocomplete';
import { AgendaAutocomplete } from '../../../../components/forms/autocompletes/AgendaAutocomplete';
import RHFDateTimePicker from '../../../../components/forms/RHFDateTimePicker';
import { useAppointments } from '../../hooks/useAppointments';
import { updateAppointment } from '../../api/appointment-api';
import BasicFormSelect from '../../../../components/forms/BasicFormSelect';
import { useState } from 'react';
import BasicFormLayout from '../../../../components/forms/BasicFormLayout';
import { useQueryClient } from '@tanstack/react-query';
export default function EditAppointmentForm({appointment, uuid}) {
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
            start_time: appointment?.start_time ? new Date(appointment.start_time) : null,
            location: appointment?.location || '',
            type: appointment?.type || ''
        },
    });

    const navigate = useNavigate();
    const { refetch } = useAppointments();
    const [error, setError] = useState(null);

    const queryClient = useQueryClient();
    const onSubmit = async (data) => {
        try {
            await updateAppointment(uuid, data);
            queryClient.invalidateQueries(['appointment_plain', uuid]);
            refetch();
            navigate('/appointments');
        } catch (err) {
            const { message, details } = err.response.data;
            if (details?.fields) {
                details.fields.forEach((f) => {
                    setFormError(f.path, { type: 'server', message: f.msg });
                });
            } else {
                setError(message);
            }
        }
    };

    // Just in case
    useEffect(() => {
        if (appointment) {
            reset({
                reason: appointment?.reason || '',
                notes: appointment?.notes || '',
                start_time: appointment?.start_time ? new Date(appointment.start_time) : null,
                location: appointment?.location || '',
                type: appointment?.type || ''
            });
        }
    }, [appointment, reset]);

    return (
        <BasicFormLayout>
            <Paper variant='surface-form-outlined' sx={{ width: '720px', p: 4 }}>
                {
                    error && (
                        <Alert severity='error' onClose={()=>setError(null)} sx={{ margin: 2 }}>
                            {error}
                        </Alert>
                    )
                }
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={1} sx={{ p: 1 }}>
                        <Grid container size={12} sx={{ justifyContent: 'start', pb: 2 }}>
                            <Typography variant='h2'>Editar datos de cita</Typography>
                        </Grid>
                        <Grid size={12}>
                            <Typography variant='h4' component='h3' sx={{ pb: 1 }}>
                                Información básica
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <BasicFormSelect
                                control={control}
                                errors={errors}
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
                                name='start_time'
                                control={control}
                                rules={{ required: 'La fecha y hora de inicio es obligatoria' }}
                                label='Fecha y hora de inicio'
                            />
                        </Grid>
                        <Grid size={12}>
                            <BasicFormInput
                                label='Lugar'
                                name='location'
                                type='text'
                                register={register}
                                rules={{
                                    required: 'El lugar es obligatorio',
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
                            <BasicFormInput
                                label='Motivo'
                                name='reason'
                                type='text'
                                register={register}
                                rules={{
                                    required: 'El motivo es obligatorio',
                                }}
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                            <BasicFormInput
                                label='Notas (opcional)'
                                name='notes'
                                type='text'
                                register={register}
                                rules={{}}
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
                                <Button variant='outlined' size='large' component={Link} to='/appointments'>
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
