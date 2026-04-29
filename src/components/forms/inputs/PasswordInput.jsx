
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

export default function PasswordInput({errors, register, rules, name = "password", label = "Contraseña"}) {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <FormControl fullWidth variant='outlined' error={!!errors.password}>
            <InputLabel htmlFor='outlined-adornment-password'>{label}</InputLabel>
            <OutlinedInput
                type={showPassword ? 'text' : 'password'}
                name={name}
                endAdornment={
                    <InputAdornment position='end'>
                        <IconButton
                            aria-label={showPassword ? 'ocultar contraseña' : 'mostrar contraseña'}
                            onClick={handleClickShowPassword}
                            edge='end'
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                label={label}
                {...register(name, rules)}
            />
            <FormHelperText error={!!errors[name]}>{errors[name]?.message || ' '}</FormHelperText>
        </FormControl>
    );
}
