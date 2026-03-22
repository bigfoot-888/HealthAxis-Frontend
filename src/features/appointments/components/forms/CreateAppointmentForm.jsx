import { Grid, Paper, Stack, Box } from '@mui/material';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

import { useAppointments } from '@appointments/hooks/useAppointments';
import { createAppointment } from '@appointments/api/appointment-api';

import { BasicTextInput, SelectInput } from '@/components/forms/inputs/index';
import { PatientAutocomplete, UserAutocomplete, AgendaAutocomplete } from '@/components/forms/autocompletes/index';
import { RHFDateTimePicker } from '@/components/forms/pickers/index';
import { handleApiError } from '@/utils/handle-errors';
import { BasicFormLayout } from '@/components/forms';
import { ErrorAlert } from '@/components/ui';

export default function CreateAppointmentForm() {
    const {
        register,
        handleSubmit,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            type: '',
        },
    });

    const navigate = useNavigate();
    const { refetch } = useAppointments();
    const [error, setError] = useState(null); 

    const onSubmit = async (data) => {
        try {
            await createAppointment(data);
            refetch();
            navigate('/appointments');
        } catch (err) {
            handleApiError(err, setError, setFormError);
        }
    };

    return (
        <BasicFormLayout>
            <Paper variant='surface-form-outlined' sx={{ width: '720px', p: 4 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={1} sx={{ p: 1 }}>
                        <Grid container size={12} sx={{ justifyContent: 'start', pb: 2 }}>
                            <Typography variant='h2'>Crear Nueva Cita</Typography>
                        </Grid>

                        <ErrorAlert error={error} onErrorClose={()=>setError(null)}/>

                        <Grid size={12}>
                            <Typography variant='h4' component='h3' sx={{ pb: 1 }}>
                                Información básica
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <PatientAutocomplete
                                control={control}
                                errors={errors}
                                rules={{ required: 'El paciente es obligatorio' }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <UserAutocomplete
                                control={control}
                                name='user'
                                rules={{ required: 'El profesional es obligatorio' }}
                                multiple={false}
                            />
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
                                name='start_time'
                                control={control}
                                rules={{ required: 'La fecha y hora de inicio es obligatoria' }}
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
                            <BasicTextInput
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
                            <AgendaAutocomplete
                                control={control}
                                errors={errors}
                                rules={{ required: 'La agenda es obligatoria' }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
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
