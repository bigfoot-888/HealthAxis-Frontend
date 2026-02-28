import FormDialog from '../../../components/FormDialog';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, Grid } from '@mui/material';
import { useAppointments } from '../hooks/useAppointments';
import { updateAppointmentState } from '../api/appointment-api';
import RHFRadioInput from '../../../components/forms/RHFRadioInput';
import BasicFormInput from '../../../components/forms/BasicFormInput';
import { useState } from 'react';
export default function CancelAppointmentForm({ appointment, handleClose }) {
    const {
        register,
        handleSubmit,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({ mode: 'onBlur', defaultValues: { state: "NO_SHOW" }, });
    const { refetch } = useAppointments();
    const [error, setError] = useState(null);
    const onSubmit = async (data) => {
        try {
            await updateAppointmentState(appointment.uuid, data.state, data.notes);
            refetch();
            handleClose();
        } catch (err) {
            setError(err.response.data.message); 
        }
    };
    const statusOptions = [
        { value: 'NO_SHOW', label: 'No presentado' },
        { value: 'CANCELLED', label: 'Cancelado' },
    ];

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
                        name='state'
                        control={control}
                        rules={{ required: 'Es obligatorio indicar el tipo de cancelación' }}
                        errors={errors}
                        label='Tipo de cancelación'
                        options={statusOptions}
                        row={true}
                    />
                </Grid>
                <Grid size={12}>
                    <BasicFormInput
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
