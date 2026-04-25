import { Grid, Paper } from '@mui/material';
import { Button, Typography } from '@mui/material';

import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

import { useClinicalDocuments } from '@clinical-documents/hooks/useClinicalDocuments';
import { createClinicalDocument, createClinicalAttachment } from '@clinical-documents/api/clinical-document.api';
import {SelectInput, BasicTextInput} from '@/components/forms/inputs/index';
import {BasicFormLayout} from '@/components/forms/index';

import { CLINICAL_DOCUMENT_TYPE_LABELS } from '@clinical-documents/utils/chip-values';
import { ClinicalDocumentAttachmentsField } from '../ui/ClinicalDocumentAttachmentsField';
import { ClinicalDocumentUsersField } from '../ui/ClinicalDocumentUsersField';

export default function CreateExternalClinicalDocument() {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        setError,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            severity: '',
            status: '',
        },
    });

    const navigate = useNavigate();
    const { refetch } = useClinicalDocuments();

const onSubmit = async (data) => {
    try {
        const attachmentIds = [];

        if (data.attachments?.length) {
            for (const attachment of data.attachments) {
                if (!attachment.file) continue;

                const formData = new FormData();
                formData.append('file', attachment.file);
                formData.append('fileName', attachment.file.name);     // original file name
                formData.append('fileSize', attachment.file.size);     // size in bytes

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

        refetch();
        navigate('/clinical-records/clinical-documents');

    } catch (err) {
        const { message, details } = err.response.data;

        if (details?.fields) {
            details.fields.forEach((f) => {
                setError(f.path, { type: 'server', message: f.msg });
            });
        } else {
            alert(message);
        }
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
                                items={CLINICAL_DOCUMENT_TYPE_LABELS}
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
