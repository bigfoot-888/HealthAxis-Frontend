import DrawerHeader from '../../../components/layout/DrawerHeader';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ROLE_LABELS } from '../../../config/roles';

import { updateUser } from '../api/user-api';
import { Link, useNavigate } from 'react-router';

import { useUsers } from '../hooks/useUsers';

import { useForm, Controller } from 'react-hook-form';

export default function UpdateUserForm({ user, uuid }) {
    const {
        register,
        handleSubmit,
        control,
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
    const onSubmit = async (data) => {
        try {
            await updateUser(uuid, data);
            queryClient.invalidateQueries(['user', uuid]);
            refetch();
            navigate('/users');
        } catch (err) {
            console.log(err);
        }
    };
    React.useEffect(() => {
    if (user) {
        reset({
            ...user,
            role: ROLE_LABELS[user.role] || ''
        });
    }
    }, [user, reset]);

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
                            <Grid
                                container
                                size={12}
                                sx={{ justifyContent: 'start', pb: 2 }}
                            >
                                <Typography variant='h2'>
                                    Editar datos de...
                                </Typography>
                            </Grid>
                            <Grid size={12} sx={{ justifyContent: 'center' }}>
                                <TextField
                                    label='Nombre'
                                    name='name'
                                    id='name-textfield'
                                    fullWidth
                                    {...register('name', {
                                        required: 'El nombre es obligatorio',
                                    })}
                                    error={!!errors.name}
                                    helperText={errors.name?.message || ' '}
                                />
                            </Grid>
                            <Grid size={12} sx={{ justifyContent: 'center' }}>
                                <TextField
                                    label='Apellidos'
                                    name='surname'
                                    id='surname-textfield'
                                    fullWidth
                                    {...register('surname', {
                                        required:
                                            'Los apellidos son obligatorios',
                                    })}
                                    error={!!errors.surname}
                                    helperText={errors.surname?.message || ' '}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    id='email-textfield'
                                    label='Correo'
                                    name='email'
                                    sx={{ width: '100%' }}
                                    {...register('email', {
                                        required: 'El correo es obligatorio',
                                    })}
                                    error={!!errors.email}
                                    helperText={errors.email?.message || ' '}
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
