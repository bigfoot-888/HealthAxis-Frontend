import { useState } from 'react';
import { Grid, Paper } from '@mui/material';
import { Button, Typography } from '@mui/material';

import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

import { BasicTextInput, SelectInput } from '@/components/forms/inputs/index';
import { PatientAutocomplete, AppointmentAutocomplete } from '@/components/forms/autocompletes/index';
import { RHFDateTimePicker } from '@/components/forms/pickers/index';
import { BasicFormLayout } from '@/components/forms/index';

import { handleApiError } from '@/utils/handle-errors';

import { useDiagnoses } from '@diagnoses/hooks/useDiagnoses';
import { createDiagnosis } from '@diagnoses/api/diagnosis.api';
import { DiagnosisProfessionalsField } from '@diagnoses/components/ui/DiagnosisProfessionals';
import { ErrorAlert } from '@/components/ui';

export default function CreateDiagnosisForm() {
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
            clinicalStatus: '',
        },
    });

    const navigate = useNavigate();
    const { refetch } = useDiagnoses();
    const [error, setError] = useState(); 

    const onSubmit = async (data) => {
        try {
            await createDiagnosis(data);
            refetch();
            navigate('/clinical-records/diagnoses');
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
                            <Typography variant='h2'>Crear nuevo diagnóstico</Typography>
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
                                label='Nombre del diagnóstico'
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
                                name='severity'
                                label='Gravedad'
                                rules={{ required: 'La gravedad es obligatoria' }}
                                items={{
                                    LOW: 'Baja',
                                    MODERATE: 'Moderada',
                                    HIGH: 'Alta',
                                    CRITICAL: 'Crítica',
                                }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <SelectInput
                                control={control}
                                errors={errors}
                                name='clinicalStatus'
                                label='Estado'
                                rules={{ required: 'El estado es obligatorio' }}
                                items={{
                                    ACTIVE: 'Activo',
                                    CHRONIC: 'Crónico',
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
                                rules={{
    maxLength: {
        value: 1000,
        message: 'Máximo 1000 caracteres',
    },
}}
                                others={{ multiline: true, rows: 3 }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Typography variant='h4' component='h3' sx={{ pb: 1 }}>
                                Contexto
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <RHFDateTimePicker
                                name='diagnosedAt'
                                control={control}
                                rules={{
    required: 'La fecha es obligatoria',
    validate: (value) => {
        const date = new Date(value);
        return !isNaN(date) || 'Fecha inválida';
    },
}}
                                label='Fecha y hora de diagnóstico'
                            />
                        </Grid>
                        <Grid size={12}>
                            <AppointmentAutocomplete control={control} errors={errors} />
                        </Grid>
                        <Grid size={12}>
                            <Typography variant='h4' component='h3' sx={{ pb: 1 }}>
                                Participantes
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <DiagnosisProfessionalsField control={control} errors={errors} rules={{
    validate: (value) =>
        value && value.length > 0 || 'Debe haber al menos un profesional',
}}/>
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
                                <Button variant='outlined' size='large' component={Link} to='/clinical-records/diagnoses'>
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
