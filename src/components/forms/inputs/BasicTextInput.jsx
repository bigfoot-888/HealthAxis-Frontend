import { TextField } from '@mui/material';

export default function BasicTextInput({
    label,
    name,
    register,
    rules,
    errors,
    type,
    placeholder = '',
    others = null,
}) {
    return (
        <TextField
            label={label}
            name={name}
            type={type}
            fullWidth
            {...register(name, rules)}
            error={!!errors[name]}
            helperText={errors[name]?.message || ' '}
            placeholder={placeholder}
            {...others}
        />
    );
}
