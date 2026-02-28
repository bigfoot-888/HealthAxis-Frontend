import { Grid, Paper, Stack, Box } from '@mui/material';
import { Button, Typography } from '@mui/material';

import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

import DrawerHeader from '../../../components/layout/DrawerHeader';
import BasicFormInput from '../../../components/forms/BasicFormInput';
import { PatientAutocomplete } from '../../../components/forms/autocompletes/PatientAutocomplete';
import { UserAutocomplete } from '../../../components/forms/autocompletes/UserAutocomplete';
import { AgendaAutocomplete } from '../../../components/forms/autocompletes/AgendaAutocomplete';
import RHFDateTimePicker from '../../../components/forms/RHFDateTimePicker';
import { useAppointments } from '../hooks/useAppointments';
import { createAppointment } from '../api/appointment-api';
import BasicFormSelect from '../../../components/forms/BasicFormSelect';
export default function CreateAppointmentForm() {
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            type: '',
        },
    });

    const navigate = useNavigate();
    const { refetch } = useAppointments();

    const onSubmit = async (data) => {
        try {
            await createAppointment(data);
            refetch();
            navigate('/appointments');
        } catch (err) {
            const { message, details } = err.response.data;
            if (details?.fields) {
                details.fields.forEach((f) => {
                    setError(f.path, { type: 'server', message: f.msg });
                });
            } else {
                alert(message);
            }
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
                <Paper variant='surface-form-outlined' sx={{ width: '720px', p: 4 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={1} sx={{ p: 1 }}>
                            <Grid container size={12} sx={{ justifyContent: 'start', pb: 2 }}>
                                <Typography variant='h2'>Crear Nueva Cita</Typography>
                            </Grid>
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
                                    errors={errors}
                                    rules={{ required: 'El profesional es obligatorio' }}
                                />
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
                                <AgendaAutocomplete
                                    control={control}
                                    errors={errors}
                                    rules={{ required: 'La agenda es obligatoria' }}
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
            </Box>
        </Stack>
    );
}
