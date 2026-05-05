import { useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import { useState } from 'react';

import { BasicTextInput, SelectInput } from '@/components/forms/inputs';
import { FormDialog } from '@/components/dialogs';
import { handleApiError } from '@/utils/handle-errors';

import { createDiagnosis } from '@diagnoses/api/diagnosis.api';
import { useSnackbar } from '@/app/SnackBarContext';

import { useQueryClient } from '@tanstack/react-query';
import { DiagnosisProfessionalsField } from '../ui/DiagnosisProfessionals';
import { invalidateCreateDiagnosisWithPatient } from '../../utils/diagnosis-query.utils';
import { mapDiagnosisConfigToItems } from '@diagnoses/utils/diagnosis-status.utils';
import { DIAGNOSIS_CLINICAL_STATUS_CONFIG, DIAGNOSIS_SEVERITY_CONFIG } from '@/shared/constants/diagnosis.constants';

export default function CreatePatientDiagnosisForm({ open, handleClose, patient }) {
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
            users: [{ user: null, role: '' }],
        },
    });

    const [error, setError] = useState(null);
    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const onSubmit = async (data) => {
        try {
            await createDiagnosis({
                ...data,
                diagnosedAt: new Date(),
                patient: { id: patient.id },
            });
            invalidateCreateDiagnosisWithPatient(queryClient, patient);
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
                    <DiagnosisProfessionalsField
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
