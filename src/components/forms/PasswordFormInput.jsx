
import {
    FormControl,
    InputLabel,
    InputAdornment,
    OutlinedInput,
    FormHelperText,
} from '@mui/material';

import { IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

export default function PasswordFormInput({errors, register}) {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <FormControl fullWidth variant='outlined' error={!!errors.password}>
            <InputLabel htmlFor='outlined-adornment-password'>
                Contraseña
            </InputLabel>
            <OutlinedInput
                type={showPassword ? 'text' : 'password'}
                name='password'
                endAdornment={
                    <InputAdornment position='end'>
                        <IconButton
                            aria-label={
                                showPassword
                                    ? 'ocultar contraseña'
                                    : 'mostrar contraseña'
                            }
                            onClick={handleClickShowPassword}
                            edge='end'
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                label='Contraseña'
                {...register('password', {
                    required: 'La contraseña es obligatoria',
                })}
            />
            <FormHelperText>{errors.password?.message || ' '}</FormHelperText>
        </FormControl>
    );
}
