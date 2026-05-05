import { FormDialog } from '@/components/dialogs/index';
import { useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import { updateTreatmentStatus } from '@treatments/api/treatment.api';
import { RHFRadioInput } from '@/components/forms/inputs/index';
import { useState } from 'react';
import { TREATMENT_STATUS_CONFIG } from '@/shared/constants/treatment.constants';
import { handleApiError } from '@/utils/handle-errors';
import { useSnackbar } from '@/app/SnackBarContext';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateEditTreatmentQueries } from '@treatments/utils/treatment-query.utils';

export default function UpdateTreatmentStatusForm({ treatment, handleClose }) {
    const {
        handleSubmit,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({ mode: 'onBlur', defaultValues: { status: '' } });
    const [error, setError] = useState(null);
    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const onSubmit = async (data) => {
        try {
            await updateTreatmentStatus(treatment.uuid, data.status);
            invalidateEditTreatmentQueries(queryClient, treatment);
            handleClose();
            showSnackbar({ message: 'Estado del tratamiento actualizado correctamente' });
        } catch (err) {
            handleApiError(err, setError, setFormError);
        }
    };

    const statusOptions = Object.entries(TREATMENT_STATUS_CONFIG).map(([value, { label }]) => ({ value, label }));

    return (
        <FormDialog
            open={!!treatment}
            handleClose={handleClose}
            handleSubmit={handleSubmit(onSubmit)}
            error={error}
            onErrorClose={() => setError(null)}
            title={`Actualizar estado del registro clínico — ${!!treatment && treatment.name} (${!!treatment && treatment.patient.fullName})`}
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
