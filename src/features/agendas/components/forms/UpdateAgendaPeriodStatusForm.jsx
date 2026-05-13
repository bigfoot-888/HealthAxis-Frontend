import { useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import { useState } from 'react';

import { RHFRadioInput } from '@/components/forms/inputs/index';
import { FormDialog } from '@/components/dialogs/index';
import { handleApiError } from '@/utils/handle-errors';

import { AGENDA_PERIOD_STATUS_CONFIG } from '@/shared/constants/agenda.constants';
import { useDiagnoses } from '@diagnoses/hooks/useDiagnoses';

import { useSnackbar } from '@/app/SnackBarContext';
import { updateAgendaPeriodStatus } from '../../api/agenda.api';
import { invalidateCreateAgendaQueries } from '../../utils/agenda-query.utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function UpdateAgendaPeriodStatusForm({ agenda, handleClose }) {
    const {
        register,
        handleSubmit,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({ mode: 'onBlur', defaultValues: { agendaStatus: '' } });
    const [error, setError] = useState(null);
    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient(); 

    const onSubmit = async (data) => {
        try {
            await updateAgendaPeriodStatus(agenda.uuid, agenda.activePeriod.uuid, {agendaStatus: data.agendaStatus})
            invalidateCreateAgendaQueries(queryClient)
            handleClose();
            showSnackbar({ message: 'Estado del periodo de la agenda actualizado correctamente' });
        } catch (err) {
            console.log("ERROR")
            handleApiError(err, setError, setFormError);
        }
    };

    const statusOptions = Object.entries(AGENDA_PERIOD_STATUS_CONFIG).map(([value, config]) => ({
        value,
        label: config.label,
    }));
    
    return (
        <FormDialog
            open={!!agenda}
            handleClose={handleClose}
            handleSubmit={handleSubmit(onSubmit)}
            error={error}
            onErrorClose={() => setError(null)}
            title={`Actualizar del periodo de la agenda ${!!agenda && agenda.name}`}
        >
            <Grid container columnSpacing={3} sx={{ pt: 1 }}>
                <Grid size={12}>
                    <RHFRadioInput
                        name='agendaStatus'
                        control={control}
                        rules={{ required: 'Es obligatorio indicar el nuevo estado' }}
                        errors={errors}
                        label='Nuevo estado'
                        options={statusOptions}
                        row={true}
                    />
                </Grid>
            </Grid>
        </FormDialog>
    );
}
