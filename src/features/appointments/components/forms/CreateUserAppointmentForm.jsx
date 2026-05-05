import { useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import { useState } from 'react';

import { BasicTextInput, SelectInput } from '@/components/forms/inputs';
import { PatientAutocomplete } from '@/components/forms/autocompletes';
import { RHFDateTimePicker } from '@/components/forms/pickers';
import { FormDialog } from '@/components/dialogs';
import { handleApiError } from '@/utils/handle-errors';

import { createAppointment } from '@appointments/api/appointment.api';
import { useSnackbar } from '@/app/SnackBarContext';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateCreateAppointmentWithUser } from '@appointments/utils/appointment-query.utils';

export default function CreateUserAppointmentForm({ open, handleClose, user }) {
    const {
        register,
        handleSubmit,
        control,
        setError: setFormError,
        reset,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            type: '',
        },
    });

    const [error, setError] = useState(null);
    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient(); 

    const onSubmit = async (data) => {
        try {
            await createAppointment({ ...data, user: { id: user.id } });
            reset();
            invalidateCreateAppointmentWithUser(queryClient, user)
            handleClose();
            showSnackbar({ message: 'Cita creada correctamente' });
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
            title='Añadir cita'
        >
            <Grid container spacing={2} sx={{ pt: 1 }}>
                <Grid size={12}>
                    <PatientAutocomplete
                        control={control}
                        errors={errors}
                        rules={{ required: 'El paciente es obligatorio' }}
                    />
                </Grid>

                <Grid size={12}>
                    <SelectInput
                        control={control}
                        name='type'
                        label='Modalidad'
                        rules={{ required: 'La modalidad es obligatoria' }}
                        items={{
                            IN_PERSON: 'Presencial',
                            VIRTUAL: 'Virtual',
                        }}
                    />
                </Grid>

                <Grid size={12}>
                    <RHFDateTimePicker
                        name='startTime'
                        control={control}
                        rules={{
                            required: 'La fecha y hora de inicio es obligatoria',
                            validate: (value) => {
                                const date = new Date(value);
                                return !isNaN(date) || 'Fecha inválida';
                            },
                        }}
                        label='Fecha y hora'
                    />
                </Grid>

                <Grid size={12}>
                    <BasicTextInput
                        label='Lugar'
                        name='location'
                        register={register}
                        rules={{
                            maxLength: {
                                value: 100,
                                message: 'Máximo 100 caracteres',
                            },
                        }}
                        errors={errors}
                    />
                </Grid>

                <Grid size={12}>
                    <BasicTextInput
                        label='Motivo'
                        name='reason'
                        register={register}
                        rules={{
                            required: 'El motivo es obligatorio',
                            maxLength: {
                                value: 255,
                                message: 'Máximo 255 caracteres',
                            },
                        }}
                        errors={errors}
                    />
                </Grid>
            </Grid>
        </FormDialog>
    );
}
