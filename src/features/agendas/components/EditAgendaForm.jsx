import FormDialog from '../../../components/FormDialog';
import { useForm } from 'react-hook-form';
import DialogFormInput from '../../../components/forms/DialogFormInput';
import { Grid } from '@mui/material';
import { useAgendas } from '../hooks/useAgendas';
import { updateAgenda } from '../api/agenda-api';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function EditAgendaForm({ agenda, handleClose }) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        reset,
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            name: agenda?.name || '',
        },
    });
    const { refetch } = useAgendas();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const onSubmit = async (data) => {
        try {
            await updateAgenda(agenda.uuid, data);
            queryClient.invalidateQueries(['agenda', agenda.uuid]);
            refetch();
            handleClose(); 
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        if (agenda) {
            reset({
                ...agenda,
            });
        }
    }, [agenda, reset]);

    return (
        <FormDialog
            open={!!agenda}
            handleClose={handleClose}
            handleSubmit={handleSubmit(onSubmit)}
            title='Editar agenda'
        >
            <Grid container rowSpacing={1.5} columnSpacing={3} sx={{ p: 1 }}>
                <Grid size={12}>
                    <DialogFormInput
                        label='Nombre'
                        name='name'
                        type='text'
                        rules={{ required: 'El nombre es obligatorio' }}
                        errors={errors}
                        register={register}
                    />
                </Grid>
            </Grid>
        </FormDialog>
    );
}
