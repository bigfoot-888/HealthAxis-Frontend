import {FormDialog} from '@/components/dialogs/index';
import { useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import { useTreatments } from '@treatments/hooks/useTreatments';
import { updateTreatmentState } from '@treatments/api/treatment-api';
import {RHFRadioInput} from '@/components/forms/inputs/index';
import { useState } from 'react';
import { TREATMENT_STATE_LABELS } from '@treatments/utils/chip-values';
import { handleApiError } from '@/utils/handle-errors';

export default function UpdateTreatmentStateForm({ treatment, handleClose }) {
    const {
        register,
        handleSubmit,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({ mode: 'onBlur', defaultValues: { state: '' } });
    const { refetch } = useTreatments();
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        try {
            await updateTreatmentState(treatment.uuid, data.state);
            refetch();
            handleClose();
        } catch (err) {
            handleApiError(err, setError, setFormError); 
        }
    };

    const statusOptions = Object.entries(TREATMENT_STATE_LABELS).map(([value, label]) => ({ value, label }));

    return (
        <FormDialog
            open={!!treatment}
            handleClose={handleClose}
            handleSubmit={handleSubmit(onSubmit)}
            error={error}
            onErrorClose={() => setError(null)}
            title={`Actualizar estado clínico — ${!!treatment && treatment.name} (${!!treatment && treatment.patient.fullName})`}
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
