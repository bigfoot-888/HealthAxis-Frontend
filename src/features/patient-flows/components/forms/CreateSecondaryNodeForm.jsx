import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Grid } from '@mui/material';

import { FormDialog } from '@/components/dialogs';
import {ClinicalDocumentAutocomplete} from '@/components/forms/autocompletes';

import { handleApiError } from '@/utils/handle-errors';

import { createSecondaryNode } from '@patient-flows/api/patient-flow-api';

export default function CreateSecondaryNodeForm({ open, handleClose, parentNode, patientUuid, refetch }) {
    const {
        handleSubmit,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            clinicalDocument: null,
        },
    });

    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        try {
            if (!data.clinicalDocument) return;

            await createSecondaryNode({
                uuid: patientUuid,
                parentEventId: parentNode.id,
                clinicalDocumentId: data.clinicalDocument.id,
            });

            refetch();
            handleClose();
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
            title='Asociar documento clínico'
        >
            <Grid container columnSpacing={3} sx={{ pt: 1 }}>
                <Grid size={12}>
                    <ClinicalDocumentAutocomplete
                        control={control}
                        rules={{
                            required: 'Selecciona un documento clínico',
                        }}
                    />
                </Grid>
            </Grid>
        </FormDialog>
    );
}
