import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { DialogTextInput } from '@/components/forms/inputs/index';
import { FormDialog } from '@/components/dialogs/index';
import { handleApiError } from '@/utils/handle-errors';
import { updateAgenda } from '@/features/agendas/api/agenda.api';
import { useSnackbar } from '@/app/SnackBarContext';
import { invalidateEditAgendaQueries } from '../../utils/agenda-query.utils';

export default function EditAgendaForm({ agenda, handleClose }) {
    const {
        register,
        handleSubmit,
        setError: setFormError,
        formState: { errors },
        reset,
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            name: agenda?.name || '',
        },
    });

    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbar();
    const [error, setError] = useState(null);

    const onSubmit = async data => {
        try {
            await updateAgenda(agenda.uuid, data);
            invalidateEditAgendaQueries(queryClient, agenda);
            handleClose();
            showSnackbar({ message: 'Agenda editada correctamente' });
        } catch (err) {
            handleApiError(err, setError, setFormError);
        }
    };
    useEffect(() => {
        if (agenda) reset({ ...agenda });
    }, [agenda, reset]);

    return (
        <FormDialog
            open={!!agenda}
            handleClose={handleClose}
            handleSubmit={handleSubmit(onSubmit)}
            title='Editar agenda'
            error={error}
            onErrorClose={() => setError(null)}
        >
            <Grid container rowSpacing={1.5} columnSpacing={3} sx={{ p: 1 }}>
                <Grid size={12}>
                    <DialogTextInput
                        label='Nombre'
                        name='name'
                        type='text'
                        rules={{
                            required: 'El nombre es obligatorio',
                            maxLength: {
                                value: 50,
                                message: 'Máximo 50 caracteres',
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
