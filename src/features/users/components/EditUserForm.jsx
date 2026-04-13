import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import { Grid, Paper, Button, TextField, Typography } from '@mui/material';

import { updateUser } from '@users/api/user.api';
import { useUsers } from '@users/hooks/useUsers';

import { BasicFormLayout } from '@/components/forms/index';
import { ErrorAlert } from '@/components/ui/index';

import { BasicTextInput } from '@/components/forms/inputs/index';
import { ROLE_LABELS } from '@/config/roles';
import { handleApiError } from '@/utils/handle-errors';

export default function UpdateUserForm({ user, uuid }) {
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
            name: '',
            surname: '',
            email: '',
            phone: '',
        },
    });

    const navigate = useNavigate();
    const { refetch } = useUsers();
    const queryClient = useQueryClient();
    const [error, setError] = useState(null);
    const onSubmit = async (data) => {
        try {
            await updateUser(uuid, data);
            queryClient.invalidateQueries(['user', uuid]);
            refetch();
            navigate('/users');
        } catch (err) {
            handleApiError(err, setError, setFormError);
        }
    };
    useEffect(() => {
        if (user) {
            reset({
                ...user,
                role: ROLE_LABELS[user.role] || '',
            });
        }
    }, [user, reset]);

    return (
        <BasicFormLayout>
            <Paper variant='surface-form-outlined' sx={{ width: '480px', p: 4 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={1} sx={{ p: 1 }}>
                        <Grid container size={12} sx={{ justifyContent: 'start', pb: 2 }}>
                            <Typography variant='h2'>Editar datos de...</Typography>
                        </Grid>

                        <ErrorAlert error={error} onErrorClose={() => setError(null)} />

                        <Grid size={12} sx={{ justifyContent: 'center' }}>
                            <BasicTextInput
                                label='Nombre'
                                name='name'
                                type='text'
                                register={register}
                                rules={{
                                    required: 'El nombre es obligatorio',
                                }}
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12} sx={{ justifyContent: 'center' }}>
                            <BasicTextInput
                                label='Apellidos'
                                name='surname'
                                type='text'
                                register={register}
                                rules={{
                                    required: 'Los apellidos son obligatorios',
                                }}
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
                                label='Correo'
                                name='email'
                                type='email'
                                register={register}
                                rules={{
                                    required: 'El correo es obligatorio',
                                }}
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
                                label='Teléfono'
                                name='phone'
                                register={register}
                                rules={{ required: 'El teléfono es obligatorio' }}
                                placeholder='999999999'
                                type='tel'
                                errors={errors}
                            />
                        </Grid>
                        <Grid container justifyContent='space-between' size={12} sx={{ marginTop: 2 }}>
                            <Grid>
                                <Button variant='contained' size='large' type='submit'>
                                    Aceptar
                                </Button>
                            </Grid>
                            <Grid>
                                <Button variant='outlined' size='large' component={Link} to='/users'>
                                    Cancelar
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </BasicFormLayout>
    );
}
