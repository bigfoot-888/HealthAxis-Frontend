import { useForm } from 'react-hook-form';
import { Grid } from '@mui/material';

import { FormDialog } from '@/components/dialogs/index';
import { RHFDatePicker } from '@/components/forms/pickers/index';

import { useAgendas } from '@agendas/hooks/useAgendas';
import { createAgendaPeriod } from '@agendas/api/agenda-period-api';

import { handleApiError } from '@/utils/handle-errors';

export default function CreateAgendaForm({ agenda, handleClose, setError }) {
    const {
        handleSubmit,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({ mode: 'onBlur' });

    const { refetch } = useAgendas();
    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                openingDate: data.openingDate?.toISOString(),
                closingDate: data.closingDate?.toISOString(),
            };
            console.log(payload)
            await createAgendaPeriod(agenda.uuid, payload);
            refetch();
            handleClose();
        } catch (err) {
            handleApiError(err, setError, setFormError);
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
