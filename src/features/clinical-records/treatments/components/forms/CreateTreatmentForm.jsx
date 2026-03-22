import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { Grid, Paper, Button, Typography } from '@mui/material';

import { PatientAutocomplete, AppointmentAutocomplete } from '@/components/forms/autocompletes/index';
import {RHFDateTimePicker} from '@/components/forms/pickers/index';
import {SelectInput, BasicTextInput} from '@/components/forms/inputs/index';
import {BasicFormLayout} from '@/components/forms/index';
import { ErrorAlert } from '@/components/ui/index';

import { useTreatments } from '@treatments/hooks/useTreatments';
import { createTreatment } from '@treatments/api/treatment-api';

import { TreatmentProfessionalsField } from '@treatments/components/ui/TreatmentProfessionals';
import { TreatmentDiagnoses } from '@treatments/components/ui/TreatmentDiagnoses';
import { handleApiError } from '@/utils/handle-errors';

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
            severity: '',
            state: '',
        },
    });

    const navigate = useNavigate();
    const { refetch } = useTreatments();
    const [error, setError] = useState(null); 

    const onSubmit = async (data) => {
        try {
            await createTreatment(data);
            refetch();
            navigate('/clinical-records/treatments');
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
                            <Typography variant='h2'>Crear nuevo tratamiento</Typography>
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
                            <BasicTextInput
                                label='Nombre del tratamiento'
                                name='name'
                                type='text'
                                register={register}
                                rules={{
                                    required: 'El nombre del tratamiento es obligatorio',
                                }}
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                            <SelectInput
                                control={control}
                                errors={errors}
                                name='state'
                                label='Estado'
                                rules={{ required: 'El estado es obligatorio' }}
                                items={{
                                    PLANNED: 'Planificado',
                                    ONGOING: 'En curso',
                                    GIVEN: 'Dado'
                                }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
                                label='Descripción'
                                name='description'
                                type='text'
                                register={register}
                                errors={errors}
                                others={{ multiline: true, rows: 3 }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
                                label='Duración'
                                name='duration'
                                type='text'
                                register={register}
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Typography variant='h4' component='h3' sx={{ pb: 1 }}>
                                Contexto
                            </Typography>
                        </Grid>
                            <RHFDateTimePicker
                                name='devisedAt'
                                control={control}
                                label='Fecha y hora de creación del tratamiento'
                            />
                        <Grid size={12}>
                            <AppointmentAutocomplete
                                control={control}
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                                <TreatmentDiagnoses control={control}/>
                        </Grid>
                        <Grid size={12}>
                            <Typography variant='h4' component='h3' sx={{ pb: 1 }}>
                                Participantes
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <TreatmentProfessionalsField control={control}  />
                        </Grid>
                        <Grid size={12}>
                            <Typography variant='h4' component='h3' sx={{ pb: 1 }}>
                                Detalles
                            </Typography>
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
