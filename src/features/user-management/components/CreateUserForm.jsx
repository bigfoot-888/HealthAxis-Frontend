import {TextField,Autocomplete} from '@mui/material';
import { Grid, Paper, Stack, Box } from '@mui/material';
import { Button, Typography } from '@mui/material';

import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

import DrawerHeader from '../../../components/layout/DrawerHeader';
import { ROLE_LABELS } from '../../../config/roles';
import { createUser } from '../api/user-api';
import { useUsers } from '../hooks/useUsers';
import BasicFormInput from '../../../components/forms/BasicFormInput';
import PasswordFormInput from '../../../components/forms/PasswordFormInput';

export default function CreateUserForm() {
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
    } = useForm({ mode: 'onBlur' });

    const navigate = useNavigate();
    const { refetch } = useUsers();

    const onSubmit = async (data) => {
        try {
            await createUser(data);
            refetch();
            navigate('/users');
        } catch (err) {
            const { message, details } = err.response.data;
            if (details?.fields) {
                details.fields.forEach((f) => {
                    setError(f.path, { type: 'server', message: f.msg });
                });
            } else if (details?.email) {
                setError('email', { type: 'server', message: details.email });
            } else {
                alert(message);
            }
        }
    };

    return (
        <Stack sx={{ flexDirection: 'column', height: '100%', mb: 8 }}>
            <DrawerHeader />
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Paper
                    variant='surface-form-outlined'
                    sx={{ width: '480px', p: 4 }}
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={1} sx={{ p: 1 }}>
                            <Grid container size={12} sx={{ justifyContent: 'start', pb: 2 }}>
                                <Typography variant='h2'>
                                    Añadir Usuario
                                </Typography>
                            </Grid>
                            <Grid size={12}>
                                <BasicFormInput
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
                                <BasicFormInput
                                    label='Apellidos'
                                    name='surname'
                                    type="text"
                                    register={register}
                                    rules={{
                                        required: 'Los apellidos son obligatorios',
                                    }}
                                    errors={errors}
                                />
                            </Grid>
                            <Grid size={12}>
                                <BasicFormInput
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
                                <PasswordFormInput
                                    register={register}
                                    errors={errors}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label='Teléfono'
                                    type='tel'
                                    name='phone'
                                    fullWidth
                                    placeholder='+34 999 999 999'
                                    {...register('phone', {
                                        required: 'El teléfono es obligatorio',
                                    })}
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message || ' '}
                                />
                            </Grid>
                            <Grid size={12}>
                                <Controller
                                    name='role'
                                    control={control}
                                    rules={{
                                        required: 'El cargo es obligatorio',
                                    }}
                                    render={({ field }) => (
                                        <Autocomplete
                                            {...field}
                                            onChange={(_, value) =>
                                                field.onChange(value)
                                            }
                                            value={field.value || null}
                                            disablePortal
                                            name='role'
                                            options={Object.values(ROLE_LABELS)}
                                            fullWidth
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label='Cargo'
                                                    error={!!errors.role}
                                                    helperText={
                                                        errors.role?.message ||
                                                        ' '
                                                    }
                                                />
                                            )}
                                        />
                                    )}
                                ></Controller>
                            </Grid>
                            <Grid
                                container
                                justifyContent='space-between'
                                size={12}
                                sx={{ marginTop: 2 }}
                            >
                                <Grid>
                                    <Button
                                        variant='contained'
                                        size='large'
                                        type='submit'
                                    >
                                        Aceptar
                                    </Button>
                                </Grid>
                                <Grid>
                                    <Button
                                        variant='outlined'
                                        size='large'
                                        component={Link}
                                        to='/users'
                                    >
                                        Cancelar
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
        </Stack>
    );
}
