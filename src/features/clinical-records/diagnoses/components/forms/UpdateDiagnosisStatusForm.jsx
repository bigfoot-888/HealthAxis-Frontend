import { useForm, Controller } from 'react-hook-form';
import { Grid } from '@mui/material';
import { useState } from 'react';

import { RHFRadioInput } from '@/components/forms/inputs/index';
import { FormDialog } from '@/components/dialogs/index';

import { handleApiError } from '@/utils/handle-errors';

import { DIAGNOSIS_STATUS_CONFIG } from '@/shared/constants/diagnosis.constants';

import { updateDiagnosisStatus } from '@diagnoses/api/diagnosis.api';
import { useDiagnoses } from '@diagnoses/hooks/useDiagnoses';

import { useSnackbar } from '@/app/SnackBarContext';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateEditDiagnosisQueries } from '../../utils/diagnosis-query.utils';

export default function UpdateDiagnosisStatusForm({ diagnosis, handleClose }) {
    const {
        register,
        handleSubmit,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({ mode: 'onBlur', defaultValues: { status: '' } });
    const [error, setError] = useState(null);
    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const onSubmit = async data => {
        try {
            await updateDiagnosisStatus(diagnosis.uuid, data.status);
            invalidateEditDiagnosisQueries(queryClient, diagnosis);
            handleClose();
            showSnackbar({ message: 'Estado del diagnóstico actualizado correctamente' });
        } catch (err) {
            handleApiError(err, setError, setFormError);
        }
    };

    const statusOptions = Object.entries(DIAGNOSIS_STATUS_CONFIG).map(([value, config]) => ({
        value,
        label: config.label,
    }));

    return (
        <FormDialog
            open={!!diagnosis}
            handleClose={handleClose}
            handleSubmit={handleSubmit(onSubmit)}
            error={error}
            onErrorClose={() => setError(null)}
            title={`Actualizar estado del registro clínico — ${!!diagnosis && diagnosis.name} (${!!diagnosis && diagnosis.patient.fullName})`}
        >
            <Grid container columnSpacing={3} sx={{ pt: 1 }}>
                <Grid size={12}>
                    <RHFRadioInput
                        name='status'
                        control={control}
                        rules={{ required: 'Es obligatorio indicar el nuevo estado' }}
                        errors={errors}
                        label='Nuevo estado'
                        options={statusOptions}
                        row={true}
                    />
                </Grid>
            </Grid>
        </FormDialog>
    );
}
