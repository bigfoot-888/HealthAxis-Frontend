import { useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import { useState } from 'react';

import { BasicTextInput, SelectInput } from '@/components/forms/inputs';
import { DiagnosisAutocomplete } from '@/components/forms/autocompletes';
import { FormDialog } from '@/components/dialogs';

import { handleApiError } from '@/utils/handle-errors';

import { createTreatment } from '@treatments/api/treatment.api';
import { useSnackbar } from '@/app/SnackBarContext';
import { useQueryClient } from '@tanstack/react-query';
import { TREATMENT_CLINICAL_STATUS_CONFIG } from '@/shared/constants/treatment.constants';
import { invalidateCreateTreatmentWithPatient } from '@treatments/utils/treatment-query.utils';
import { TreatmentProfessionalsField } from '@treatments/components/ui/TreatmentProfessionals';

export default function CreatePatientTreatmentForm({ open, handleClose, patient }) {
    const {
        handleSubmit,
        register,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            name: '',
            clinicalStatus: '',
            description: '',
            diagnosis: null,
            users: [{ user: null, role: '' }],
        },
    });

    const [error, setError] = useState(null);
    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const onSubmit = async (data) => {
        try {
            await createTreatment({
                ...data,
                patient: { id: patient.id },
            });

            invalidateCreateTreatmentWithPatient(queryClient, patient, data.diagnosis);
            handleClose();
            showSnackbar({ message: 'Tratamiento creado correctamente' });
        } catch (err) {
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
            title='Añadir tratamiento'
        >
            <Grid container spacing={2} sx={{ pt: 1 }}>
                <Grid size={12}>
                    <BasicTextInput
                        label='Nombre del tratamiento'
                        name='name'
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
                            Object.entries(TREATMENT_CLINICAL_STATUS_CONFIG).map(([key, value]) => [key, value.label]),
                        )}
                    />
                </Grid>

                <Grid size={12}>
                    <BasicTextInput
                        label='Descripción (opcional)'
                        name='description'
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
                    <DiagnosisAutocomplete
                        control={control}
                        errors={errors}
                        rules={{ required: 'El diagnóstico es obligatorio' }}
                    />
                </Grid>

                <Grid size={12}>
                    <TreatmentProfessionalsField
                        control={control}
                        errors={errors}
                        rules={{
                            validate: (value) => (value && value.length > 0) || 'Debe haber al menos un profesional',
                        }}
                        multiple={false}
                    />
                </Grid>
            </Grid>
        </FormDialog>
    );
}
