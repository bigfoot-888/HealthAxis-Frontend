import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import { Grid, Paper, Button, Typography } from '@mui/material';

import { updateUser } from '@users/api/user.api';
import { useUsers } from '@users/hooks/useUsers';

import { BasicFormLayout } from '@/components/forms/index';
import { ErrorAlert } from '@/components/ui/index';

import { BasicTextInput } from '@/components/forms/inputs/index';
import { handleApiError } from '@/utils/handle-errors';
import { RoleAutocomplete } from '@/components/forms/autocompletes';
import { useSnackbar } from '@/app/SnackBarContext';

export default function EditUserForm({ user, uuid }) {
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
            roles: [],
        },
    });

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/users';

    const { refetch } = useUsers();
    const queryClient = useQueryClient();
    const [error, setError] = useState(null);
    const { showSnackbar } = useSnackbar();

    const onSubmit = async (data) => {
        try {
            await updateUser(uuid, data);
            queryClient.invalidateQueries(['user', uuid]);
            refetch();
            navigate(from);
            showSnackbar({ message: 'Usuario editado correctamente' });
        } catch (err) {
            handleApiError(err, setError, setFormError);
        }
    };
    useEffect(() => {
        if (user) {
            reset({
                ...user,
                roles: user.roles?.map((r) => r.name ?? r) ?? [],
            });
        }
    }, [user, reset]);

    return (
        <BasicFormLayout drawer={false}>
            <Paper variant='surface-form-outlined' sx={{ width: '480px', p: 4 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={1} sx={{ p: 1 }}>
                        <Grid container size={12} sx={{ justifyContent: 'start', pb: 2 }}>
                            <Typography variant='h2'>{`Editar datos de ${user.name} ${user.surname}`}</Typography>
                        </Grid>

                        <Grid size={12} sx={{ justifyContent: 'center' }}>
                            <BasicTextInput
                                label='Nombre'
                                name='name'
                                type='text'
                                register={register}
                                rules={{
                                    required: 'El nombre es obligatorio',
                                    maxLength: {
                                        value: 50,
                                        message: 'Máximo 50 caracteres',
                                    },
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
                                    maxLength: {
                                        value: 60,
                                        message: 'Máximo 60 caracteres',
                                    },
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
                                    maxLength: {
                                        value: 100,
                                        message: 'Máximo 100 caracteres',
                                    },
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Formato inválido. Ejemplo: nombre@ejemplo.com',
                                    },
                                }}
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                            <BasicTextInput
                                label='Teléfono'
                                name='phone'
                                register={register}
                                rules={{
                                    required: 'El teléfono es obligatorio',
                                    maxLength: {
                                        value: 20,
                                        message: 'Máximo 20 caracteres',
                                    },
                                    pattern: {
                                        value: /^[0-9+()\s-]+$/,
                                        message: 'Formato inválido. Ejemplo: 612345678 o +34 612 345 678',
                                    },
                                }}
                                placeholder='999999999'
                                type='tel'
                                errors={errors}
                            />
                        </Grid>
                        <Grid size={12}>
                            <RoleAutocomplete control={control} rules={{ required: 'El rol es obligatorio' }} />
                        </Grid>

                        <ErrorAlert error={error} onErrorClose={() => setError(null)} />

                        <Grid container justifyContent='space-between' size={12} sx={{ marginTop: 2 }}>
                            <Grid>
                                <Button variant='contained' size='large' type='submit'>
                                    Aceptar
                                </Button>
                            </Grid>
                            <Grid>
                                <Button variant='outlined' size='large' component={Link} to={from}>
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
