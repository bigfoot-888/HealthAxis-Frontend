import { useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import { useState } from 'react';
import {DialogTextInput} from '@/components/forms/inputs/index';
import {RHFDatePicker} from '@/components/forms/pickers/index';
import {FormDialog} from '@/components/dialogs/index.js';

import { handleApiError } from '@/utils/handle-errors';

import { createAgenda } from '@/features/agendas/api/agenda.api';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@/app/SnackBarContext';
import { invalidateCreateAgendaQueries } from '../../utils/agenda-query.utils';

export default function CreateAgendaForm({ isCreateAgendaOpen, handleClose }) {
    const {
        register,
        handleSubmit,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({ mode: 'onBlur' });

    const [error, setError] = useState(null); 
    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbar();
    
    const onSubmit = async (data) => {
        try {
            await createAgenda(data);
            invalidateCreateAgendaQueries(queryClient)
            handleClose();
            showSnackbar({ message: 'Agenda creada correctamente' });
        } catch (err) {
            handleApiError(err, setError, setFormError); 
        }
    };

    return (
        <FormDialog
            open={isCreateAgendaOpen}
            handleClose={handleClose}
            handleSubmit={handleSubmit(onSubmit)}
            title='Añadir nueva agenda'
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
                <Grid size={6}>
                    <RHFDatePicker
                        name='openingDate'
                        control={control}
                        rules={{
                            required: 'La fecha de apertura es obligatoria',
                            validate: (value) => {
                                const date = new Date(value);
                                return !isNaN(date) || 'Fecha inválida';
                            },
                        }}
                        label='Fecha de apertura'
                    />
                </Grid>
                <Grid size={6}>
                    <RHFDatePicker
                        name='closingDate'
                        control={control}
                        rules={{
                            required: 'La fecha de cierre es obligatoria',
                            validate: (value) => {
                                const date = new Date(value);
                                return !isNaN(date) || 'Fecha inválida';
                            },
                        }}
                        label='Fecha de cierre'
                    />
                </Grid>
            </Grid>
        </FormDialog>
    );
}
