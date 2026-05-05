import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
import { Grid, Paper, Button, Typography } from '@mui/material';

import {
    PatientAutocomplete,
    AppointmentAutocomplete,
    DiagnosisAutocomplete,
} from '@/components/forms/autocompletes/index';
import { SelectInput, BasicTextInput } from '@/components/forms/inputs/index';
import { BasicFormLayout } from '@/components/forms/index';
import { ErrorAlert } from '@/components/ui/index';

import { useTreatments } from '@treatments/hooks/useTreatments';
import { createTreatment } from '@treatments/api/treatment.api';

import { TreatmentProfessionalsField } from '@treatments/components/ui/TreatmentProfessionals';
import { handleApiError } from '@/utils/handle-errors';

import { useQueryClient } from '@tanstack/react-query';
import { TREATMENT_CLINICAL_STATUS_CONFIG } from '@/shared/constants/treatment.constants';
import { useSnackbar } from '@/app/SnackBarContext';

import { invalidateCreateTreatmentQueries } from '@treatments/utils/treatment-query.utils';

export default function CreateTreatmentForm() {
    const {
        register,
        handleSubmit,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            clinicalStatus: '',
        },
    });

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/clinical-records/treatments';
    const [error, setError] = useState(null);
    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbar();

    const onSubmit = async (data) => {
        try {
            await createTreatment(data);
            refetch();
            invalidateCreateTreatmentQueries(queryClient); 
            navigate(from);
            showSnackbar({ message: 'Tratamiento creado correctamente' });
        } catch (err) {
            handleApiError(err, setError, setFormError);
        }
    };

    return (
        <BasicFormLayout drawer={false}>
            <Paper variant='surface-form-outlined' sx={{ width: '720px', p: 4 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={1} sx={{ p: 1 }}>
                        <Grid container size={12} sx={{ justifyContent: 'start', pb: 2 }}>
                            <Typography variant='h2'>Crear nuevo tratamiento</Typography>
                        </Grid>

                        <ErrorAlert error={error} onErrorClose={() => setError(null)} />

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
                                    required: 'El nombre es obligatorio',
                                    maxLength: {
                                        value: 100,
                                        message: 'Máximo 100 caracteres',
                                    },
                                }}
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                            <SelectInput
                                control={control}
                                errors={errors}
                                name='clinicalStatus'
                                label='Estado'
                                rules={{ required: 'El estado es obligatorio' }}
                                items={Object.fromEntries(
                                    Object.entries(TREATMENT_CLINICAL_STATUS_CONFIG).map(([key, value]) => [
                                        key,
                                        value.label,
                                    ]),
                                )}
                            />
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
                                label='Descripción (opcional)'
                                name='description'
                                type='text'
                                register={register}
                                rules={{
                                    maxLength: {
                                        value: 1000,
                                        message: 'Máximo 1000 caracteres',
                                    },
                                }}
                                errors={errors}
                                others={{ multiline: true, rows: 3 }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
                                label='Duración (opcional)'
                                name='duration'
                                type='text'
                                register={register}
                                rules={{
                                    maxLength: {
                                        value: 80,
                                        message: 'Máximo 80 caracteres',
                                    },
                                }}
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Typography variant='h4' component='h3' sx={{ pb: 1 }}>
                                Contexto
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <AppointmentAutocomplete control={control} errors={errors} />
                        </Grid>
                        <Grid size={12}>
                            <DiagnosisAutocomplete control={control} />
                        </Grid>
                        <Grid size={12}>
                            <Typography variant='h4' component='h3' sx={{ pb: 1 }}>
                                Participantes
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <TreatmentProfessionalsField
                                control={control}
                                errors={errors}
                                rules={{
                                    validate: (value) =>
                                        (value && value.length > 0) || 'Debe haber al menos un profesional',
                                }}
                            />
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
