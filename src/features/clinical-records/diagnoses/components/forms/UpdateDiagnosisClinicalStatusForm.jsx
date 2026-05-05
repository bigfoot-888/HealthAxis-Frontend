import { useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import { useState } from 'react';

import { RHFRadioInput } from '@/components/forms/inputs/index';
import { FormDialog } from '@/components/dialogs/index';
import { handleApiError } from '@/utils/handle-errors';

import { DIAGNOSIS_CLINICAL_STATUS_CONFIG } from '@/shared/constants/diagnosis.constants';

import { useDiagnoses } from '@diagnoses/hooks/useDiagnoses';
import { updateDiagnosisClinicalStatus} from '@diagnoses/api/diagnosis.api';

import { useSnackbar } from '@/app/SnackBarContext';

export default function UpdateDiagnosisClinicalStatusForm({ diagnosis, handleClose }) {
    const {
        register,
        handleSubmit,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({ mode: 'onBlur', defaultValues: { clinicalStatus: '' } });
    const { refetch } = useDiagnoses();
    const [error, setError] = useState(null);
    const { showSnackbar } = useSnackbar();

    const onSubmit = async (data) => {
        try {
            await updateDiagnosisClinicalStatus(diagnosis.uuid, data.clinicalStatus);
            refetch();
            handleClose();
            showSnackbar({ message: 'Estado clínico del diagnóstico actualizado correctamente' });
        } catch (err) {
            handleApiError(err, setError, setFormError);
        }
    };

    const statusOptions = Object.entries(DIAGNOSIS_CLINICAL_STATUS_CONFIG).map(([value, config]) => ({
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
            title={`Actualizar estado clínico — ${!!diagnosis && diagnosis.name} (${!!diagnosis && diagnosis.patient.fullName})`}
        >
            <Grid container columnSpacing={3} sx={{ pt: 1 }}>
                <Grid size={12}>
                    <RHFRadioInput
                        name='clinicalStatus'
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
