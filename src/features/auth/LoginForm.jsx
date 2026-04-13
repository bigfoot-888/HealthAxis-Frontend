import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Grid, Box, Paper } from '@mui/material';
import { Typography, Button, IconButton } from '@mui/material';
import { FormControl, TextField } from '@mui/material';
import { OutlinedInput, InputLabel, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import loginBgImage from '@auth/assets/login-bg.jpg';
import { login } from '@auth/auth-api';

import { handleApiError } from '@/utils/handle-errors';

import {ErrorAlert, FullLogo} from '@/components/ui/index';

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData(e.currentTarget);
            const formData = Object.fromEntries(data);
            await login(formData);
            navigate('/');
        } catch (err) {
            handleApiError(err, setError, null); 
        }
    };

    return (
        <Box
            variant=''
            styles={{
                position: 'relative',
                overflow: 'hidden',
                height: '100vh',
                backgroundColor: '#ffffff',
                padding: 0,
                margin: 0,
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 30,
                    left: 30,
                    backgroundColor: '#ffffff',
                }}
            >
                <FullLogo />
            </Box>
            <Box
                component='img'
                src={loginBgImage}
                alt=''
                sx={{
                    position: 'fixed',
                    top: 136,
                    left: -326,
                    zIndex: 0,
                    pointerEvents: 'none',
                    width: '965px',
                }}
            />

            <Paper
                variant='surface-form-outlined'
                sx={{
                    position: 'absolute',
                    right: 0,
                    width: '66.667%',
                    height: '100%',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box sx={{ width: '480px', p: 4, my: 'auto' }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2} sx={{ p: 1 }}>
                            <Grid
                                container
                                size={12}
                                sx={{ justifyContent: 'start', pb: 4 }}
                            >
                                <Typography variant='h2'>
                                    Inicie Sesión
                                </Typography>
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    id='email-textfield'
                                    label='Correo'
                                    name='email'
                                    sx={{ width: '100%' }}
                                />
                            </Grid>
                            <Grid size={12}>
                                <FormControl fullWidth variant='outlined'>
                                    <InputLabel htmlFor='outlined-adornment-password'>
                                        Contraseña
                                    </InputLabel>
                                    <OutlinedInput
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        name='password'
                                        endAdornment={
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    aria-label={
                                                        showPassword
                                                            ? 'ocultar contraseña'
                                                            : 'mostrar contraseña'
                                                    }
                                                    onClick={
                                                        handleClickShowPassword
                                                    }
                                                    edge='end'
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOff />
                                                    ) : (
                                                        <Visibility />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label='Contraseña'
                                    />
                                </FormControl>
                            </Grid>
                            <Grid size={12}>
                                <ErrorAlert error={error} onErrorClose={()=>setError(null)}/>
                            </Grid>
                            <Grid
                                container
                                justifyContent='space-end'
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
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Paper>
        </Box>
    );
}
