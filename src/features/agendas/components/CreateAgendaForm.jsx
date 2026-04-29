import { useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import { useState } from 'react';
import {DialogTextInput} from '@/components/forms/inputs/index';
import {RHFDatePicker} from '@/components/forms/pickers/index';
import {FormDialog} from '@/components/dialogs/index.js';

import { handleApiError } from '@/utils/handle-errors';

import { useAgendas } from '@agendas/hooks/useAgendas';
import { createAgenda } from '@agendas/api/agenda-api';

import { useSnackbar } from '@/app/SnackBarContext';

export default function CreateAgendaForm({ isCreateAgendaOpen, handleClose }) {
    const {
        register,
        handleSubmit,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({ mode: 'onBlur' });

    const { refetch } = useAgendas();
    const [error, setError] = useState(null); 
    const { showSnackbar } = useSnackbar();
    
    const onSubmit = async (data) => {
        try {
            await createAgenda(data);
            refetch();
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
                        rules={{ required: 'El nombre es obligatorio' }}
                        errors={errors}
                        register={register}
                    />
                </Grid>
                <Grid size={6}>
                    <RHFDatePicker
                        name='openingDate'
                        control={control}
                        rules={{ required: 'La fecha de apertura es obligatoria' }}
                        label='Fecha de apertura'
                    />
                </Grid>
                <Grid size={6}>
                    <RHFDatePicker
                        name='closingDate'
                        control={control}
                        rules={{ required: 'La fecha de cierre es obligatoria' }}
                        label='Fecha de cierre'
                    />
                </Grid>
            </Grid>
        </FormDialog>
    );
}
