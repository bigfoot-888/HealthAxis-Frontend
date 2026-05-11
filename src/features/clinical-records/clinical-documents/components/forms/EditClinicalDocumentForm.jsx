import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { DialogTextInput } from '@/components/forms/inputs/index';
import { FormDialog } from '@/components/dialogs/index';
import { handleApiError } from '@/utils/handle-errors';
import {createClinicalAttachment, updateClinicalDocument} from '@clinical-documents/api/clinical-document.api'
import { useSnackbar } from '@/app/SnackBarContext';
import { invalidateEditDocumentQueries } from '@clinical-documents/utils/clinical-document-query.utils';
import { ClinicalDocumentUsersField } from '../ui/ClinicalDocumentUsersField';
import { ClinicalDocumentAttachmentsField } from '../ui/ClinicalDocumentAttachmentsField';

export default function EditClinicalDocumentForm({ document, handleClose }) {
    const {
        register,
        handleSubmit,
        setError: setFormError,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            title: document?.title || '',
        },
    });

    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbar();
    const [error, setError] = useState(null);

    const onSubmit = async data => {
        try {
            await updateClinicalDocument(document.uuid, data);
            invalidateEditDocumentQueries(queryClient, document);
            handleClose();
            showSnackbar({ message: 'Documento editado correctamente' });
        } catch (err) {
            handleApiError(err, setError, setFormError);
        }
    };

    return (
        <FormDialog
            open={!!document}
            handleClose={handleClose}
            handleSubmit={handleSubmit(onSubmit)}
            title='Editar documento'
            error={error}
            onErrorClose={() => setError(null)}
        >
            <Grid container rowSpacing={1.5} columnSpacing={3} sx={{ p: 1 }}>
                <Grid size={12}>
                    <DialogTextInput
                        label='Nombre'
                        name='title'
                        type='text'
                        rules={{
                            required: 'El nombre es obligatorio',
                            maxLength: {
                                value: 100,
                                message: 'Máximo 100 caracteres',
                            },
                        }}
                        errors={errors}
                        register={register}
                    />
                </Grid>
            </Grid>
        </FormDialog>
    );
}
