import { Grid, Paper } from '@mui/material';
import { Button, Typography } from '@mui/material';

import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

import { useClinicalDocuments } from '@clinical-documents/hooks/useClinicalDocuments';
import { createClinicalDocument, createClinicalAttachment } from '@clinical-documents/api/clinical-document.api';
import { SelectInput, BasicTextInput } from '@/components/forms/inputs/index';
import { BasicFormLayout } from '@/components/forms/index';

import { CLINICAL_DOCUMENT_TYPE_CONFIG } from '@/shared/constants/clinical-document.constants';
import { ClinicalDocumentAttachmentsField } from '../ui/ClinicalDocumentAttachmentsField';
import { ClinicalDocumentUsersField } from '../ui/ClinicalDocumentUsersField';
import { useSnackbar } from '@/app/SnackBarContext';

import { ErrorAlert } from '@/components/ui';

import { useState } from 'react';
import { invalidateCreateDocumentQueries } from '@clinical-documents/utils/clinical-document-query.utils';
import { useQueryClient } from '@tanstack/react-query';

export default function CreateExternalClinicalDocument() {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        setError: setFormError,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            severity: '',
            status: '',
        },
    });

    const navigate = useNavigate();
    const queryClient = useQueryClient(); 
    const [error, setError] = useState(null);
    const { showSnackbar } = useSnackbar();

    const documentTypeOptions = Object.fromEntries(
        Object.entries(CLINICAL_DOCUMENT_TYPE_CONFIG).map(([key, { label }]) => [key, label]),
    );

    const onSubmit = async (data) => {
        try {
            const attachmentIds = [];

            if (data.attachments?.length) {
                for (const attachment of data.attachments) {
                    if (!attachment.file) continue;

                    const formData = new FormData();
                    formData.append('file', attachment.file);
                    formData.append('fileName', attachment.file.name); 
                    formData.append('fileSize', attachment.file.size); 

                    const createdAttachment = await createClinicalAttachment(formData);
                    attachmentIds.push(createdAttachment.id);
                }
            }
            await createClinicalDocument({
                title: data.title,
                documentType: data.documentType,
                users: data.users,
                attachments: attachmentIds,
            });

            invalidateCreateDocumentQueries(queryClient); 
            navigate('/clinical-records/clinical-documents');

            showSnackbar({ message: 'Documento creado correctamente' });
        } catch (err) {
            handleApiError(err, setError, setFormError);
        }
    };

    return (
        <BasicFormLayout drawer={false}>
            <Paper variant='surface-form-outlined' sx={{ width: '720px', p: 4 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={1} sx={{ p: 1 }}>
                        <Grid container size={12} sx={{ justifyContent: 'start', pb: 2 }}>
                            <Typography variant='h2'>Crear nuevo documento clínico externo</Typography>
                        </Grid>
                        <Grid size={12}>
                            <Typography variant='h4' component='h3' sx={{ pb: 1 }}>
                                Información básica
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
                                label='Título del documento'
                                name='title'
                                type='text'
                                register={register}
                                rules={{
                                    required: 'El título del documento es obligatorio',
                                }}
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                            <SelectInput
                                control={control}
                                errors={errors}
                                name='documentType'
                                label='Tipo de documento'
                                rules={{ required: 'El tipo de documento es obligatorio' }}
                                items={documentTypeOptions}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Typography variant='h4' component='h3' sx={{ pb: 1 }}>
                                Archivos
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <ClinicalDocumentAttachmentsField control={control} setValue={setValue} />
                        </Grid>
                        <Grid size={12}>
                            <Typography variant='h4' component='h3' sx={{ pb: 1 }}>
                                Participantes
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <ClinicalDocumentUsersField control={control} />
                        </Grid>
                        <ErrorAlert error={error} onClose={() => setError(null)} />
                        <Grid container justifyContent='space-between' size={12} sx={{ marginTop: 2 }}>
                            <Grid>
                                <Button variant='contained' size='large' type='submit'>
                                    Aceptar
                                </Button>
                            </Grid>
                            <Grid>
                                <Button
                                    variant='outlined'
                                    size='large'
                                    component={Link}
                                    to='/clinical-records/clinical-documents'
                                >
                                    Cancelar
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </BasicFormLayout>
    );
}
