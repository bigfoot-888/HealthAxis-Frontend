import { FormDialog } from '@/components/dialogs/index';
import { useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import { useTreatments } from '@treatments/hooks/useTreatments';
import { updateTreatmentStatus } from '@treatments/api/treatment.api';
import { RHFRadioInput } from '@/components/forms/inputs/index';
import { useState } from 'react';
import { TREATMENT_STATUS_CONFIG } from '@/shared/constants/treatment.constants';
import { handleApiError } from '@/utils/handle-errors';

export default function UpdateTreatmentStatusForm({ treatment, handleClose }) {
    const {
        register,
        handleSubmit,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({ mode: 'onBlur', defaultValues: { status: '' } });
    const { refetch } = useTreatments();
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        try {
            await updateTreatmentStatus(treatment.uuid, data.status);
            refetch();
            handleClose();
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
