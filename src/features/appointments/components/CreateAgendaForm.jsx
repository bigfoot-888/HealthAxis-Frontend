import FormDialog from '../../../components/FormDialog';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form';
import DialogFormInput from '../../../components/forms/DialogFormInput';
import { Dialog, Grid } from '@mui/material';
import RHFDatePicker from '../../../components/forms/RHFDatePicker'; 
import { useAgendas } from '../hooks/useAgendas';
import { createAgenda } from '../api/agenda-api';

export default function CreateAgendaForm({
    openCreateForm,
    handleClose,
}) {
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
    } = useForm({ mode: 'onBlur' });
    const { refetch } = useAgendas();
    const onSubmit = async (data) => {
        try {
            console.log("hoal")
            await createAgenda(data);
            refetch();
            handleClose(); 
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <FormDialog
            open={openCreateForm}
            handleClose={handleClose}
            handleSubmit={handleSubmit(onSubmit)}
            title='Añadir nueva agenda'
        >
            <Grid container rowSpacing={1.5} columnSpacing={3} sx={{ p: 1 }}>
                <Grid size={12}>
                    <DialogFormInput
                        label="Nombre"
                        name="name"
                        type="text"
                        rules={{required: "El nombre es obligatorio"}}
                        errors={errors}
                        register={register}
                    />
                </Grid>
                <Grid size={6}>
                    <Controller
                        name='opening_date'
                        control={control}
                        rules={{
                            required: 'La fecha de apertura es obligatoria',
                        }}
                        render={({ field, fieldState }) => (
                            <RHFDatePicker
                                {...field}
                                name={field.name}
                                label='Fecha de apertura'
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={!!errors.opening_date}
                                helperText={errors.opening_date?.message}
                                isTouched={fieldState.isTouched}
                            />
                        )}
                    />
                </Grid>
                <Grid size={6}>
                    <Controller
                        name='closing_date'
                        control={control}
                        rules={{
                            required: 'La fecha de cierre es obligatoria',
                        }}
                        render={({ field, fieldState }) => (
                            <RHFDatePicker
                                {...field}
                                name={field.name}
                                label='Fecha de cierre'
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={!!errors.closing_date}
                                helperText={errors.closing_date?.message}
                                isTouched={fieldState.isTouched}
                            />
                        )}
                    />
                </Grid>
            </Grid>
        </FormDialog>
    );
}
