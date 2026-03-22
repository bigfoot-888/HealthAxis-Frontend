import { useForm, Controller } from 'react-hook-form';
import { Grid } from '@mui/material';
import { useState } from 'react';

import { RHFRadioInput } from '@/components/forms/inputs/index';
import { FormDialog } from '@/components/dialogs/index';

import { handleApiError } from '@/utils/handle-errors';

import { DIAGNOSIS_RECORD_STATE_LABELS } from '@diagnoses/utils/chip-values';

import { updateDiagnosisRecordState } from '@diagnoses/api/diagnosis-api';
import { useDiagnoses } from '@diagnoses/hooks/useDiagnoses';

export default function UpdateDiagnosisRecordStateForm({ diagnosis, handleClose }) {
    const {
        register,
        handleSubmit,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({ mode: 'onBlur', defaultValues: { state: '' } });
    const { refetch } = useDiagnoses();
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        try {
            await updateDiagnosisRecordState(diagnosis.uuid, data.state);
            refetch();
            handleClose();
        } catch (err) {
            handleApiError(err, setError, setFormError);
        }
    };

    const statusOptions = Object.entries(DIAGNOSIS_RECORD_STATE_LABELS).map(([value, label]) => ({ value, label }));

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
                        name='state'
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
