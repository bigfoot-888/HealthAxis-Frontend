import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { Grid, Paper, Button, Typography } from '@mui/material';

import { createUser } from '@users//api/user.api';
import { useUsers } from '@users/hooks/useUsers';

import { PasswordInput, BasicTextInput } from '@/components/forms/inputs/index';
import { RoleAutocomplete, AgendaAutocomplete } from '@/components/forms/autocompletes/index';
import { BasicFormLayout } from '@/components/forms/index';
import { handleApiError } from '@/utils/handle-errors';
import { ErrorAlert } from '@/components/ui/index';

import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@/app/SnackBarContext';

export default function CreateUserForm() {
    const {
        register,
        handleSubmit,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({ mode: 'onBlur' });

    const navigate = useNavigate();
    const { refetch: refetchUsers } = useUsers();
    const [error, setError] = useState(null);
    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbar();

    const onSubmit = async (data) => {
        try {
            await createUser(data);
            refetchUsers();
            await queryClient.invalidateQueries({ queryKey: ['users', data.agenda.uuid] });
            navigate('/users');
            showSnackbar({ message: 'Usuario creado correctamente' });
        } catch (err) {
            handleApiError(err, setError, setFormError);
        }
    };

    return (
        <BasicFormLayout drawer={false}>
            <Paper variant='surface-form-outlined' sx={{ width: '480px', p: 4 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={1} sx={{ p: 1 }}>
                        <Grid container size={12} sx={{ justifyContent: 'start', pb: 2 }}>
                            <Typography variant='h2'>Añadir Usuario</Typography>
                        </Grid>
                        <Grid size={12}>
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
                        <Grid size={12}>
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
                            <PasswordInput
                                register={register}
                                errors={errors}
                                rules={{
                                    required: 'La contraseña es obligatoria',
                                    minLength: {
                                        value: 6,
                                        message: 'Mínimo 6 caracteres',
                                    },
                                    maxLength: {
                                        value: 255,
                                        message: 'Máximo 255 caracteres',
                                    },
                                }}
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
                            <AgendaAutocomplete
                                control={control}
                                errors={errors}
                                rules={{ required: 'La agenda es obligatoria' }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <RoleAutocomplete control={control} rules={{ required: 'El rol es obligatorio.' }} />
                        </Grid>

                        <ErrorAlert error={error} onErrorClose={() => setError(null)} />

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
