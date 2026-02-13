import { TextField } from "@mui/material";

export default function DialogFormInput({label, name, register, rules, errors, type, placeholder=''}) {
  return (
    <TextField
        label={label}
        name={name}
        type={type}
        variant="standard"
        fullWidth
        {...register(name, rules)}
        error={!!errors[name]}
        helperText={errors[name]?.message || ' '}
        placeholder = {placeholder}
    />
  )
}