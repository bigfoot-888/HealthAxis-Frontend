import { useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import { useState } from 'react';

import { BasicTextInput, SelectInput } from '@/components/forms/inputs';
import { FormDialog } from '@/components/dialogs';
import { handleApiError } from '@/utils/handle-errors';

import { createDiagnosis } from '@diagnoses/api/diagnosis.api';
import { useDiagnosesByAppointment } from '@diagnoses/hooks/useDiagnosesByAppointment';

export default function CreateAppointmentDiagnosisForm({ open, handleClose, appointment }) {
    const {
        handleSubmit,
        register,
        control,
        setError: setFormError,
        reset,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            diagnosis: {
                name: '',
                severity: '',
                clinicalStatus: '',
                description: '',
                notes: '',
            },
        },
    });

    const [error, setError] = useState(null);
    const {refetch} = useDiagnosesByAppointment(appointment.uuid);

    const onSubmit = async (data) => {
        try {
            await createDiagnosis({
                name: data.diagnosis.name,
                severity: data.diagnosis.severity,
                clinicalStatus: data.diagnosis.clinicalStatus,
                description: data.diagnosis.description,
                notes: data.diagnosis.notes,

                diagnosedAt: new Date(),

                users: [
                    {
                        user: {
                            id: appointment.userId,
                        },
                        role: "AUTHOR"
                    },
                ],

                patient: {
                    id: appointment.patientId,
                },

                appointment: {
                    id: appointment.id
                }
            });

            reset();
            refetch();
            handleClose();
        } catch (err) {
            console.log(err)
            handleApiError(err, setError, setFormError);
        }
    };

    return (
        <FormDialog
            open={open}
            handleClose={handleClose}
            handleSubmit={handleSubmit(onSubmit)}
            error={error}
            onErrorClose={() => setError(null)}
            title='Añadir diagnóstico'
        >
            <Grid container spacing={2} sx={{ pt: 1 }}>
                <Grid size={12}>
                    <BasicTextInput
                        label='Nombre del diagnóstico'
                        name='diagnosis.name'
                        register={register}
                        rules={{ required: 'El nombre es obligatorio' }}
                        errors={errors}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <SelectInput
                        control={control}
                        errors={errors}
                        name='diagnosis.severity'
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

                <Grid size={{ xs: 12, md: 6 }}>
                    <SelectInput
                        control={control}
                        errors={errors}
                        name='diagnosis.clinicalStatus'
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
                        name='diagnosis.description'
                        register={register}
                        errors={errors}
                        others={{ multiline: true, rows: 3 }}
                    />
                </Grid>

                <Grid size={12}>
                    <BasicTextInput
                        label='Notas (opcional)'
                        name='diagnosis.notes'
                        register={register}
                        errors={errors}
                        others={{ multiline: true, rows: 4 }}
                    />
                </Grid>
            </Grid>
        </FormDialog>
    );
}
