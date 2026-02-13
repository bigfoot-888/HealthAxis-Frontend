import { TextField } from "@mui/material";

export default function BasicFormInput({label, name, register, rules, errors, type, placeholder='' }) {
  return (
    <TextField
        label={label}
        name={name}
        type={type}
        fullWidth
        {...register(name, rules)}
        error={!!errors[name]}
        helperText={errors[name]?.message || ' '}
        placeholder = {placeholder}
    />
  )
}