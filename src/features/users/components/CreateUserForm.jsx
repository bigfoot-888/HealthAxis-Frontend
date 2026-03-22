import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { Grid, Paper, TextField, Button, Typography } from '@mui/material';

import { createUser } from '@users//api/user-api';
import { useUsers } from '@users//hooks/useUsers';

import { PasswordInput, BasicTextInput } from '@/components/forms/inputs/index';
import { RoleAutocomplete } from '@/components/forms/autocompletes/index';
import { BasicFormLayout } from '@/components/forms/index';
import { handleApiError } from '@/utils/handle-errors';
import { ErrorAlert } from '@/components/ui/index';

export default function CreateUserForm() {
    const {
        register,
        handleSubmit,
        control,
        setError: setFormError,
        formState: { errors },
    } = useForm({ mode: 'onBlur' });

    const navigate = useNavigate();
    const { refetch } = useUsers();
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        try {
            await createUser(data);
            refetch();
            navigate('/users');
        } catch (err) {
            handleApiError(err, setError, setFormError);
        }
    };

    return (
        <BasicFormLayout>
            <Paper variant='surface-form-outlined' sx={{ width: '480px', p: 4 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={1} sx={{ p: 1 }}>
                        <Grid container size={12} sx={{ justifyContent: 'start', pb: 2 }}>
                            <Typography variant='h2'>Añadir Usuario</Typography>
                        </Grid>

                        <ErrorAlert error={error} onErrorClose={() => setError(null)} />
                        <Grid size={12}>
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
                        <Grid size={12}>
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
                            <PasswordInput register={register} errors={errors} />
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
                        <Grid size={12}>
                            <RoleAutocomplete control={control} errors={errors} />
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
