import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Controller } from 'react-hook-form';
import { FormHelperText } from '@mui/material';

export default function SelectInput({ control, name, rules, label, items }) {
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field, fieldState }) => (
                <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel id={`basic-select-label-${name}`}>{label}</InputLabel>
                    <Select
                        {...field}
                        labelId={`basic-select-label-${name}`}
                        id={`basic-select-${name}`}
                        label={label}
                        value={field.value ?? ''}
                    >
                        {Object.entries(items).map(([value, text]) => (
                            <MenuItem key={value} value={value}>
                                {text}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{fieldState.error?.message || ' '}</FormHelperText>
                </FormControl>
            )}
        />
    );
}
