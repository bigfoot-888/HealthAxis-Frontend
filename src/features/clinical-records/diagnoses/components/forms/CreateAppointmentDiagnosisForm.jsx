import { useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import { useState } from 'react';

import { BasicTextInput, SelectInput } from '@/components/forms/inputs';
import { FormDialog } from '@/components/dialogs';
import { handleApiError } from '@/utils/handle-errors';

import { createDiagnosis } from '@diagnoses/api/diagnosis.api';
import { useSnackbar } from '@/app/SnackBarContext';

import { useQueryClient } from '@tanstack/react-query';
import { invalidateCreateDiagnosisWithAppointment } from '@diagnoses/utils/diagnosis-query.utils';
import { mapDiagnosisConfigToItems } from '@diagnoses/utils/diagnosis-status.utils';
import { DIAGNOSIS_CLINICAL_STATUS_CONFIG, DIAGNOSIS_SEVERITY_CONFIG } from '@/shared/constants/diagnosis.constants';

export default function CreateAppointmentDiagnosisForm({ open, handleClose, appointment }) {
    const {
        handleSubmit,
        register,
        reset,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            name: '',
            severity: '',
            clinicalStatus: '',
            description: '',
        },
    });

    const [error, setError] = useState(null);
    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient()

    const onSubmit = async (data) => {
        try {
            await createDiagnosis({
                ...data,
                diagnosedAt: new Date(),
                users: [{ user: { id: appointment.userId }, role: 'AUTHOR' }],
                patient: { id: appointment.patientId },
                appointment: { id: appointment.id },
            });
            invalidateCreateDiagnosisWithAppointment(queryClient, appointment)
            reset(); 
            handleClose();
            showSnackbar({ message: 'Diagnóstico creado correctamente' });
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
            title='Añadir diagnóstico'
        >
            <Grid container spacing={2} sx={{ pt: 1 }}>
                <Grid size={12}>
                    <BasicTextInput
                        label='Nombre del diagnóstico'
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

                <Grid size={{ xs: 12, md: 6 }}>
                    <SelectInput
                        control={control}
                        errors={errors}
                        name='severity'
                        label='Gravedad'
                        rules={{ required: 'La gravedad es obligatoria' }}
                        items={mapDiagnosisConfigToItems(DIAGNOSIS_SEVERITY_CONFIG)}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <SelectInput
                        control={control}
                        errors={errors}
                        name='clinicalStatus'
                        label='Estado'
                        rules={{ required: 'El estado es obligatorio' }}
                        items={mapDiagnosisConfigToItems(DIAGNOSIS_CLINICAL_STATUS_CONFIG)}
                    />
                </Grid>
            </Grid>
        </FormDialog>
    );
}
