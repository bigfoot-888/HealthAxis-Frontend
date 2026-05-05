import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Grid } from '@mui/material';

import { updateAppointmentStatus } from '@appointments/api/appointment.api';

import {BasicTextInput, RHFRadioInput} from '@/components/forms/inputs/index';
import {FormDialog} from '@/components/dialogs/index';

import { handleApiError } from '@/utils/handle-errors';

import { useSnackbar } from '@/app/SnackBarContext';
import { APPOINTMENT_STATUS_CONFIG } from '@/shared/constants/appointment.constants';
import { useQueryClient } from '@tanstack/react-query';

export default function CancelAppointmentForm({ appointment, handleClose }) {
    const {
        register,
        handleSubmit,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({ mode: 'onBlur', defaultValues: { status: "NO_SHOW" }, });
    
    const [error, setError] = useState(null);
    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbar();

    const onSubmit = async (data) => {
        try {
            await updateAppointmentStatus(appointment.uuid, data.status, data.notes);
            queryClient.invalidateQueries(['appointments']);
            queryClient.invalidateQueries(['appointments', appointment.user.uuid]);
            queryClient.invalidateQueries(['appointments', appointment.patient.uuid]);
            handleClose();
            showSnackbar({message: 'Cita cancelada correctamente',});
        } catch (err) {
            handleApiError(err, setError, setFormError)
        }
    };

    const statusOptions = ['NO_SHOW', 'CANCELLED'].map((status) => ({
        value: status,
        label: APPOINTMENT_STATUS_CONFIG[status].label,
    }));

    return (
        <FormDialog
            open={!!appointment}
            handleClose={handleClose}
            handleSubmit={handleSubmit(onSubmit)}
            error={error}
            onErrorClose={()=>setError(null)}
            title={`Cancelar la cita entre ${!!appointment && appointment.patient.fullName} y ${!!appointment && appointment.user.fullName}`}
        >
            <Grid container columnSpacing={3} sx={{pt:1}}>
                <Grid size={12}>
                    <RHFRadioInput
                        name='status'
                        control={control}
                        rules={{ required: 'Es obligatorio indicar el tipo de cancelación' }}
                        errors={errors}
                        label='Tipo de cancelación'
                        options={statusOptions}
                        row={true}
                    />
                </Grid>
                <Grid size={12}>
                    <BasicTextInput
                        label='Detalles (opcional)'
                        name='notes'
                        type='text'
                        register={register}
                        rules={{}}
                        errors={errors}
                        others={{ multiline: true, rows: 4 }}
                    />
                </Grid>
            </Grid>
        </FormDialog>
    );
}
