import { useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import { useState } from 'react';

import { RHFRadioInput } from '@/components/forms/inputs';
import { FormDialog } from '@/components/dialogs';
import { handleApiError } from '@/utils/handle-errors';

import { CLINICAL_DOCUMENT_STATUS_CONFIG } from '@/shared/constants/clinical-document.constants';

import { useClinicalDocuments } from '@clinical-documents/hooks/useClinicalDocuments';
import { updateClinicalDocumentStatus } from '@clinical-documents/api/clinical-document.api';

import { useSnackbar } from '@/app/SnackBarContext';

export default function UpdateClinicalDocumentStatusForm({ clinicalDocument, handleClose }) {
    const {
        handleSubmit,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
        defaultValues: { status: '' },
    });

    const { refetch } = useClinicalDocuments();
    const [error, setError] = useState(null);
    const { showSnackbar } = useSnackbar();

    const onSubmit = async (data) => {
        try {
            await updateClinicalDocumentStatus(clinicalDocument.uuid, data.status);
            refetch();
            handleClose();
            showSnackbar({ message: 'Documento editado correctamente' });
        } catch (err) {
            handleApiError(err, setError, setFormError);
        }
    };

    const statusOptions = Object.entries(CLINICAL_DOCUMENT_STATUS_CONFIG).map(([value, config]) => ({
        value,
        label: config.label,
    }));

    return (
        <FormDialog
            open={!!clinicalDocument}
            handleClose={handleClose}
            handleSubmit={handleSubmit(onSubmit)}
            error={error}
            onErrorClose={() => setError(null)}
            title={`Actualizar estado — ${
                clinicalDocument?.title || clinicalDocument?.name || ''
            }`}
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
