import { useForm, Controller } from 'react-hook-form';
import { Grid } from '@mui/material';
import { useState } from 'react';

import { RHFRadioInput } from '@/components/forms/inputs/index';
import { FormDialog } from '@/components/dialogs/index';

import { handleApiError } from '@/utils/handle-errors';

import { DIAGNOSIS_STATUS_LABELS } from '@diagnoses/utils/chip-values';

import { updateDiagnosisStatus } from '@diagnoses/api/diagnosis.api';
import { useDiagnoses } from '@diagnoses/hooks/useDiagnoses';

import { useSnackbar } from '@/app/SnackBarContext';

export default function UpdateDiagnosisStatusForm({ diagnosis, handleClose }) {
    const {
        register,
        handleSubmit,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({ mode: 'onBlur', defaultValues: { status: '' } });
    const { refetch } = useDiagnoses();
    const [error, setError] = useState(null);
    const { showSnackbar } = useSnackbar();

    const onSubmit = async (data) => {
        try {
            await updateDiagnosisStatus(diagnosis.uuid, data.status);
            refetch();
            handleClose();
            showSnackbar({ message: 'Estado del diagnóstico actualizado correctamente' });
        } catch (err) {
            handleApiError(err, setError, setFormError);
        }
    };

    const statusOptions = Object.entries(DIAGNOSIS_STATUS_LABELS).map(([value, label]) => ({ value, label }));

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
