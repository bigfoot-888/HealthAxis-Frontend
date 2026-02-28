import FormDialog from '../../../components/FormDialog';
import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form';
import DialogFormInput from '../../../components/forms/DialogFormInput';
import { Dialog, Grid } from '@mui/material';
import RHFDatePicker from '../../../components/forms/RHFDatePicker'; 
import { useAgendas } from '../hooks/useAgendas';
import { createAgendaPeriod } from '../api/agenda-period-api';

export default function CreateAgendaForm({
    agenda,
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
            await createAgendaPeriod(agenda.uuid, data); 
            refetch();
            handleClose(); 
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <FormDialog
            open={!!agenda}
            handleClose={handleClose}
            handleSubmit={handleSubmit(onSubmit)}
            title={`Abrir nuevo periodo para la agenda "${!!agenda && agenda.name}"`}
        >
            <Grid container rowSpacing={1.5} columnSpacing={3} sx={{ pt: 3 }}>
                <Grid size={6}>
                    <RHFDatePicker
                        name='opening_date'
                        control={control}
                        rules={{ required: 'La fecha de apertura es obligatoria' }}
                        label='Fecha de apertura'
                    />
                </Grid>
                <Grid size={6}>
                    <RHFDatePicker
                        name='closing_date'
                        control={control}
                        rules={{ required: 'La fecha de cierre es obligatoria' }}
                        label='Fecha de cierre'
                    />
                </Grid>
            </Grid>
        </FormDialog>
    );
}
